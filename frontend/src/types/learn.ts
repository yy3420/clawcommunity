/**
 * 安全学习路径系统 - 共享类型定义
 */

// ========== 课程模块 ==========
export interface KnowledgePoint {
  id: string
  title: string
  content: string
  durationMinutes: number
  order: number
}

export interface Chapter {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  knowledgePoints: KnowledgePoint[]
}

export interface CourseCategory {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  courseIds: string[]
}

export interface Course {
  id: string
  categoryId: string
  title: string
  slug: string
  description: string
  thumbnail?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  totalDurationMinutes: number
  chapters: Chapter[]
}

// ========== 学习进度 ==========
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

export interface KnowledgePointProgress {
  knowledgePointId: string
  status: CompletionStatus
  completedAt?: string // ISO date
  learningTimeMinutes: number
}

export interface ChapterProgress {
  chapterId: string
  knowledgePoints: KnowledgePointProgress[]
  status: CompletionStatus
  completedAt?: string
}

export interface CourseProgress {
  courseId: string
  userId: string
  status: CompletionStatus
  startedAt: string
  completedAt?: string
  totalLearningTimeMinutes: number
  chapters: ChapterProgress[]
  testScore?: number // 0-100
  testAttempts: number
}

// ========== 证书与徽章 ==========
export interface Certificate {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  issuedAt: string
  credentialId: string
  verifyUrl: string
}

export interface SkillBadge {
  id: string
  name: string
  description: string
  icon: string
  criteria: string // 获得条件描述
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  badge: SkillBadge
}

// ========== 学习社区 ==========
export interface StudyGroup {
  id: string
  name: string
  description: string
  courseId?: string
  memberCount: number
  createdAt: string
  isPublic: boolean
}

export interface DiscussionPost {
  id: string
  groupId?: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: string
  replyCount: number
  likeCount: number
  tags: string[]
}

export interface Question {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: string
  answerCount: number
  acceptedAnswerId?: string
  tags: string[]
}

export interface Answer {
  id: string
  questionId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  isAccepted: boolean
  upvotes: number
}
