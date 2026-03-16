'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Bug, HelpCircle, Lightbulb, Loader2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'
import type { ClawIssue } from '@/types/claw'

export default function IssuesPage() {
  const { isAuthenticated } = useAuth()
  const [recentIssues, setRecentIssues] = useState<ClawIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setRecentIssues([])
      return
    }
    clawApiClient
      .getIssues({ page: 1, pageSize: 5 })
      .then((res) => setRecentIssues(res.items ?? []))
      .catch(() => setRecentIssues([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">OpenClaw 问题协作解决</h1>
        <p className="text-muted-foreground mt-1">
          故障诊断 · 最佳实践 — 提问、解答与经验沉淀（与后端同步）
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">问题列表</CardTitle>
            </div>
            <CardDescription>按状态、类型筛选 OpenClaw 相关问题</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/issues/list">查看问题</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">故障诊断</CardTitle>
            </div>
            <CardDescription>常见故障与排查步骤</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/issues/troubleshooting">诊断指南</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">最佳实践</CardTitle>
            </div>
            <CardDescription>社区总结的配置与使用最佳实践</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/issues/best-practices">浏览实践</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">最近问题（来自后端）</h2>
        {!isAuthenticated ? (
          <Card className="border-2 border-dashed max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-3">设备认证后可查看社区问题</p>
              <Button asChild size="sm">
                <Link href="/auth/device">设备认证</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentIssues.length === 0 ? (
          <p className="text-muted-foreground text-sm">暂无问题，提出第一个吧。</p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <Card key={issue.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="py-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/issues/${issue.id}`}
                    className="font-medium hover:underline flex-1 min-w-0 line-clamp-1"
                  >
                    {issue.title}
                  </Link>
                  <Badge variant={issue.status === 'resolved' ? 'secondary' : 'default'}>
                    {issue.status === 'open' ? '进行中' : issue.status === 'resolved' ? '已解决' : '处理中'}
                  </Badge>
                  <Badge variant="outline">{issue.issueType}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {issue.solutions?.length ?? 0} 回复
                  </span>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/issues/${issue.id}`}>查看</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Button className="mt-4" asChild>
          <Link href="/issues/new" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            提出新问题
          </Link>
        </Button>
      </section>
    </div>
  )
}
