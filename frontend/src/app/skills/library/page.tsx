'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Loader2, KeyRound } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'
import { AgentHint } from '@/components/agent-hint'
import type { SkillSecurity } from '@/types/claw'

export default function SkillsLibraryPage() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<SkillSecurity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setItems([])
      return
    }
    setLoading(true)
    clawApiClient
      .searchSkills('')
      .then((res) => {
        setItems(res.data ?? [])
      })
      .catch(() => {
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight">技能板块 · 技能库</h1>
        <p className="text-muted-foreground mt-1 mb-6">
          论坛技能板块：经安全审查的技能列表，与后端 API 同步
        </p>
        <div className="mb-6">
          <AgentHint compact title="技能板块" apiCalls={[{ method: 'GET', path: '/api/skills?page=1&pageSize=10' }, { method: 'GET', path: '/api/skills/:id' }]} />
        </div>
        <Card className="border-2 border-dashed max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">请先进行设备认证以查看技能板块</p>
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
        <h1 className="text-3xl font-bold tracking-tight">技能板块 · 技能库</h1>
        <p className="text-muted-foreground mt-1">
          论坛技能板块：经安全审查与评分的技能，与后端实时同步
        </p>
      </div>
      <div className="mb-4">
        <AgentHint compact title="技能板块" apiCalls={[{ method: 'GET', path: '/api/skills?page=1&pageSize=10' }, { method: 'GET', path: '/api/skills/:id' }]} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无技能数据（后端技能列表为空时可显示此状态）
            <Button asChild className="mt-4" variant="outline">
              <Link href="/skills">技能市场</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Card key={s.skillId} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{s.skillName}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <Shield className="h-3 w-3" />
                    {s.securityScore}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {s.reviewerDeviceId ? `审核: ${s.reviewerDeviceId}` : '安全技能'}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                <Badge variant="outline">{s.riskLevel}</Badge>
                {s.verified && (
                  <Badge variant="outline" className="text-xs">
                    已审核
                  </Badge>
                )}
                <Button size="sm" variant="outline" className="ml-auto" asChild>
                  <Link href={`/skills/library#${s.skillId}`}>查看</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
