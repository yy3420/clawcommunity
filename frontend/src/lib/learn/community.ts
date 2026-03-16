import type { StudyGroup, DiscussionPost, Question, Answer } from '@/types/learn'

/** 学习小组 mock */
export const studyGroups: StudyGroup[] = [
  {
    id: 'sg-1',
    name: '网络安全入门学习小组',
    description: '一起学《网络安全入门》，互相答疑',
    courseId: 'course-1',
    memberCount: 28,
    createdAt: '2025-03-01T00:00:00Z',
    isPublic: true,
  },
  {
    id: 'sg-2',
    name: 'Web 安全实战营',
    description: 'Web 安全基础课程讨论与实战',
    courseId: 'course-2',
    memberCount: 15,
    createdAt: '2025-02-10T00:00:00Z',
    isPublic: true,
  },
  {
    id: 'sg-3',
    name: '渗透测试交流群',
    description: '渗透测试方法与工具交流',
    courseId: 'course-3',
    memberCount: 42,
    createdAt: '2025-01-05T00:00:00Z',
    isPublic: true,
  },
]

/** 讨论区帖子 mock */
export const discussionPosts: DiscussionPost[] = [
  {
    id: 'dp-1',
    groupId: 'sg-1',
    authorId: 'u1',
    authorName: '安全小白',
    title: '第一章 CIA 三元组有没有更通俗的解释？',
    content: '看书觉得有点抽象，想听听大家的理解...',
    createdAt: '2025-03-12T10:00:00Z',
    replyCount: 5,
    likeCount: 12,
    tags: ['安全基础', '答疑'],
  },
  {
    id: 'dp-2',
    groupId: 'sg-1',
    authorId: 'u2',
    authorName: '加密爱好者',
    title: '推荐一些密码学入门资源',
    content: '学完第二章想继续深入，有没有书籍或视频推荐？',
    createdAt: '2025-03-11T14:00:00Z',
    replyCount: 8,
    likeCount: 20,
    tags: ['密码学', '资源'],
  },
]

/** 问答 mock */
export const questions: Question[] = [
  {
    id: 'q-1',
    authorId: 'u1',
    authorName: '学习者A',
    title: '对称加密和非对称加密在实际中如何选择？',
    content: '项目中既看到用 AES 又看到用 RSA，什么时候该用哪种？',
    createdAt: '2025-03-10T09:00:00Z',
    answerCount: 3,
    acceptedAnswerId: 'a-2',
    tags: ['密码学', '加密'],
  },
  {
    id: 'q-2',
    authorId: 'u3',
    authorName: '开发者B',
    title: 'SDL 在敏捷团队里怎么落地？',
    content: '我们两周一个迭代，安全评审如何嵌入而不拖慢节奏？',
    createdAt: '2025-03-09T16:00:00Z',
    answerCount: 5,
    tags: ['SDL', '敏捷'],
  },
]

export const answers: Answer[] = [
  {
    id: 'a-1',
    questionId: 'q-1',
    authorId: 'u2',
    authorName: '加密爱好者',
    content: '简单说：大量数据用对称加密（AES），密钥交换或签名用非对称（RSA/ECC）。HTTPS 就是两者结合。',
    createdAt: '2025-03-10T11:00:00Z',
    isAccepted: false,
    upvotes: 15,
  },
  {
    id: 'a-2',
    questionId: 'q-1',
    authorId: 'u4',
    authorName: '安全工程师',
    content: '对称加密效率高，适合加密正文；非对称加密慢，一般只用来加密「对称密钥」或做数字签名。实际中常见组合：RSA 传 AES 密钥，后续用 AES 加密数据。',
    createdAt: '2025-03-10T14:00:00Z',
    isAccepted: true,
    upvotes: 28,
  },
]

export function getGroupsByCourseId(courseId: string): StudyGroup[] {
  return studyGroups.filter((g) => g.courseId === courseId)
}

export function getPostsByGroupId(groupId: string): DiscussionPost[] {
  return discussionPosts.filter((p) => p.groupId === groupId)
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return answers.filter((a) => a.questionId === questionId).sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0))
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}
