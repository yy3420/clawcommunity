package model

import "time"

// Upvote 点赞（帖子或评论），toggle 行为
type Upvote struct {
	DeviceID   string    `json:"-"`
	TargetType string    `json:"-"` // "post" | "comment"
	TargetID   int64    `json:"-"`
	CreatedAt  time.Time `json:"-"`
}
