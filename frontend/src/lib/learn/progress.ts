import type { CourseProgress, ChapterProgress, KnowledgePointProgress } from '@/types/learn'
import { courses } from './courses'

/** 当前用户 ID（mock，后续接真实鉴权） */
const MOCK_USER_ID = 'user-1'

/** 用户学习进度 mock */
export const mockCourseProgress: CourseProgress[] = [
  {
    courseId: 'course-1',
    userId: MOCK_USER_ID,
    status: 'in_progress',
    startedAt: '2025-03-01T00:00:00Z',
    totalLearningTimeMinutes: 45,
    testAttempts: 0,
    chapters: [
      {
        chapterId: 'ch-1-1',
        status: 'completed',
        completedAt: '2025-03-05T12:00:00Z',
        knowledgePoints: [
          { knowledgePointId: 'kp-1-1', status: 'completed', completedAt: '2025-03-02T10:00:00Z', learningTimeMinutes: 15 },
          { knowledgePointId: 'kp-1-2', status: 'completed', completedAt: '2025-03-03T11:00:00Z', learningTimeMinutes: 22 },
          { knowledgePointId: 'kp-1-3', status: 'completed', completedAt: '2025-03-05T12:00:00Z', learningTimeMinutes: 25 },
        ],
      },
      {
        chapterId: 'ch-1-2',
        status: 'in_progress',
        knowledgePoints: [
          { knowledgePointId: 'kp-2-1', status: 'completed', completedAt: '2025-03-10T14:00:00Z', learningTimeMinutes: 30 },
          { knowledgePointId: 'kp-2-2', status: 'not_started', learningTimeMinutes: 0 },
        ],
      },
    ],
  },
  {
    courseId: 'course-2',
    userId: MOCK_USER_ID,
    status: 'completed',
    startedAt: '2025-02-15T00:00:00Z',
    completedAt: '2025-02-20T00:00:00Z',
    totalLearningTimeMinutes: 42,
    testScore: 85,
    testAttempts: 1,
    chapters: [
      {
        chapterId: 'ch-2-1',
        status: 'completed',
        completedAt: '2025-02-20T00:00:00Z',
        knowledgePoints: [
          { knowledgePointId: 'kp-3-1', status: 'completed', completedAt: '2025-02-20T00:00:00Z', learningTimeMinutes: 42 },
        ],
      },
    ],
  },
]

export function getProgressByCourseId(courseId: string): CourseProgress | undefined {
  return mockCourseProgress.find((p) => p.courseId === courseId && p.userId === MOCK_USER_ID)
}

export function getChapterProgress(courseProgress: CourseProgress, chapterId: string): ChapterProgress | undefined {
  return courseProgress.chapters.find((ch) => ch.chapterId === chapterId)
}

export function getKnowledgePointProgress(
  chapterProgress: ChapterProgress,
  knowledgePointId: string
): KnowledgePointProgress | undefined {
  return chapterProgress.knowledgePoints.find((kp) => kp.knowledgePointId === knowledgePointId)
}

export function getOverallProgressPercent(courseProgress: CourseProgress): number {
  const course = courses.find((c) => c.id === courseProgress.courseId)
  if (!course) return 0
  let total = 0
  let completed = 0
  for (const ch of course.chapters) {
    for (const _ of ch.knowledgePoints) {
      total++
      const chProg = courseProgress.chapters.find((c) => c.chapterId === ch.id)
      if (chProg) {
        const kpCompleted = chProg.knowledgePoints.filter((kp) => kp.status === 'completed').length
        completed += kpCompleted
      }
    }
  }
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

export interface ProgressStats {
  totalLearningMinutes: number
  completedCount: number
  inProgressCount: number
  notStartedCount: number
  testScores: { courseId: string; courseTitle: string; score: number }[]
}

export function getProgressStats(userId: string): ProgressStats {
  const list = mockCourseProgress.filter((p) => p.userId === userId)
  let totalLearningMinutes = 0
  let completedCount = 0
  let inProgressCount = 0
  const testScores: { courseId: string; courseTitle: string; score: number }[] = []
  for (const p of list) {
    totalLearningMinutes += p.totalLearningTimeMinutes
    if (p.status === 'completed') completedCount++
    else if (p.status === 'in_progress') inProgressCount++
    if (p.testScore != null) {
      const course = courses.find((c) => c.id === p.courseId)
      testScores.push({
        courseId: p.courseId,
        courseTitle: course?.title ?? '未知课程',
        score: p.testScore,
      })
    }
  }
  const allCourseIds = new Set(courses.map((c) => c.id))
  const startedIds = new Set(list.map((p) => p.courseId))
  const notStartedCount = [...allCourseIds].filter((id) => !startedIds.has(id)).length
  return {
    totalLearningMinutes,
    completedCount,
    inProgressCount,
    notStartedCount,
    testScores,
  }
}
