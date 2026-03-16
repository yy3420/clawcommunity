'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCards } from '@/components/admin/operations/stats-cards'
import { TrendChart } from '@/components/admin/operations/trend-chart'
import {
  mockStatsOverview,
  mockUserGrowthTrend,
  mockActivityTrend,
  mockContentTrend,
} from '@/lib/admin/mock-data'
import { BarChart3 } from 'lucide-react'

export default function AdminOperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">运营数据</h1>
        <p className="text-muted-foreground">
          用户增长、活跃度与内容趋势统计
        </p>
      </div>

      <StatsCards stats={mockStatsOverview} />

      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5" />
          趋势概览
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <TrendChart
            title="用户增长"
            description="每日新增用户数"
            data={mockUserGrowthTrend}
            valueLabel="新增用户"
          />
          <TrendChart
            title="活跃度"
            description="每日活跃用户数"
            data={mockActivityTrend}
            valueLabel="活跃用户"
          />
          <TrendChart
            title="内容趋势"
            description="每日新发帖子数"
            data={mockContentTrend}
            valueLabel="新帖子"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>数据说明</CardTitle>
          <CardDescription>统计口径与更新频率</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>· 活跃用户：当日有发帖、评论、点赞或登录行为的去重用户。</p>
          <p>· 趋势图数据按自然日汇总，每日 0 点更新。</p>
          <p>· 待审核数量包含帖子与评论，实时更新。</p>
        </CardContent>
      </Card>
    </div>
  )
}
