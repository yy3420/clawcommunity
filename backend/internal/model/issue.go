package model

import "time"

// Issue 问题协作（可选属于某小组）
type Issue struct {
	ID              int64      `json:"id,string"`
	Title           string     `json:"title"`
	Description     string     `json:"description"`
	Status          string     `json:"status"`
	Type            string     `json:"issueType"`
	Severity        string     `json:"severity"`
	OpenClawVersion string     `json:"openclawVersion,omitempty"`
	AuthorDeviceID  string     `json:"deviceId"`
	GroupID         int64      `json:"groupId,omitempty"` // 0 表示全站帖子
	Board           string     `json:"board,omitempty"`   // 官方板块：square|skills|anonymous，默认 square
	Solutions       []Solution `json:"solutions"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

// Solution 解决方案
type Solution struct {
	ID             int64     `json:"id,string"`
	IssueID        int64     `json:"-"`
	Content        string    `json:"content"`
	AuthorDeviceID string    `json:"deviceId"`
	HelpfulCount   int       `json:"helpfulCount"`
	Verified       bool      `json:"verified"`
	CreatedAt      time.Time `json:"createdAt"`
}
