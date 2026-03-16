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
import type { ModerationItem, ContentStatus } from '@/lib/admin/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const statusLabels: Record<ContentStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
}

export function ModerationTable({
  items,
  type,
  onApprove,
  onReject,
}: {
  items: ModerationItem[]
  type: 'post' | 'comment'
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>作者</TableHead>
          <TableHead>内容摘要</TableHead>
          {type === 'comment' && <TableHead>所属帖子</TableHead>}
          <TableHead>状态</TableHead>
          <TableHead>时间</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.authorName}</TableCell>
            <TableCell className="max-w-[280px] truncate text-muted-foreground">
              {item.content}
            </TableCell>
            {type === 'comment' && (
              <TableCell className="text-sm">{item.postTitle ?? '-'}</TableCell>
            )}
            <TableCell>
              <Badge
                variant={
                  item.status === 'approved'
                    ? 'default'
                    : item.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {statusLabels[item.status]}
              </Badge>
              {item.reportedCount != null && item.reportedCount > 0 && (
                <span className="ml-1 text-xs text-amber-600">举报 {item.reportedCount}</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: zhCN })}
            </TableCell>
            <TableCell className="text-right">
              {item.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onApprove?.(item.id)}>
                    通过
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onReject?.(item.id)}>
                    拒绝
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
