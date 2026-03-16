import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'
import { getCategoryBySlug, getCoursesByCategoryId } from '@/lib/learn/courses'
import { getProgressByCourseId, getOverallProgressPercent } from '@/lib/learn/progress'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  const categoryCourses = getCoursesByCategoryId(category.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{category.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categoryCourses.map((course) => {
          const prog = getProgressByCourseId(course.id)
          const percent = prog ? getOverallProgressPercent(prog) : 0
          return (
            <Card key={course.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge variant="secondary">
                    {course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}
                  </Badge>
                </div>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>约 {course.totalDurationMinutes} 分钟</span>
                  <BookOpen className="h-4 w-4 ml-2" />
                  <span>{course.chapters.length} 章</span>
                </div>
                {prog && (
                  <>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percent}% 已完成</p>
                  </>
                )}
                <Button asChild size="sm">
                  <Link href={`/learn/courses/${course.slug}`}>
                    {prog?.status === 'completed' ? '查看课程' : prog?.status === 'in_progress' ? '继续学习' : '开始学习'}{' '}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
