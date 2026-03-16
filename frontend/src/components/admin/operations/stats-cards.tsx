'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatsOverview } from '@/lib/admin/types'
import { Users, UserPlus, Activity, FileText, MessageSquare, AlertCircle } from 'lucide-react'

export function StatsCards({ stats }: { stats: StatsOverview }) {
  const cards = [
    {
      title: '总用户数',
      value: stats.totalUsers.toLocaleString(),
      sub: `本周新增 ${stats.newUsersWeek}`,
      icon: Users,
    },
    {
      title: '今日新增用户',
      value: stats.newUsersToday.toString(),
      sub: '较昨日',
      icon: UserPlus,
    },
    {
      title: '今日活跃用户',
      value: stats.activeUsersToday.toString(),
      sub: `周活跃 ${stats.activeUsersWeek}`,
      icon: Activity,
    },
    {
      title: '总帖子数',
      value: stats.totalPosts.toLocaleString(),
      sub: `今日新增 ${stats.newPostsToday}`,
      icon: FileText,
    },
    {
      title: '今日评论',
      value: stats.newCommentsToday.toString(),
      sub: '条',
      icon: MessageSquare,
    },
    {
      title: '待审核',
      value: stats.pendingModeration.toString(),
      sub: '条待处理',
      icon: AlertCircle,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
            <c.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
            <p className="text-xs text-muted-foreground">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
