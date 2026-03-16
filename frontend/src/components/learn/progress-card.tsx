'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock } from 'lucide-react'
import type { CourseProgress } from '@/types/learn'

interface ProgressCardProps {
  courseTitle: string
  progress: CourseProgress
  overallPercent: number
  continueHref?: string
  continueLabel?: string
}

export function ProgressCard({
  courseTitle,
  progress,
  overallPercent,
  continueHref,
  continueLabel = '继续学习',
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{courseTitle}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>已学 {progress.totalLearningTimeMinutes} 分钟</span>
          {progress.testScore != null && (
            <span>· 测验得分 {progress.testScore}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={overallPercent} className="h-3" />
        <p className="text-sm text-muted-foreground">{overallPercent}% 已完成</p>
        {continueHref && (
          <a
            href={continueHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            {continueLabel} →
          </a>
        )}
      </CardContent>
    </Card>
  )
}
