package service

import (
	"clawhub/backend/internal/model"
	"clawhub/backend/internal/store"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// AuthService 设备认证（注册、激活、登录、登出）
type AuthService struct {
	store *store.Store
	secret []byte
}

// NewAuthService 创建认证服务
func NewAuthService(st *store.Store, jwtSecret string) *AuthService {
	return &AuthService{store: st, secret: []byte(jwtSecret)}
}

// DeviceClaims JWT 声明（设备维度）
type DeviceClaims struct {
	jwt.RegisteredClaims
	DeviceID string `json:"deviceId"`
}

// Register 设备注册（预注册，未激活）
func (s *AuthService) Register(deviceID, deviceName, securityToken string) (*model.Device, bool, error) {
	// 开发环境存明文；生产应改为 bcrypt 哈希
	tokenHash := securityToken
	d, err := s.store.DeviceCreate(deviceID, deviceName, tokenHash)
	if err != nil {
		if err == store.ErrDeviceExists {
			// 已存在：若已激活则不允许再注册；若未激活可重新下发题目
			existing, _ := s.store.DeviceByID(deviceID)
			if existing.IsActivated() {
				return nil, false, errors.New("device already registered and activated")
			}
			return existing, true, nil
		}
		return nil, false, err
	}
	return d, true, nil
}

// GetActivateChallenge 获取激活题目（非人类题目）；需 deviceId + securityToken 校验
func (s *AuthService) GetActivateChallenge(deviceID, securityToken string) (*model.ActivationChallenge, error) {
	d, ok := s.store.DeviceByID(deviceID)
	if !ok {
		return nil, errors.New("device not found")
	}
	if d.IsActivated() {
		return nil, errors.New("device already activated")
	}
	if d.SecurityTokenHash != securityToken {
		return nil, errors.New("invalid security token")
	}
	// 固定题目：Base64 解码，答案 Hello ClawHub
	chID := store.GenChallengeID()
	ch := &model.ActivationChallenge{
		ChallengeID: chID,
		Question:    "Base64 解码并回答：SGVsbG8gQ2xhd0h1Yg==",
		Answer:      "Hello ClawHub",
	}
	s.store.ChallengeSave(deviceID, ch)
	return ch, nil
}

// Activate 提交激活答案；正确则激活并返回设备
func (s *AuthService) Activate(challengeID, answer, deviceID string) (*model.Device, error) {
	ok := s.store.ChallengeGet(challengeID, answer, deviceID)
	if !ok {
		return nil, errors.New("invalid challenge or answer")
	}
	return s.store.DeviceActivate(deviceID)
}

// Login 已激活设备登录；校验 securityToken 后签发 JWT
func (s *AuthService) Login(deviceID, deviceName, securityToken string) (*model.Device, string, error) {
	d, ok := s.store.DeviceByID(deviceID)
	if !ok {
		return nil, "", errors.New("device not found")
	}
	if !d.IsActivated() {
		return nil, "", errors.New("device not activated; complete activation first")
	}
	if d.SecurityTokenHash != securityToken {
		return nil, "", errors.New("invalid security token")
	}
	s.store.DeviceUpdateLastActive(deviceID)
	d, _ = s.store.DeviceByID(deviceID)
	token, err := s.issueToken(d.DeviceID)
	if err != nil {
		return nil, "", err
	}
	return d, token, nil
}

func (s *AuthService) issueToken(deviceID string) (string, error) {
	now := time.Now()
	exp := now.Add(24 * time.Hour)
	jti := fmt.Sprintf("%s-%d", deviceID, now.UnixNano())
	claims := DeviceClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        jti,
			Subject:   deviceID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(exp),
		},
		DeviceID: deviceID,
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(s.secret)
}

// ValidateToken 校验 JWT 并返回 deviceId、jti、过期时间；若在黑名单返回错误
func (s *AuthService) ValidateToken(tokenString string) (deviceID, jti string, expire time.Time, err error) {
	tok, err := jwt.ParseWithClaims(tokenString, &DeviceClaims{}, func(t *jwt.Token) (interface{}, error) {
		return s.secret, nil
	})
	if err != nil {
		return "", "", time.Time{}, err
	}
	claims, ok := tok.Claims.(*DeviceClaims)
	if !ok || !tok.Valid {
		return "", "", time.Time{}, errors.New("invalid token")
	}
	if s.store.TokenBlacklisted(claims.ID) {
		return "", "", time.Time{}, errors.New("token revoked")
	}
	exp := time.Time{}
	if claims.ExpiresAt != nil {
		exp = claims.ExpiresAt.Time
	}
	return claims.DeviceID, claims.ID, exp, nil
}

// Logout 将 token 加入黑名单
func (s *AuthService) Logout(jti string, expire time.Time) {
	s.store.TokenBlacklistAdd(jti, expire)
}

// Me 返回当前设备信息
func (s *AuthService) Me(deviceID string) (*model.Device, error) {
	d, ok := s.store.DeviceByID(deviceID)
	if !ok {
		return nil, errors.New("device not found")
	}
	return d, nil
}
