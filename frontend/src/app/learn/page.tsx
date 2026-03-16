import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, ArrowRight, Award, Users } from 'lucide-react'
import { courseCategories, courses } from '@/lib/learn/courses'
import { mockCourseProgress, getProgressByCourseId, getOverallProgressPercent } from '@/lib/learn/progress'
import { getCertificatesByUserId } from '@/lib/learn/certificates'
import { studyGroups } from '@/lib/learn/community'

const MOCK_USER_ID = 'user-1'

export default function LearnPage() {
  const certs = getCertificatesByUserId(MOCK_USER_ID)
  const inProgress = mockCourseProgress.filter((p) => p.status === 'in_progress')
  const completedCount = mockCourseProgress.filter((p) => p.status === 'completed').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">安全学习路径</h1>
        <p className="text-muted-foreground mt-1">系统化学习网络安全，跟踪进度，获取证书与徽章</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">进行中课程</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress.length}</div>
            <p className="text-xs text-muted-foreground">继续学习</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">门课程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">证书</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certs.length}</div>
            <p className="text-xs text-muted-foreground">张证书</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">学习小组</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyGroups.length}</div>
            <p className="text-xs text-muted-foreground">可加入</p>
          </CardContent>
        </Card>
      </div>

      {/* 进行中的课程 */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">继续学习</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((prog) => {
              const course = courses.find((c) => c.id === prog.courseId)
              if (!course) return null
              const percent = getOverallProgressPercent(prog)
              return (
                <Card key={prog.courseId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
                          {course.title}
                        </Link>
                      </CardTitle>
                      <Badge variant="secondary">{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>已学 {prog.totalLearningTimeMinutes} 分钟</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percent}% 已完成</p>
                    <Button asChild size="sm" className="w-full sm:w-auto">
                      <Link href={`/learn/courses/${course.slug}`}>
                        继续学习 <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* 课程分类 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">课程分类</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courseCategories.map((cat) => {
            const categoryCourses = courses.filter((c) => c.categoryId === cat.id)
            return (
              <Card key={cat.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {cat.name}
                  </CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categoryCourses.map((c) => {
                      const prog = getProgressByCourseId(c.id)
                      const status = prog?.status ?? 'not_started'
                      return (
                        <li key={c.id}>
                          <Link
                            href={`/learn/courses/${c.slug}`}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <span>{c.title}</span>
                            <Badge
                              variant={status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : 'outline'}
                            >
                              {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '未开始'}
                            </Badge>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                    <Link href={`/learn/categories/${cat.slug}`}>查看分类</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
