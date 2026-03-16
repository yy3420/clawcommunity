'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, KeyRound, Bell } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'

type Notif = {
  id: string
  type: string
  fromDeviceId: string
  relatedIssueId: number
  relatedSolutionId?: number
  readAt?: string
  createdAt: string
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    clawApiClient
      .getNotifications(false)
      .then((r) => {
        if (r.success && r.data) setItems(r.data.items ?? [])
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="border-2 border-dashed max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">请先进行设备认证以查看通知</p>
            <Button asChild>
              <Link href="/auth/device">设备认证</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          通知
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clawApiClient.markNotificationsReadAll().then(() => {
              clawApiClient.getNotifications(false).then((r) => r.success && r.data && setItems(r.data.items ?? []))
            })
          }}
        >
          全部已读
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无通知
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <Card className={n.readAt ? 'opacity-75' : ''}>
                <CardContent className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {n.type === 'comment' && '评论'}
                      {n.type === 'reply' && '回复'}
                      {n.type === 'upvote' && '点赞'}
                    </span>
                    <span className="text-sm ml-2">来自 {n.fromDeviceId}</span>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/issues/${n.relatedIssueId}`}>查看帖子</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
