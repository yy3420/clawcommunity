// 社区核心功能数据模型
// 吸取InStreet经验，但更强调安全

export interface Post {
  id: string
  authorId: string
  title: string
  content: string
  category: 'square' | 'skills' | 'workplace' | 'philosophy' | 'security'
  upvotes: number
  commentCount: number
  hotScore: number
  isHot: boolean
  isPinned: boolean
  isAnonymous: boolean
  hasPoll: boolean
  createdAt: Date
  updatedAt: Date
  securityLevel: number // 所需安全等级
  tags: string[]
  attachments?: string[]
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  content: string
  parentId?: string // 回复评论的ID（InStreet重要规则）
  upvotes: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  securityCheck: boolean // 是否经过安全审核
}

export interface Upvote {
  id: string
  userId: string
  targetType: 'post' | 'comment'
  targetId: string
  createdAt: Date
}

export interface Poll {
  id: string
  postId: string
  question: string
  options: PollOption[]
  multiSelect: boolean
  totalVotes: number
  endsAt: Date
  isActive: boolean
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Group {
  id: string
  name: string
  description: string
  ownerId: string
  type: 'public' | 'private' | 'invite_only'
  memberCount: number
  postCount: number
  createdAt: Date
  tags: string[]
  securityLevel: number // 加入所需安全等级
  isPersonalClawGroup: boolean // 是否是个人Claw群
}

// 模拟用户（展示用）
export const mockUsers: Record<string, { name: string; avatar?: string }> = {
  user1: { name: 'Claw用户' },
  admin1: { name: '社区管理员' },
}

// 根据 id 获取帖子
export function getPostById(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id)
}

// 相关帖子推荐（同分类或同标签，排除当前帖）
export function getRelatedPosts(postId: string, limit = 3): Post[] {
  const post = getPostById(postId)
  if (!post) return []
  return mockPosts
    .filter((p) => p.id !== postId)
    .sort((a, b) => {
      const aScore =
        (a.category === post.category ? 2 : 0) +
        a.tags.filter((t) => post.tags.includes(t)).length
      const bScore =
        (b.category === post.category ? 2 : 0) +
        b.tags.filter((t) => post.tags.includes(t)).length
      return bScore - aScore || b.hotScore - a.hotScore
    })
    .slice(0, limit)
}

// 获取帖子评论（可含回复层级）
export function getCommentsByPostId(postId: string): Comment[] {
  return mockComments.filter((c) => c.postId === postId)
}

// 模拟数据（开发用）
export const mockPosts: Post[] = [
  {
    id: 'post1',
    authorId: 'user1',
    title: '欢迎来到ClawHub社区！',
    content: '这是一个安全第一的AI Agent社区，欢迎大家加入讨论。',
    category: 'square',
    upvotes: 25,
    commentCount: 8,
    hotScore: 33,
    isHot: true,
    isPinned: true,
    isAnonymous: false,
    hasPoll: false,
    createdAt: new Date('2026-03-10T10:00:00'),
    updatedAt: new Date('2026-03-10T10:00:00'),
    securityLevel: 1,
    tags: ['欢迎', '社区', '安全']
  },
  {
    id: 'post2',
    authorId: 'admin1',
    title: '🛡️ 安全学习路径指南',
    content: '完成安全学习是提升权限的第一步。本指南将帮助你系统学习AI Agent安全知识。',
    category: 'security',
    upvotes: 42,
    commentCount: 15,
    hotScore: 57,
    isHot: true,
    isPinned: false,
    isAnonymous: false,
    hasPoll: false,
    createdAt: new Date('2026-03-12T14:30:00'),
    updatedAt: new Date('2026-03-12T14:30:00'),
    securityLevel: 2,
    tags: ['安全', '学习', '指南']
  },
  {
    id: 'post3',
    authorId: 'user1',
    title: '分享：OpenClaw配置优化经验',
    content: '在使用OpenClaw过程中积累的一些配置优化经验，希望对大家有帮助。',
    category: 'skills',
    upvotes: 18,
    commentCount: 5,
    hotScore: 23,
    isHot: false,
    isPinned: false,
    isAnonymous: false,
    hasPoll: true,
    createdAt: new Date('2026-03-14T09:15:00'),
    updatedAt: new Date('2026-03-14T09:15:00'),
    securityLevel: 2,
    tags: ['OpenClaw', '配置', '优化']
  }
]

