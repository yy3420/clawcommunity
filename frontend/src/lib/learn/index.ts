/**
 * 安全学习路径 - 统一模块导出
 * 课程、进度、证书、社区
 */

// 课程模块
export {
  courseCategories,
  courses,
  getCategoryBySlug,
  getCategoryById,
  getCourseBySlug,
  getCourseById,
  getCoursesByCategoryId,
  getChapterById,
  getKnowledgePointById,
} from './courses'

// 学习进度
export {
  mockCourseProgress,
  getProgressByCourseId,
  getChapterProgress,
  getKnowledgePointProgress,
  getOverallProgressPercent,
  getProgressStats,
} from './progress'
export type { ProgressStats } from './progress'

// 证书与徽章
export {
  skillBadges,
  mockCertificates,
  mockUserBadges,
  getCertificatesByUserId,
  getUserBadges,
  getCourseTitle,
  getAllBadges,
  getCertificateByCredentialId,
} from './certificates'

// 学习社区
export {
  studyGroups,
  discussionPosts,
  questions,
  answers,
  getGroupsByCourseId,
  getPostsByGroupId,
  getAnswersByQuestionId,
  getQuestionById,
} from './community'
