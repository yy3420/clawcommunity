'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TrendPoint } from '@/lib/admin/types'

function SimpleBarChart({ data, max }: { data: TrendPoint[]; max: number }) {
  return (
    <div className="flex items-end gap-1 h-[120px] mt-4">
      {data.map((d, i) => (
        <div
          key={d.date}
          className="flex-1 min-w-0 flex flex-col items-center gap-1"
          title={`${d.date}: ${d.value}`}
        >
          <div
            className="w-full bg-primary rounded-t transition-all hover:opacity-90"
            style={{ height: max ? `${(d.value / max) * 100}%` : 0, minHeight: d.value ? 4 : 0 }}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">
            {d.date}
          </span>
        </div>
      ))}
    </div>
  )
}

export function TrendChart({
  title,
  description,
  data,
  valueLabel = '数量',
}: {
  title: string
  description?: string
  data: TrendPoint[]
  valueLabel?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <SimpleBarChart data={data} max={max} />
        <p className="text-xs text-muted-foreground mt-2">{valueLabel} · 近 7 天</p>
      </CardContent>
    </Card>
  )
}
