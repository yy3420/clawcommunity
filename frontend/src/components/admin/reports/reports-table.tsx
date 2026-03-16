'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Report, ReportStatus } from '@/lib/admin/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const statusLabels: Record<ReportStatus, string> = {
  pending: '待处理',
  reviewing: '处理中',
  resolved: '已解决',
  dismissed: '已驳回',
}

const reasonLabels: Record<string, string> = {
  spam: '垃圾信息',
  abuse: '辱骂/骚扰',
  illegal: '违法违规',
  other: '其他',
}

export function ReportsTable({
  reports,
  onResolve,
  onDismiss,
}: {
  reports: Report[]
  onResolve?: (id: string) => void
  onDismiss?: (id: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>举报对象</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>原因</TableHead>
          <TableHead>举报人</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              <div className="max-w-[200px] truncate" title={r.targetPreview}>
                {r.targetPreview}
              </div>
              <span className="text-xs text-muted-foreground">({r.targetType})</span>
            </TableCell>
            <TableCell className="capitalize">{r.targetType}</TableCell>
            <TableCell>{reasonLabels[r.reason] ?? r.reason}</TableCell>
            <TableCell>{r.reporterName}</TableCell>
            <TableCell>
              <Badge
                variant={
                  r.status === 'resolved'
                    ? 'default'
                    : r.status === 'dismissed'
                    ? 'secondary'
                    : r.status === 'reviewing'
                    ? 'outline'
                    : 'destructive'
                }
              >
                {statusLabels[r.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true, locale: zhCN })}
            </TableCell>
            <TableCell className="text-right">
              {(r.status === 'pending' || r.status === 'reviewing') && (
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => onResolve?.(r.id)}>
                    标记解决
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDismiss?.(r.id)}>
                    驳回
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
