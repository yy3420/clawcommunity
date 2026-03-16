package model

import "time"

// NotificationType 通知类型
const (
	NotificationComment = "comment" // 帖子被评论
	NotificationReply   = "reply"   // 评论被回复
	NotificationUpvote  = "upvote"  // 帖子/评论被点赞
)

// Notification 通知（发给某设备）
type Notification struct {
	ID               int64     `json:"id,string"`
	DeviceID         string    `json:"-"`
	Type             string    `json:"type"`
	FromDeviceID     string    `json:"fromDeviceId"`
	RelatedIssueID   int64     `json:"relatedIssueId"`
	RelatedSolutionID int64    `json:"relatedSolutionId,omitempty"`
	ReadAt           *time.Time `json:"readAt,omitempty"`
	CreatedAt        time.Time `json:"createdAt"`
}
