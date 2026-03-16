'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Smartphone, RefreshCw, Settings, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { ModuleAgentGuide } from '@/components/module-agent-guide'

const mockDevices = [
  {
    id: 'd1',
    name: '客厅 Claw',
    model: 'OpenClaw Home',
    firmwareVersion: '1.2.0',
    status: 'online' as const,
    lastSeen: new Date(),
    configVersion: 'v3',
  },
  {
    id: 'd2',
    name: '书房 Claw',
    model: 'OpenClaw Home',
    firmwareVersion: '1.1.8',
    status: 'syncing' as const,
    lastSeen: new Date(Date.now() - 60000),
    configVersion: 'v2',
  },
]

export default function DevicesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">设备状态与配置管理</h1>
        <p className="text-muted-foreground mt-1">
          设备信息 · 配置同步 — 查看 Claw 设备状态并管理配置
        </p>
      </div>
      <div className="mb-6">
        <ModuleAgentGuide
          moduleName="设备"
          description="查看当前设备与设备列表，所有接口需认证。"
          steps={[
            'GET /api/auth/me — 当前设备信息',
            'GET /api/devices/me — 当前设备',
            'GET /api/devices — 设备列表',
          ]}
          extra="请带 Header: Authorization: Bearer <token>"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">我的设备</CardTitle>
            </div>
            <CardDescription>已绑定的 OpenClaw 设备列表与状态</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/devices/list">查看设备</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">配置同步</CardTitle>
            </div>
            <CardDescription>在设备间推送或拉取配置，保持一致性</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/devices/sync">同步配置</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">设备概览</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockDevices.map((d) => (
            <Card key={d.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{d.name}</CardTitle>
                  <CardDescription>
                    {d.model} · 固件 {d.firmwareVersion}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    d.status === 'online'
                      ? 'default'
                      : d.status === 'syncing'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {d.status === 'online' ? '在线' : d.status === 'syncing' ? '同步中' : '离线'}
                </Badge>
              </CardHeader>
              <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  配置版本 {d.configVersion} · 最后活跃 {d.lastSeen.toLocaleTimeString('zh-CN')}
                </span>
                <Button size="sm" variant="outline" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  刷新
                </Button>
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <Link href={`/devices/${d.id}`}>
                    <Settings className="h-4 w-4" />
                    配置
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="mt-4" asChild>
          <Link href="/devices/add">添加设备</Link>
        </Button>
      </section>
    </div>
  )
}
