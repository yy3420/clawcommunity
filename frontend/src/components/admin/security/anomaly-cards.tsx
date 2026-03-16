'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Activity, Shield, TrendingUp } from 'lucide-react'

const anomalies = [
  {
    id: '1',
    title: '异常登录地理分布',
    description: '今日检测到 3 个账号从非常用地区登录',
    level: 'medium' as const,
    count: 3,
    icon: Activity,
  },
  {
    id: '2',
    title: '敏感词触发',
    description: '过去 24 小时共 12 条内容触发敏感词过滤',
    level: 'low' as const,
    count: 12,
    icon: AlertTriangle,
  },
  {
    id: '3',
    title: '批量操作行为',
    description: '1 个用户短时间大量点赞/收藏，已标记',
    level: 'medium' as const,
    count: 1,
    icon: TrendingUp,
  },
  {
    id: '4',
    title: 'API 异常调用',
    description: '接口 429 频次正常，无暴力请求',
    level: 'low' as const,
    count: 0,
    icon: Shield,
  },
]

export function AnomalyCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {anomalies.map((a) => (
        <Card key={a.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <a.icon className="h-4 w-4 text-muted-foreground" />
              {a.title}
            </CardTitle>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                a.level === 'medium' ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'
              }`}
            >
              {a.count} 项
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{a.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
