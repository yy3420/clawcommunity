import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { getCourseBySlug, getChapterById, getKnowledgePointById } from '@/lib/learn/courses'
import { getProgressByCourseId, getChapterProgress, getKnowledgePointProgress } from '@/lib/learn/progress'
import { MarkCompleteButton } from '@/components/learn'

export default async function KnowledgePointPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string; pointId: string }>
}) {
  const { slug, chapterId, pointId } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()
  const chapter = getChapterById(course.id, chapterId)
  if (!chapter) notFound()
  const point = getKnowledgePointById(chapter, pointId)
  if (!point) notFound()

  const progress = getProgressByCourseId(course.id)
  const chProg = progress ? getChapterProgress(progress, chapter.id) : null
  const kpProg = chProg ? getKnowledgePointProgress(chProg, point.id) : null

  const chIndex = course.chapters.findIndex((ch) => ch.id === chapter.id)
  const kpIndex = chapter.knowledgePoints.findIndex((kp) => kp.id === point.id)
  const prevPoint = kpIndex > 0 ? chapter.knowledgePoints[kpIndex - 1] : null
  const nextPoint = kpIndex < chapter.knowledgePoints.length - 1 ? chapter.knowledgePoints[kpIndex + 1] : null
  const nextChapter = !nextPoint && chIndex < course.chapters.length - 1 ? course.chapters[chIndex + 1] : null
  const nextPointInNextChapter = nextChapter?.knowledgePoints[0] ?? null

  const nextHref = nextPoint
    ? `/learn/courses/${slug}/chapters/${chapterId}/points/${nextPoint.id}`
    : nextPointInNextChapter
      ? `/learn/courses/${slug}/chapters/${nextChapter.id}/points/${nextPointInNextChapter.id}`
      : `/learn/courses/${slug}`

  const prevHref = kpIndex > 0
    ? `/learn/courses/${slug}/chapters/${chapterId}/points/${chapter.knowledgePoints[kpIndex - 1].id}`
    : chIndex > 0
      ? (() => {
          const prevCh = course.chapters[chIndex - 1]
          const lastKp = prevCh.knowledgePoints[prevCh.knowledgePoints.length - 1]
          return `/learn/courses/${slug}/chapters/${prevCh.id}/points/${lastKp.id}`
        })()
      : `/learn/courses/${slug}`

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/learn/courses/${slug}`} className="hover:text-foreground">
          {course.title}
        </Link>
        <span>/</span>
        <span>{chapter.title}</span>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {kpProg?.status === 'completed' && (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            )}
            <CardTitle className="text-2xl">{point.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>约 {point.durationMinutes} 分钟</span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="whitespace-pre-wrap">{point.content}</p>
          <div className="flex items-center justify-between pt-2 border-t">
            <MarkCompleteButton
              courseSlug={slug}
              chapterId={chapter.id}
              pointId={point.id}
              isCompleted={kpProg?.status === 'completed'}
              nextHref={nextHref}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" asChild>
          <Link href={prevHref}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            上一节
          </Link>
        </Button>
        <Button asChild>
          <Link href={nextHref}>
            下一节
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
