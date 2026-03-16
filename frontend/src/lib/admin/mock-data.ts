import type { AdminUser, ModerationItem, Report, SecurityEvent, StatsOverview, TrendPoint } from './types'

export const mockUsers: AdminUser[] = [
  { id: '1', email: 'alice@example.com', nickname: 'Alice', role: 'admin', status: 'active', postCount: 42, commentCount: 128, lastActiveAt: '2025-03-15T10:00:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { id: '2', email: 'bob@example.com', nickname: 'Bob', role: 'moderator', status: 'active', postCount: 28, commentCount: 96, lastActiveAt: '2025-03-15T09:30:00Z', createdAt: '2024-02-20T00:00:00Z' },
  { id: '3', email: 'carol@example.com', nickname: 'Carol', role: 'user', status: 'active', postCount: 15, commentCount: 52, lastActiveAt: '2025-03-14T18:00:00Z', createdAt: '2024-03-10T00:00:00Z' },
  { id: '4', email: 'dave@example.com', nickname: 'Dave', role: 'user', status: 'banned', postCount: 3, commentCount: 8, lastActiveAt: '2025-03-10T12:00:00Z', createdAt: '2024-04-01T00:00:00Z', bannedAt: '2025-03-10T14:00:00Z', banReason: '违规发言' },
  { id: '5', email: 'eve@example.com', nickname: 'Eve', role: 'user', status: 'active', postCount: 0, commentCount: 2, lastActiveAt: '2025-03-15T08:00:00Z', createdAt: '2025-03-01T00:00:00Z' },
]

export const mockModerationPosts: ModerationItem[] = [
  { id: 'p1', type: 'post', authorId: '6', authorName: '新用户A', content: '这是一条待审核的帖子内容，包含可能敏感的信息...', status: 'pending', createdAt: '2025-03-15T09:00:00Z', reportedCount: 2 },
  { id: 'p2', type: 'post', authorId: '7', authorName: '用户B', content: '正常讨论内容，已通过初审。', status: 'approved', createdAt: '2025-03-14T16:00:00Z' },
  { id: 'p3', type: 'post', authorId: '8', authorName: '用户C', content: '违规广告内容...', status: 'rejected', createdAt: '2025-03-14T10:00:00Z' },
]

export const mockModerationComments: ModerationItem[] = [
  { id: 'c1', type: 'comment', authorId: '9', authorName: '用户D', content: '待审核的评论内容', status: 'pending', createdAt: '2025-03-15T08:30:00Z', postId: 'post-1', postTitle: '主题帖标题' },
  { id: 'c2', type: 'comment', authorId: '10', authorName: '用户E', content: '另一条待审核评论', status: 'pending', createdAt: '2025-03-15T08:45:00Z', postId: 'post-2', postTitle: '另一个主题' },
]

export const mockReports: Report[] = [
  { id: 'r1', targetType: 'post', targetId: 'p1', targetPreview: '这是一条待审核的帖子内容...', reason: 'spam', reporterId: 'u1', reporterName: '举报人A', status: 'pending', createdAt: '2025-03-15T09:15:00Z' },
  { id: 'r2', targetType: 'comment', targetId: 'c1', targetPreview: '待审核的评论内容', reason: 'abuse', description: '人身攻击', reporterId: 'u2', reporterName: '举报人B', status: 'reviewing', createdAt: '2025-03-15T08:50:00Z' },
  { id: 'r3', targetType: 'user', targetId: '4', targetPreview: 'Dave', reason: 'other', reporterId: 'u3', reporterName: '举报人C', status: 'resolved', createdAt: '2025-03-10T13:00:00Z', resolvedAt: '2025-03-10T14:00:00Z', resolvedBy: 'admin' },
]

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 's1', type: 'login_fail', level: 'medium', title: '多次登录失败', description: 'IP 192.168.1.100 在 5 分钟内登录失败 10 次', ip: '192.168.1.100', createdAt: '2025-03-15T10:05:00Z', resolved: false },
  { id: 's2', type: 'spam', level: 'high', title: '疑似批量发帖', description: '用户 新用户A 在 1 小时内发布 20 条相似内容', userId: '6', userEmail: 'spam@example.com', createdAt: '2025-03-15T09:30:00Z', resolved: false },
  { id: 's3', type: 'anomaly', level: 'low', title: '异常活跃', description: '用户 Carol 今日访问量突增', userId: '3', createdAt: '2025-03-15T08:00:00Z', resolved: true },
  { id: 's4', type: 'brute_force', level: 'critical', title: '暴力破解尝试', description: '检测到对 API 的暴力请求', ip: '10.0.0.1', createdAt: '2025-03-14T22:00:00Z', resolved: true },
]

export const mockStatsOverview: StatsOverview = {
  totalUsers: 1248,
  newUsersToday: 23,
  newUsersWeek: 156,
  activeUsersToday: 412,
  activeUsersWeek: 892,
  totalPosts: 5680,
  newPostsToday: 42,
  newCommentsToday: 186,
  pendingModeration: 12,
}

export const mockUserGrowthTrend: TrendPoint[] = [
  { date: '03-09', value: 120 }, { date: '03-10', value: 135 }, { date: '03-11', value: 128 }, { date: '03-12', value: 142 }, { date: '03-13', value: 138 }, { date: '03-14', value: 156 }, { date: '03-15', value: 23 },
]

export const mockActivityTrend: TrendPoint[] = [
  { date: '03-09', value: 380 }, { date: '03-10', value: 395 }, { date: '03-11', value: 412 }, { date: '03-12', value: 388 }, { date: '03-13', value: 420 }, { date: '03-14', value: 398 }, { date: '03-15', value: 412 },
]

export const mockContentTrend: TrendPoint[] = [
  { date: '03-09', value: 52 }, { date: '03-10', value: 48 }, { date: '03-11', value: 61 }, { date: '03-12', value: 55 }, { date: '03-13', value: 58 }, { date: '03-14', value: 42 }, { date: '03-15', value: 42 },
]
