import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle2, Circle, BookOpen, FileText } from 'lucide-react'
import { getCourseBySlug, getCategoryById } from '@/lib/learn/courses'
import { getProgressByCourseId, getChapterProgress, getKnowledgePointProgress, getOverallProgressPercent } from '@/lib/learn/progress'

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()
  const category = getCategoryById(course.categoryId)
  const progress = getProgressByCourseId(course.id)
  const overallPercent = progress ? getOverallProgressPercent(progress) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {category && (
            <Link
              href={`/learn/categories/${category.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-1">{course.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary">
            {course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}
          </Badge>
          {progress && (
            <Badge variant={progress.status === 'completed' ? 'default' : 'outline'}>
              {progress.status === 'completed' ? '已完成' : '进行中'}
            </Badge>
          )}
        </div>
      </div>

      {progress && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">学习进度</CardTitle>
            <CardDescription>
              已学习 {progress.totalLearningTimeMinutes} 分钟
              {progress.testScore != null && ` · 测验得分 ${progress.testScore}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallPercent} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{overallPercent}% 已完成</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">课程目录</h2>
        <div className="space-y-4">
          {course.chapters.map((chapter, chIndex) => {
            const chProg = progress ? getChapterProgress(progress, chapter.id) : null
            const chCompleted = chProg?.status === 'completed'
            return (
              <Card key={chapter.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {chCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        第 {chIndex + 1} 章 {chapter.title}
                      </CardTitle>
                      <CardDescription>{chapter.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-12">
                  <ul className="space-y-2">
                    {chapter.knowledgePoints.map((kp, kpIndex) => {
                      const kpProg = chProg ? getKnowledgePointProgress(chProg, kp.id) : null
                      const kpCompleted = kpProg?.status === 'completed'
                      return (
                        <li key={kp.id}>
                          <Link
                            href={`/learn/courses/${course.slug}/chapters/${chapter.id}/points/${kp.id}`}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            {kpCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="flex-1">{kp.title}</span>
                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {kp.durationMinutes} 分钟
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {progress?.status !== 'completed' && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/learn/courses/${course.slug}/chapters/${course.chapters[0]?.id}/points/${course.chapters[0]?.knowledgePoints[0]?.id}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              {progress ? '继续学习' : '开始学习'}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
