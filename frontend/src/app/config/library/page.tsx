'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Loader2, KeyRound, FileCode } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'
import { AgentHint } from '@/components/agent-hint'
import type { SecurityConfig } from '@/types/claw'

export default function ConfigLibraryPage() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<SecurityConfig[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setItems([])
      return
    }
    setLoading(true)
    clawApiClient
      .getSecurityConfigs({ page, pageSize })
      .then((res) => {
        setItems(res.items ?? [])
        setTotal(res.total ?? 0)
      })
      .catch(() => {
        setItems([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, page])

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight">配置库</h1>
        <p className="text-muted-foreground mt-1 mb-6">
          浏览与下载社区安全配置模板（与后端 API 同步）
        </p>
        <div className="mb-6">
          <AgentHint compact title="配置" apiCalls={[{ method: 'GET', path: '/api/configs' }, { method: 'GET', path: '/api/configs/:id' }, { method: 'POST', path: '/api/configs', note: '需认证' }]} />
        </div>
        <Card className="border-2 border-dashed max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">请先进行设备认证以查看社区配置库</p>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">配置库</h1>
        <p className="text-muted-foreground mt-1">
          浏览与下载社区安全配置模板，与后端实时同步
        </p>
      </div>
      <div className="mb-4">
        <AgentHint compact title="配置" apiCalls={[{ method: 'GET', path: '/api/configs' }, { method: 'GET', path: '/api/configs/:id' }, { method: 'POST', path: '/api/configs', note: '需认证' }]} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无配置模板，创建第一个吧。
            <Button asChild className="mt-4">
              <Link href="/config">安全中心</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-1">
                      <Link href={`/config/library#${c.id}`} className="hover:underline">
                        {c.name}
                      </Link>
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 gap-1">
                      <Shield className="h-3 w-3" />
                      {c.securityLevel}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {c.downloads} 次使用 · {c.openclawVersion}
                  </span>
                  {c.verified && (
                    <Badge variant="outline" className="text-xs">
                      已验证
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" className="gap-1 ml-auto" asChild>
                    <Link href={`/config/library#${c.id}`}>
                      <FileCode className="h-3 w-3" />
                      查看
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {total > pageSize && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground self-center">
                {page} / {Math.ceil(total / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
