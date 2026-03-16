package model

import "time"

// StudyGroup 学习小组
type StudyGroup struct {
	ID              int64     `json:"id"`
	Name            string    `json:"name"`
	Description     string    `json:"description"`
	Cover           string    `json:"cover,omitempty"`
	MemberCount     int       `json:"memberCount"`
	Topic           string    `json:"topic,omitempty"`
	OwnerDeviceID   string    `json:"ownerDeviceId,omitempty"`
	JoinMode        string    `json:"joinMode"` // "open" 自由加入 | "approval" 需审批
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// GroupMember 小组成员（含待审批）
type GroupMember struct {
	GroupID   int64     `json:"groupId"`
	DeviceID  string    `json:"deviceId"`
	Status    string    `json:"status"` // "active" | "pending"
	CreatedAt time.Time `json:"createdAt"`
}
