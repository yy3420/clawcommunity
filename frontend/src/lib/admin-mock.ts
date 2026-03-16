import type {
  AdminUser,
  ModerationPost,
  ModerationComment,
  Report,
  SecurityEvent,
  AnomalyDetection,
  UserGrowthPoint,
  ActivityStats,
  ContentTrendPoint,
} from '@/types/admin'

const now = new Date()
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

export const mockUsers: AdminUser[] = [
  { id: '1', username: 'alice', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: fmt(daysAgo(90)), lastActiveAt: fmt(now), postCount: 42, commentCount: 128 },
  { id: '2', username: 'bob', email: 'bob@example.com', role: 'moderator', status: 'active', createdAt: fmt(daysAgo(60)), lastActiveAt: fmt(daysAgo(1)), postCount: 18, commentCount: 56 },
  { id: '3', username: 'carol', email: 'carol@example.com', role: 'user', status: 'active', createdAt: fmt(daysAgo(30)), lastActiveAt: fmt(now), postCount: 5, commentCount: 22 },
  { id: '4', username: 'dave', email: 'dave@example.com', role: 'user', status: 'banned', createdAt: fmt(daysAgo(120)), lastActiveAt: fmt(daysAgo(15)), postCount: 0, commentCount: 0 },
  { id: '5', username: 'eve', email: 'eve@example.com', role: 'user', status: 'active', createdAt: fmt(daysAgo(7)), lastActiveAt: fmt(now), postCount: 2, commentCount: 8 },
]

export const mockPosts: ModerationPost[] = [
  { id: 'p1', title: '如何入门 ClawHub？', author: 'alice', authorId: '1', content: '内容摘要...', status: 'approved', createdAt: fmt(daysAgo(2)), reportCount: 0 },
  { id: 'p2', title: '社区规范建议', author: 'bob', authorId: '2', content: '内容摘要...', status: 'pending', createdAt: fmt(daysAgo(1)), reportCount: 1 },
  { id: 'p3', title: '违规测试帖', author: 'dave', authorId: '4', content: '内容摘要...', status: 'rejected', createdAt: fmt(daysAgo(5)), reportCount: 3 },
]

export const mockComments: ModerationComment[] = [
  { id: 'c1', content: '很好的分享！', author: 'carol', authorId: '3', postId: 'p1', postTitle: '如何入门 ClawHub？', status: 'approved', createdAt: fmt(daysAgo(1)), reportCount: 0 },
  { id: 'c2', content: '待审核评论内容...', author: 'eve', authorId: '5', postId: 'p1', postTitle: '如何入门 ClawHub？', status: 'pending', createdAt: fmt(now), reportCount: 1 },
]

export const mockReports: Report[] = [
  { id: 'r1', targetType: 'post', targetId: 'p2', targetTitle: '社区规范建议', reporter: 'carol', reason: '垃圾信息', description: '疑似广告', status: 'pending', createdAt: fmt(daysAgo(1)) },
  { id: 'r2', targetType: 'comment', targetId: 'c2', reporter: 'alice', reason: '不当言论', status: 'resolved', createdAt: fmt(daysAgo(3)), resolvedAt: fmt(daysAgo(2)), resolvedBy: 'admin' },
]

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'e1', type: 'login_failed', level: 'warning', message: '多次登录失败', userId: '4', username: 'dave', ip: '192.168.1.1', createdAt: new Date(daysAgo(0)).toISOString() },
  { id: 'e2', type: 'post_flagged', level: 'info', message: '帖子被举报', userId: '5', username: 'eve', createdAt: new Date(daysAgo(0)).toISOString() },
  { id: 'e3', type: 'role_changed', level: 'info', message: '用户角色变更', userId: '2', username: 'bob', createdAt: new Date(daysAgo(1)).toISOString() },
  { id: 'e4', type: 'suspicious_activity', level: 'critical', message: '异常发帖频率', userId: '4', username: 'dave', ip: '192.168.1.1', createdAt: new Date(daysAgo(2)).toISOString() },
]

export const mockAnomalies: AnomalyDetection[] = [
  { id: 'a1', type: 'spam', description: '同一用户短时间大量相似回复', severity: 'high', count: 12, affectedUsers: ['dave'], detectedAt: new Date(daysAgo(2)).toISOString(), status: 'resolved' },
  { id: 'a2', type: 'abnormal_post', description: '单日发帖量异常升高', severity: 'medium', count: 1, detectedAt: new Date(daysAgo(0)).toISOString(), status: 'new' },
]

export const mockUserGrowth: UserGrowthPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = daysAgo(13 - i)
  return { date: fmt(d), total: 1200 + i * 8, newUsers: 5 + (i % 4), activeUsers: 180 + (i % 20) }
})

export const mockActivityStats: ActivityStats[] = Array.from({ length: 7 }, (_, i) => {
  const d = daysAgo(6 - i)
  return { date: fmt(d), dau: 150 + (i * 12), posts: 20 + (i % 5), comments: 80 + (i % 15), logins: 200 + (i * 8) }
})

export const mockContentTrend: ContentTrendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = daysAgo(13 - i)
  return { date: fmt(d), posts: 25 + (i % 8), comments: 90 + (i % 25), reports: (i % 3) }
})
