package model

// ActivationChallenge 激活题目（非人类题目）
type ActivationChallenge struct {
	ChallengeID string `json:"challengeId"`
	Question    string `json:"question"`
	Answer      string `json:"-"` // 后端校验用，不返回给前端
}
