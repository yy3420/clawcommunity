'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockSecurityEvents, mockAnomalies } from '@/lib/admin-mock'
import type { SecurityEvent, AnomalyDetection } from '@/types/admin'
import { ShieldAlert, Activity, AlertTriangle, Info, RefreshCw } from 'lucide-react'

const levelConfig: Record<SecurityEvent['level'], { label: string; icon: typeof Info; variant: 'default' | 'secondary' | 'destructive' }> = {
  info: { label: '信息', icon: Info, variant: 'secondary' },
  warning: { label: '警告', icon: AlertTriangle, variant: 'default' },
  critical: { label: '严重', icon: ShieldAlert, variant: 'destructive' },
}

const anomalySeverityLabels: Record<AnomalyDetection['severity'], string> = {
  low: '低',
  medium: '中',
  high: '高',
}
const anomalyTypeLabels: Record<AnomalyDetection['type'], string> = {
  spam: '垃圾信息',
  brute_force: '暴力尝试',
  abnormal_post: '异常发帖',
  multi_account: '多账号',
  other: '其他',
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return d.toLocaleString('zh-CN')
}

export default function AdminSecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>(mockAnomalies)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // 模拟实时刷新：每 15 秒追加一条模拟事件
  useEffect(() => {
    const t = setInterval(() => {
      setEvents((prev) => [
        {
          id: `e-${Date.now()}`,
          type: 'heartbeat',
          level: 'info',
          message: '安全监控心跳',
          createdAt: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ])
      setLastRefresh(new Date())
    }, 15000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">安全监控</h1>
          <p className="text-muted-foreground">实时安全事件与异常行为检测</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
          上次刷新: {lastRefresh.toLocaleTimeString('zh-CN')}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日事件</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">实时安全事件流</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理异常</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalies.filter((a) => a.status === 'new' || a.status === 'investigating').length}</div>
            <p className="text-xs text-muted-foreground">异常行为检测</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高风险</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter((e) => e.level === 'critical').length}</div>
            <p className="text-xs text-muted-foreground">需立即关注</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>实时安全事件</CardTitle>
            <CardDescription>最近 20 条事件，按时间倒序</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>级别</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>用户/IP</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.slice(0, 20).map((e) => {
                  const config = levelConfig[e.level]
                  const Icon = config.icon
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Badge variant={config.variant}>
                          <Icon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.type}</TableCell>
                      <TableCell>{e.message}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {e.username ?? e.ip ?? '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTime(e.createdAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>异常行为检测</CardTitle>
            <CardDescription>系统自动识别的异常行为</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.severity === 'high' ? 'destructive' : a.severity === 'medium' ? 'default' : 'secondary'}>
                        {anomalySeverityLabels[a.severity]}
                      </Badge>
                      <span className="font-medium">{anomalyTypeLabels[a.type]}</span>
                      <Badge variant="outline">{a.status === 'new' ? '新' : a.status === 'investigating' ? '调查中' : '已处理'}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      数量: {a.count}
                      {a.affectedUsers?.length ? ` · 涉及: ${a.affectedUsers.join(', ')}` : ''}
                      · {formatTime(a.detectedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
