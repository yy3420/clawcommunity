'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SecurityEvent, SecurityLevel } from '@/lib/admin/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ShieldAlert, CheckCircle } from 'lucide-react'

const levelColors: Record<SecurityLevel, string> = {
  low: 'bg-slate-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-600',
}

const levelLabels: Record<SecurityLevel, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '严重',
}

export function SecurityEventsList({
  events,
  onResolve,
}: {
  events: SecurityEvent[]
  onResolve?: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {events.map((e) => (
        <Card key={e.id} className={e.resolved ? 'opacity-75' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className={`mt-0.5 h-8 w-8 rounded-full ${levelColors[e.level]} flex items-center justify-center`}>
                  <ShieldAlert className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {e.title}
                    <Badge variant={e.resolved ? 'secondary' : 'destructive'} className="text-xs">
                      {levelLabels[e.level]}
                    </Badge>
                    {e.resolved && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{e.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                    {e.userEmail && <span>用户: {e.userEmail}</span>}
                    {e.ip && <span>IP: {e.ip}</span>}
                    <span>{formatDistanceToNow(new Date(e.createdAt), { addSuffix: true, locale: zhCN })}</span>
                  </div>
                </div>
              </div>
              {!e.resolved && onResolve && (
                <Button size="sm" variant="outline" onClick={() => onResolve(e.id)}>
                  标记已处理
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
