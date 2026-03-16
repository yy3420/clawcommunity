import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle2, BookOpen, TrendingUp, Award } from 'lucide-react'
import { courses } from '@/lib/learn/courses'
import {
  mockCourseProgress,
  getProgressByCourseId,
  getOverallProgressPercent,
  getProgressStats,
} from '@/lib/learn/progress'
import { ProgressCard } from '@/components/learn'

const MOCK_USER_ID = 'user-1'

export default function ProgressPage() {
  const stats = getProgressStats(MOCK_USER_ID)
  const inProgress = mockCourseProgress.filter((p) => p.userId === MOCK_USER_ID && p.status === 'in_progress')
  const completed = mockCourseProgress.filter((p) => p.userId === MOCK_USER_ID && p.status === 'completed')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">学习进度</h1>
        <p className="text-muted-foreground mt-1">完成状态、学习时长与测验成绩一览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLearningMinutes}</div>
            <p className="text-xs text-muted-foreground">分钟</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCount}</div>
            <p className="text-xs text-muted-foreground">门课程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressCount}</div>
            <p className="text-xs text-muted-foreground">门课程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">未开始</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notStartedCount}</div>
            <p className="text-xs text-muted-foreground">门课程</p>
          </CardContent>
        </Card>
      </div>

      {/* 测验成绩 */}
      {stats.testScores.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            测验成绩
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.testScores.map(({ courseId, courseTitle, score }) => (
              <Card key={courseId}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{courseTitle}</p>
                    <p className="text-sm text-muted-foreground">得分 {score}/100</p>
                  </div>
                  <Badge variant={score >= 90 ? 'default' : score >= 60 ? 'secondary' : 'outline'}>
                    {score >= 90 ? '优秀' : score >= 60 ? '及格' : '未及格'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 进行中 - 进度卡片 */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">进行中的课程</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((prog) => {
              const course = courses.find((c) => c.id === prog.courseId)
              if (!course) return null
              const percent = getOverallProgressPercent(prog)
              return (
                <ProgressCard
                  key={prog.courseId}
                  courseTitle={course.title}
                  progress={prog}
                  overallPercent={percent}
                  continueHref={`/learn/courses/${course.slug}`}
                  continueLabel="继续学习"
                />
              )
            })}
          </div>
        </section>
      )}

      {/* 已完成 */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">已完成的课程</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((prog) => {
              const course = courses.find((c) => c.id === prog.courseId)
              if (!course) return null
              const percent = getOverallProgressPercent(prog)
              return (
                <ProgressCard
                  key={prog.courseId}
                  courseTitle={course.title}
                  progress={prog}
                  overallPercent={percent}
                  continueHref={`/learn/courses/${course.slug}`}
                  continueLabel="查看课程"
                />
              )
            })}
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/learn">返回学习中心</Link>
        </Button>
      </div>
    </div>
  )
}
