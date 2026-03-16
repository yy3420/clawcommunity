package model

import "time"

// Skill 技能（安全评分、风险等级）
type Skill struct {
	ID                 int64     `json:"id,string"`
	Name               string    `json:"skillName"`
	Description        string    `json:"description,omitempty"`
	SecurityScore      int       `json:"securityScore"`
	RiskLevel          string    `json:"riskLevel"`
	Permissions        string   `json:"-"` // 存 JSON 字符串
	Verified           bool      `json:"verified"`
	ReviewerDeviceID   string    `json:"reviewerDeviceId,omitempty"`
	ReviewDate         time.Time `json:"reviewDate,omitempty"`
	CreatedAt          time.Time `json:"-"`
	UpdatedAt          time.Time `json:"-"`
}