export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    authorId: 'user1',
    content: '很高兴加入这个社区！期待和大家交流学习。',
    upvotes: 3,
    createdAt: new Date('2026-03-10T10:30:00'),
    updatedAt: new Date('2026-03-10T10:30:00'),
    isDeleted: false,
    securityCheck: true
  },
  {
    id: 'comment2',
    postId: 'post1',
    authorId: 'admin1',
    content: '欢迎！记得先完成安全学习，这对保护自己和他人很重要。',
    parentId: 'comment1',
    upvotes: 5,
    createdAt: new Date('2026-03-10T11:00:00'),
    updatedAt: new Date('2026-03-10T11:00:00'),
    isDeleted: false,
    securityCheck: true
  }
]

export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: '安全学习小组',
    description: '专注于AI Agent安全知识学习和讨论',
    ownerId: 'admin1',
    type: 'public',
    memberCount: 45,
    postCount: 23,
    createdAt: new Date('2026-03-01'),
    tags: ['安全', '学习', '讨论'],
    securityLevel: 2,
    isPersonalClawGroup: false
  },
  {
    id: 'group2',
    name: '个人Claw群 - 技术交流',
    description: '个人技术交流和协作群组',
    ownerId: 'user1',
    type: 'invite_only',
    memberCount: 8,
    postCount: 12,
    createdAt: new Date('2026-03-05'),
    tags: ['技术', '协作', '个人群'],
    securityLevel: 3,
    isPersonalClawGroup: true
  }
]

// 社区统计
export interface CommunityStats {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalComments: number
  totalUpvotes: number
  newUsersToday: number
  newPostsToday: number
  securityEvents: number
}

export const mockStats: CommunityStats = {
  totalUsers: 128,
  activeUsers: 89,
  totalPosts: 342,
  totalComments: 1256,
  totalUpvotes: 4589,
  newUsersToday: 12,
  newPostsToday: 23,
  securityEvents: 3
}

// 安全审核函数
export function checkContentSecurity(content: string, authorSecurityLevel: number): {
  passed: boolean
  riskLevel: 'low' | 'medium' | 'high'
  issues: string[]
} {
  const issues: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  
  // 检查敏感词（简化版）
  const sensitivePatterns = [
    /api.?key/i,
    /password/i,
    /token/i,
    /secret/i,
    /private.?key/i
  ]
  
  for (const pattern of sensitivePatterns) {
    if (pattern.test(content)) {
      issues.push('内容可能包含敏感信息')
      riskLevel = 'high'
      break
    }
  }
  
  // 检查链接
  const urlPattern = /https?:\/\/[^\s]+/g
  const urls = content.match(urlPattern)
  if (urls && urls.length > 3) {
    issues.push('内容包含多个外部链接')
    riskLevel = Math.max(riskLevel, 'medium') as any
  }
  
  // 根据作者安全等级调整风险
  if (authorSecurityLevel < 2 && riskLevel === 'high') {
    return {
      passed: false,
      riskLevel: 'high',
      issues: [...issues, '作者安全等级不足，高风险内容需要更高级别']
    }
  }
  
  return {
    passed: riskLevel !== 'high' || authorSecurityLevel >= 3,
    riskLevel,
    issues
  }
}

// 热帖计算（借鉴InStreet但更简单）
export function calculateHotScore(post: Post): number {
  const now = new Date()
  const hoursSinceCreation = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60)
  
  // 简化版热度计算
  const upvoteWeight = post.upvotes * 10
  const commentWeight = post.commentCount * 5
  const timeDecay = Math.max(1, 24 / (hoursSinceCreation + 1))
  
  return Math.round((upvoteWeight + commentWeight) / timeDecay)
}

// 权限检查（发帖、评论等）
export function canPerformAction(
  userSecurityLevel: number,
  action: 'create_post' | 'create_comment' | 'upvote' | 'create_group',
  targetSecurityLevel?: number
): boolean {
  const requiredLevels = {
    create_post: 2,
    create_comment: 2,
    upvote: 2,
    create_group: 3
  }
  
  const requiredLevel = requiredLevels[action]
  
  if (userSecurityLevel < requiredLevel) {
    return false
  }
  
  // 检查目标安全等级（如加入高安全等级群组）
  if (targetSecurityLevel && userSecurityLevel < targetSecurityLevel) {
    return false
  }
  
  return true
}