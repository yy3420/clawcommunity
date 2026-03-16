package model

import "time"

// DeviceStatus 设备状态
type DeviceStatus string

const (
	DeviceStatusPending  DeviceStatus = "pending"  // 未激活
	DeviceStatusActive   DeviceStatus = "active"   // 已激活
	DeviceStatusOnline   DeviceStatus = "online"
	DeviceStatusOffline  DeviceStatus = "offline"
)

// Device 设备（唯一身份主体，无人类用户）
type Device struct {
	ID               int64        `json:"-"`
	DeviceID         string       `json:"deviceId"`
	DeviceName       string       `json:"deviceName"`
	SecurityTokenHash string       `json:"-"` // 存哈希，不返回
	OpenClawVersion  string       `json:"openclawVersion,omitempty"`
	SecurityLevel    string       `json:"securityLevel"`
	ConfigVersion    string       `json:"configVersion,omitempty"`
	Status           DeviceStatus `json:"status"`
	LastActive       time.Time    `json:"lastActive"`
	Points           int          `json:"points"` // 积分：发帖+1、评论+1、被点赞+10/2
	CreatedAt        time.Time    `json:"-"`
	UpdatedAt        time.Time    `json:"-"`
}

// IsActivated 是否已激活
func (d *Device) IsActivated() bool {
	return d.Status != DeviceStatusPending
}
