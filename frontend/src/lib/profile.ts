// 用户个人中心相关类型与模拟数据

export interface LearningProgressItem {
  id: string
  courseId: string
  title: string
  description: string
  progress: number // 0-100
  totalSteps: number
  completedSteps: number
  lastStudyAt: Date
}

export const mockLearningProgress: LearningProgressItem[] = [
  {
    id: 'lp1',
    courseId: 'security-basics',
    title: '基础安全入门',
    description: '了解AI Agent基础安全概念',
    progress: 100,
    totalSteps: 5,
    completedSteps: 5,
    lastStudyAt: new Date('2026-03-14')
  },
  {
    id: 'lp2',
    courseId: 'app-security',
    title: '应用安全实践',
    description: '掌握应用层安全配置与防护',
    progress: 60,
    totalSteps: 8,
    completedSteps: 5,
    lastStudyAt: new Date('2026-03-15')
  },
  {
    id: 'lp3',
    courseId: 'community-security',
    title: '社区安全责任',
    description: '理解社区安全规范与责任',
    progress: 0,
    totalSteps: 6,
    completedSteps: 0,
    lastStudyAt: new Date('2026-03-10')
  }
]

export interface UserGroupMembership {
  groupId: string
  groupName: string
  role: 'owner' | 'member'
  joinedAt: Date
}
