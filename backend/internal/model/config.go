package model

import "time"

// ConfigTemplate 安全配置模板
type ConfigTemplate struct {
	ID              int64     `json:"id,string"`
	Name            string    `json:"name"`
	Description     string    `json:"description"`
	Category        string    `json:"category,omitempty"`
	SecurityLevel   string    `json:"securityLevel"`
	OpenClawVersion string    `json:"openclawVersion"`
	ConfigType      string    `json:"configType"`
	Content         string    `json:"content"`
	AuthorDeviceID  string    `json:"authorDeviceId"`
	Downloads       int       `json:"downloads"`
	Verified        bool      `json:"verified"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}
