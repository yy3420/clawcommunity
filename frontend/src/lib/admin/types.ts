// 用户管理
export type UserRole = 'admin' | 'moderator' | 'user' | 'banned'
export type UserStatus = 'active' | 'banned' | 'suspended'

export interface AdminUser {
  id: string
  email: string
  nickname: string
  avatar?: string
  role: UserRole
  status: UserStatus
  postCount: number
  commentCount: number
  lastActiveAt: string
  createdAt: string
  bannedAt?: string
  banReason?: string
}

// 内容审核
export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type ContentType = 'post' | 'comment'

export interface ModerationItem {
  id: string
  type: ContentType
  authorId: string
  authorName: string
  content: string
  status: ContentStatus
  createdAt: string
  reportedCount?: number
  postId?: string
  postTitle?: string
}

// 举报
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed'
export type ReportReason = 'spam' | 'abuse' | 'illegal' | 'other'

export interface Report {
  id: string
  targetType: 'post' | 'comment' | 'user'
  targetId: string
  targetPreview: string
  reason: ReportReason
  description?: string
  reporterId: string
  reporterName: string
  status: ReportStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

// 安全监控
export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical'
export type SecurityEventType = 'login_fail' | 'brute_force' | 'spam' | 'abuse' | 'anomaly' | 'other'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  level: SecurityLevel
  title: string
  description: string
  userId?: string
  userEmail?: string
  ip?: string
  metadata?: Record<string, unknown>
  createdAt: string
  resolved: boolean
}

// 运营统计
export interface StatsOverview {
  totalUsers: number
  newUsersToday: number
  newUsersWeek: number
  activeUsersToday: number
  activeUsersWeek: number
  totalPosts: number
  newPostsToday: number
  newCommentsToday: number
  pendingModeration: number
}

export interface TrendPoint {
  date: string
  value: number
  label?: string
}
