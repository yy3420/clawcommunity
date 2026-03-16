// 用户管理
export type UserRole = 'admin' | 'moderator' | 'user' | 'banned'
export interface AdminUser {
  id: string
  username: string
  email: string
  avatar?: string
  role: UserRole
  status: 'active' | 'banned' | 'suspended'
  createdAt: string
  lastActiveAt: string
  postCount: number
  commentCount: number
}

// 内容审核 - 帖子
export type PostStatus = 'pending' | 'approved' | 'rejected'
export interface ModerationPost {
  id: string
  title: string
  author: string
  authorId: string
  content: string
  status: PostStatus
  createdAt: string
  reportCount?: number
}

// 内容审核 - 评论
export type CommentStatus = 'pending' | 'approved' | 'rejected'
export interface ModerationComment {
  id: string
  content: string
  author: string
  authorId: string
  postId: string
  postTitle: string
  status: CommentStatus
  createdAt: string
  reportCount?: number
}

// 举报
export type ReportStatus = 'pending' | 'resolved' | 'dismissed'
export type ReportTargetType = 'post' | 'comment' | 'user'
export interface Report {
  id: string
  targetType: ReportTargetType
  targetId: string
  targetTitle?: string
  reporter: string
  reason: string
  description?: string
  status: ReportStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

// 安全事件
export type SecurityEventLevel = 'info' | 'warning' | 'critical'
export interface SecurityEvent {
  id: string
  type: string
  level: SecurityEventLevel
  message: string
  userId?: string
  username?: string
  ip?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// 异常行为
export interface AnomalyDetection {
  id: string
  type: 'spam' | 'brute_force' | 'abnormal_post' | 'multi_account' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high'
  count: number
  affectedUsers?: string[]
  detectedAt: string
  status: 'new' | 'investigating' | 'resolved'
}

// 运营统计
export interface UserGrowthPoint {
  date: string
  total: number
  newUsers: number
  activeUsers: number
}
export interface ActivityStats {
  date: string
  dau: number
  posts: number
  comments: number
  logins: number
}
export interface ContentTrendPoint {
  date: string
  posts: number
  comments: number
  reports: number
}
