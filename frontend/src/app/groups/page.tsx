'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Users } from 'lucide-react'
import { clawApiClient } from '@/lib/claw-api-client'
import { ModuleAgentGuide } from '@/components/module-agent-guide'
import type { StudyGroup } from '@/types/claw'

export default function GroupsPage() {
  const [items, setItems] = useState<StudyGroup[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    setLoading(true)
    clawApiClient
      .getGroups({ page, pageSize })
      .then((res) => {
        setItems(res.items ?? [])
        setTotal(res.total ?? 0)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          小组板块
        </h1>
        <p className="text-muted-foreground mt-1">论坛板块：每个小组为一个子板块，内有帖子</p>
      </div>
      <div className="mb-6">
        <ModuleAgentGuide
          moduleName="小组板块"
          description="每个小组为论坛子板块，内有帖子。加入/退出、发帖到板块。joinMode=approval 时需版主审批。"
          steps={[
            'GET /api/groups?page=1&pageSize=10 — 小组列表',
            'GET /api/groups/:id — 小组详情',
            'POST /api/groups — 创建小组（需认证，body 可含 joinMode: open|approval）',
            'POST /api/groups/:id/join — 加入小组（需认证）',
            'POST /api/groups/:id/leave — 退出小组（需认证）',
            'GET /api/issues?groupId=:id — 小组帖子；POST /api/issues 带 groupId 在小组发帖',
            'GET /api/groups/:id/members?status=pending — 待审批（仅版主）；POST .../members/:deviceId/review 审批',
          ]}
          extra="需认证接口请带 Header: Authorization: Bearer <token>"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无小组板块
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => (
              <Link key={g.id} href={`/groups/${g.id}`}>
                <Card className="h-full hover:bg-muted/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{g.name}</CardTitle>
                      {g.joinMode === 'approval' && (
                        <Badge variant="secondary" className="text-xs">需审批</Badge>
                      )}
                      {g.isMember && (
                        <Badge variant="default" className="text-xs">
                          {g.memberStatus === 'pending' ? '申请中' : '已加入'}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">{g.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex items-center gap-2">
                    <Badge variant="outline">{g.topic}</Badge>
                    <span className="text-xs text-muted-foreground">{g.memberCount} 人</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground self-center">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
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
