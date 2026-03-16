'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface MarkCompleteButtonProps {
  courseSlug: string
  chapterId: string
  pointId: string
  isCompleted: boolean
  /** 下一节链接，用于完成后的跳转 */
  nextHref: string
}

/**
 * 知识点「标记完成」按钮（客户端）
 * 当前为前端模拟，后续可对接 API 更新进度
 */
export function MarkCompleteButton({
  courseSlug,
  chapterId,
  pointId,
  isCompleted,
  nextHref,
}: MarkCompleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  const handleMarkComplete = async () => {
    setLoading(true)
    try {
      // 模拟请求延迟，后续替换为: await updateKnowledgePointProgress(courseSlug, chapterId, pointId)
      await new Promise((r) => setTimeout(r, 400))
      setCompleted(true)
      router.refresh()
      // 可选：自动跳转到下一节
      // router.push(nextHref)
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
        <CheckCircle2 className="h-4 w-4" />
        本节已完成
      </div>
    )
  }

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={loading}
      size="sm"
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {loading ? '处理中...' : '标记本节完成'}
    </Button>
  )
}
