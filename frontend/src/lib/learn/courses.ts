import type { Course, CourseCategory, Chapter, KnowledgePoint } from '@/types/learn'

/** 课程分类 mock */
export const courseCategories: CourseCategory[] = [
  {
    id: 'cat-1',
    name: '安全基础',
    slug: 'security-basics',
    description: '网络安全入门与基础概念',
    icon: 'Shield',
    courseIds: ['course-1', 'course-2'],
  },
  {
    id: 'cat-2',
    name: '渗透测试',
    slug: 'penetration-testing',
    description: '渗透测试方法与工具',
    icon: 'Target',
    courseIds: ['course-3'],
  },
  {
    id: 'cat-3',
    name: '安全开发',
    slug: 'secure-development',
    description: '安全编码与SDL',
    icon: 'Code',
    courseIds: ['course-4'],
  },
]

const knowledgePoints1: KnowledgePoint[] = [
  { id: 'kp-1-1', title: '什么是网络安全', content: '网络安全基本定义与范畴...', durationMinutes: 15, order: 1 },
  { id: 'kp-1-2', title: 'CIA 三元组', content: '机密性、完整性、可用性...', durationMinutes: 20, order: 2 },
  { id: 'kp-1-3', title: '威胁与风险', content: '威胁建模与风险评估基础...', durationMinutes: 25, order: 3 },
]
const knowledgePoints2: KnowledgePoint[] = [
  { id: 'kp-2-1', title: '密码学入门', content: '对称加密、非对称加密...', durationMinutes: 30, order: 1 },
  { id: 'kp-2-2', title: '哈希与数字签名', content: '哈希函数、数字签名原理...', durationMinutes: 25, order: 2 },
]
const chapters1: Chapter[] = [
  { id: 'ch-1-1', courseId: 'course-1', title: '安全基础概念', description: '了解安全基本概念', order: 1, knowledgePoints: knowledgePoints1 },
  { id: 'ch-1-2', courseId: 'course-1', title: '密码学基础', description: '密码学核心概念', order: 2, knowledgePoints: knowledgePoints2 },
]
const chapters2: Chapter[] = [
  { id: 'ch-2-1', courseId: 'course-2', title: '漏洞概述', description: '常见漏洞类型', order: 1, knowledgePoints: [{ id: 'kp-3-1', title: 'OWASP Top 10 简介', content: '...', durationMinutes: 40, order: 1 }] },
]
const chapters3: Chapter[] = [
  { id: 'ch-3-1', courseId: 'course-3', title: '信息收集', description: '侦察与信息收集', order: 1, knowledgePoints: [{ id: 'kp-4-1', title: '被动信息收集', content: '...', durationMinutes: 35, order: 1 }] },
]
const chapters4: Chapter[] = [
  { id: 'ch-4-1', courseId: 'course-4', title: '安全编码规范', description: '安全编码最佳实践', order: 1, knowledgePoints: [{ id: 'kp-5-1', title: '输入验证', content: '...', durationMinutes: 30, order: 1 }] },
]

export const courses: Course[] = [
  {
    id: 'course-1',
    categoryId: 'cat-1',
    title: '网络安全入门',
    slug: 'security-intro',
    description: '从零开始理解网络安全核心概念',
    level: 'beginner',
    totalDurationMinutes: 115,
    chapters: chapters1,
  },
  {
    id: 'course-2',
    categoryId: 'cat-1',
    title: 'Web 安全基础',
    slug: 'web-security-basics',
    description: 'Web 常见漏洞与防护',
    level: 'beginner',
    totalDurationMinutes: 40,
    chapters: chapters2,
  },
  {
    id: 'course-3',
    categoryId: 'cat-2',
    title: '渗透测试入门',
    slug: 'pentest-intro',
    description: '渗透测试流程与工具',
    level: 'intermediate',
    totalDurationMinutes: 35,
    chapters: chapters3,
  },
  {
    id: 'course-4',
    categoryId: 'cat-3',
    title: '安全开发生命周期',
    slug: 'sdl',
    description: 'SDL 与安全编码',
    level: 'intermediate',
    totalDurationMinutes: 30,
    chapters: chapters4,
  },
]

export function getCategoryBySlug(slug: string): CourseCategory | undefined {
  return courseCategories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string): CourseCategory | undefined {
  return courseCategories.find((c) => c.id === id)
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug)
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}

export function getCoursesByCategoryId(categoryId: string): Course[] {
  return courses.filter((c) => c.categoryId === categoryId)
}

export function getChapterById(courseId: string, chapterId: string): Chapter | undefined {
  const course = getCourseById(courseId)
  return course?.chapters.find((ch) => ch.id === chapterId)
}

export function getKnowledgePointById(chapter: Chapter, pointId: string): KnowledgePoint | undefined {
  return chapter.knowledgePoints.find((kp) => kp.id === pointId)
}
