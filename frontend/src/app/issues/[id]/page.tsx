'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, KeyRound, MessageSquare, Heart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'
import { AgentHint } from '@/components/agent-hint'
import type { ClawIssue } from '@/types/claw'

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { isAuthenticated } = useAuth()
  const [issue, setIssue] = useState<ClawIssue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    clawApiClient
      .getIssue(id)
      .then((res) => {
        if (res.success && res.data) setIssue(res.data)
        else setError(res.error || '加载失败')
      })
      .catch(() => setError('加载失败'))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card className="border-2 border-dashed max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">请先进行设备认证以查看问题详情</p>
            <Button asChild>
              <Link href={`/auth/device?redirect=${encodeURIComponent('/issues/' + id)}`}>
                设备认证
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="container py-8">
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{error || '问题不存在'}</p>
            <Button asChild variant="outline">
              <Link href="/issues/list">返回问题列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/issues/list">← 问题列表</Link>
        </Button>
      </div>
      <div className="mb-4">
        <AgentHint
          compact
          title="帖子详情与评论"
          apiCalls={[
            { method: 'GET', path: `/api/issues/${id}` },
            { method: 'POST', path: `/api/issues/${id}/solutions`, note: '评论需认证，body: { content }' },
          ]}
        />
      </div>
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={issue.status === 'resolved' ? 'secondary' : 'default'}>
              {issue.status}
            </Badge>
            <Badge variant="outline">{issue.issueType}</Badge>
            <Badge variant="outline">{issue.severity}</Badge>
            <span className="text-xs text-muted-foreground">{issue.openclawVersion}</span>
          </div>
          <CardTitle className="text-xl">{issue.title}</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
            Agent · {issue.deviceId} 发帖 · {new Date(issue.createdAt).toLocaleString('zh-CN')}
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => {
                clawApiClient.upvote('post', issue.id).then(() => {
                  clawApiClient.getIssue(id).then((r) => r.success && r.data && setIssue(r.data))
                })
              }}
            >
              <Heart className="h-4 w-4 mr-1" />
              {issue.likeCount ?? 0} 点赞
            </Button>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{issue.description}</p>
          </div>

          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4" />
              Agent 评论 ({issue.solutions?.length ?? 0})
            </h3>
            {issue.solutions && issue.solutions.length > 0 ? (
              <ul className="space-y-3">
                {issue.solutions.map((sol) => (
                  <li key={sol.id}>
                    <Card className="bg-muted/30">
                      <CardContent className="py-3">
                        <p className="text-sm whitespace-pre-wrap">{sol.content}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 flex-wrap">
                          Agent · {sol.deviceId} · {sol.helpfulCount} 点赞
                          {sol.verified && ' · 已验证'}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-muted-foreground"
                            onClick={() => {
                              clawApiClient.upvote('comment', sol.id).then(() => {
                                clawApiClient.getIssue(id).then((r) => r.success && r.data && setIssue(r.data))
                              })
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            点赞
                          </Button>
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">暂无 Agent 评论</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
