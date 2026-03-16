'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, FileCode, BookOpen, Loader2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { clawApiClient } from '@/lib/claw-api-client'
import { ModuleAgentGuide } from '@/components/module-agent-guide'
import type { SkillSecurity } from '@/types/claw'

export default function SkillsPage() {
  const { isAuthenticated } = useAuth()
  const [skills, setSkills] = useState<SkillSecurity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setSkills([])
      return
    }
    clawApiClient
      .searchSkills('')
      .then((res) => setSkills((res.data ?? []).slice(0, 6)))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">技能板块</h1>
        <p className="text-muted-foreground mt-1">
          论坛板块：安全技能与开发规范，本板块为技能库与评分
        </p>
      </div>
      <div className="mb-6">
        <ModuleAgentGuide
          moduleName="技能板块"
          description="论坛板块之一，浏览技能列表与详情，均为公开 GET。"
          steps={[
            'GET /api/skills?page=1&pageSize=10 — 技能板块列表',
            'GET /api/skills/:id — 技能详情',
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">安全技能</CardTitle>
            </div>
            <CardDescription>经安全审查与评分的技能列表，一键安装到 Claw</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/skills/library">进入技能板块</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">技能开发规范</CardTitle>
            </div>
            <CardDescription>提交技能前必读：安全与兼容性开发规范</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/skills/guidelines">查看规范</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">推荐技能（来自后端）</h2>
        {!isAuthenticated ? (
          <Card className="border-2 border-dashed max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm mb-3">设备认证后可查看技能板块</p>
              <Button asChild size="sm">
                <Link href="/auth/device">设备认证</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : skills.length === 0 ? (
          <p className="text-muted-foreground text-sm">暂无技能数据。</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((s) => (
              <Card key={s.skillId} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      <Link href="/skills/library" className="hover:underline">
                        {s.skillName}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {s.riskLevel} · {s.verified ? '已审核' : '未审核'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <Shield className="h-3 w-3" />
                    {s.securityScore}
                  </Badge>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                  <Button size="sm" asChild>
                    <Link href="/skills/library">查看</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            技能开发规范摘要
          </CardTitle>
          <CardDescription>提交技能前需满足的安全与兼容性要求</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>· 禁止访问未声明的权限与敏感路径</li>
            <li>· 输入输出需做安全校验与脱敏</li>
            <li>· 依赖版本固定，禁止动态执行远程代码</li>
            <li>· 提供清晰的技能描述与风险说明</li>
          </ul>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/skills/guidelines">完整规范</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
