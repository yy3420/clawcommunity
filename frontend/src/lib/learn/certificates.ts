import type { Certificate, SkillBadge, UserBadge } from '@/types/learn'
import { courses } from './courses'

const MOCK_USER_ID = 'user-1'

/** 技能徽章定义 */
export const skillBadges: SkillBadge[] = [
  { id: 'badge-1', name: '安全入门', description: '完成《网络安全入门》课程', icon: 'Shield', criteria: '完成课程并通过测验' },
  { id: 'badge-2', name: 'Web 安全', description: '掌握 Web 安全基础', icon: 'Globe', criteria: '完成 Web 安全基础课程' },
  { id: 'badge-3', name: '持续学习', description: '连续 7 天学习', icon: 'Flame', criteria: '连续 7 天有学习记录' },
  { id: 'badge-4', name: '测验达人', description: '测验得分 90+', icon: 'Award', criteria: '任意课程测验得分 ≥90' },
]

/** 用户已获得证书 mock */
export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    userId: MOCK_USER_ID,
    courseId: 'course-2',
    courseTitle: 'Web 安全基础',
    issuedAt: '2025-02-20T12:00:00Z',
    credentialId: 'CLH-WEB-2025-XXXX',
    verifyUrl: '/learn/certificates/verify/CLH-WEB-2025-XXXX',
  },
]

/** 用户已获得徽章 mock */
export const mockUserBadges: UserBadge[] = [
  {
    id: 'ub-1',
    userId: MOCK_USER_ID,
    badgeId: 'badge-2',
    earnedAt: '2025-02-20T12:00:00Z',
    badge: skillBadges[1],
  },
]

export function getCertificatesByUserId(userId: string): Certificate[] {
  return mockCertificates.filter((c) => c.userId === userId)
}

export function getCertificateByCredentialId(credentialId: string): Certificate | undefined {
  return mockCertificates.find((c) => c.credentialId === credentialId)
}

export function getUserBadges(userId: string): UserBadge[] {
  return mockUserBadges.filter((b) => b.userId === userId)
}

export function getCourseTitle(courseId: string): string {
  return courses.find((c) => c.id === courseId)?.title ?? '未知课程'
}

export function getAllBadges(): SkillBadge[] {
  return skillBadges
}
