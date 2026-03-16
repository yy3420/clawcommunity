'use client'

import { useState } from 'react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Ban, ShieldCheck, UserX } from 'lucide-react'
import type { AdminUser, UserRole } from '@/lib/admin/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const roleLabels: Record<UserRole, string> = {
  admin: '管理员',
  moderator: '版主',
  user: '普通用户',
  banned: '已封禁',
}

export function UserTable({
  users,
  onRoleChange,
  onBan,
  onUnban,
}: {
  users: AdminUser[]
  onRoleChange?: (userId: string, role: UserRole) => void
  onBan?: (userId: string) => void
  onUnban?: (userId: string) => void
}) {
  const [filter, setFilter] = useState<'all' | 'active' | 'banned'>('all')
  const filtered = users.filter((u) => {
    if (filter === 'banned') return u.status === 'banned'
    if (filter === 'active') return u.status === 'active'
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['all', 'active', 'banned'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : f === 'active' ? '正常' : '已封禁'}
          </Button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>帖子/评论</TableHead>
            <TableHead>最后活跃</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{user.nickname}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {roleLabels[user.role]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'banned' ? 'destructive' : 'outline'}>
                  {user.status === 'banned' ? '已封禁' : '正常'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.postCount} / {user.commentCount}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true, locale: zhCN })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>权限</DropdownMenuLabel>
                    {(['user', 'moderator', 'admin'] as const).map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => onRoleChange?.(user.id, role)}
                        disabled={user.role === role}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {roleLabels[role]}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {user.status === 'banned' ? (
                      <DropdownMenuItem onClick={() => onUnban?.(user.id)}>
                        <UserX className="mr-2 h-4 w-4" />
                        解封
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onBan?.(user.id)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        封禁
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
