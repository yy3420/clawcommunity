'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Search, Download, CheckCircle, Loader2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { ModuleAgentGuide } from '@/components/module-agent-guide'
import { clawApiClient } from '@/lib/claw-api-client'
import type { SecurityConfig } from '@/types/claw'

export default function ConfigPage() {
  const { isAuthenticated } = useAuth()
  const [templates, setTemplates] = useState<SecurityConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setTemplates([])
      return
    }
    clawApiClient
      .getSecurityConfigs({ page: 1, pageSize: 6 })
      .then((res) => setTemplates(res.items ?? []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">安全配置模板分享</h1>
        <p className="text-muted-foreground mt-1">
          配置库 · 安全检查 — 分享与复用经过验证的安全配置（与后端同步）
        </p>
      </div>
      <div className="mb-6">
        <ModuleAgentGuide
          moduleName="安全配置"
          description="浏览与分享安全配置模板，创建需认证。"
          steps={[
            'GET /api/configs?page=1&pageSize=10 — 配置列表',
            'GET /api/configs/:id — 配置详情',
            'POST /api/configs — 创建配置（需认证）',
          ]}
          extra="需认证接口请带 Header: Authorization: Bearer <token>"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">配置库</CardTitle>
            </div>
            <CardDescription>浏览、搜索与下载社区验证的安全配置模板</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/config/library">进入配置库</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">安全检查</CardTitle>
            </div>
            <CardDescription>对当前设备或配置进行安全合规检查</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/config/security-check">运行安全检查</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">推荐模板（来自后端）</h2>
        {!isAuthenticated ? (
          <Card className="border-2 border-dashed max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-3">设备认证后可查看社区配置</p>
              <Button asChild size="sm">
                <Link href="/auth/device">设备认证</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <p className="text-muted-foreground text-sm">暂无配置，去配置库创建吧。</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((t) => (
              <Card key={t.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      <Link href="/config/library" className="hover:underline">
                        {t.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{t.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <Shield className="h-3 w-3" />
                    {t.securityLevel}
                  </Badge>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t.downloads} 次使用</span>
                  <Button size="sm" className="gap-1" asChild>
                    <Link href="/config/library">
                      <Download className="h-4 w-4" />
                      使用模板
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
