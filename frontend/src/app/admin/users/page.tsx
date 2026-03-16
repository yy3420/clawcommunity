'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX,
  Shield,
  Mail,
  Calendar,
  ChevronDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 模拟用户数据
const mockUsers = [
  {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2026-03-01',
    posts: 12,
    lastActive: '2小时前',
    securityLevel: '中级',
  },
  {
    id: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'contributor',
    status: 'active',
    joinedAt: '2026-02-15',
    posts: 45,
    lastActive: '5分钟前',
    securityLevel: '高级',
  },
  {
    id: 'user3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'maintainer',
    status: 'active',
    joinedAt: '2026-01-20',
    posts: 89,
    lastActive: '1天前',
    securityLevel: '专家',
  },
  {
    id: 'user4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'suspended',
    joinedAt: '2026-03-05',
    posts: 3,
    lastActive: '3天前',
    securityLevel: '初级',
    suspensionReason: '违规内容',
  },
  {
    id: 'user5',
    name: '钱七',
    email: 'qianqi@example.com',
    role: 'learner',
    status: 'active',
    joinedAt: '2026-03-10',
    posts: 0,
    lastActive: '刚刚',
    securityLevel: '初级',
  },
  {
    id: 'user6',
    name: '孙八',
    email: 'sunba@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2026-01-01',
    posts: 156,
    lastActive: '30分钟前',
    securityLevel: '管理员',
  },
]

const roleColors: Record<string, string> = {
  user: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  learner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  contributor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  maintainer: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSuspendUser = (userId: string) => {
    console.log('暂停用户:', userId)
    // 实际应用中这里会调用API
  }

  const handleActivateUser = (userId: string) => {
    console.log('激活用户:', userId)
    // 实际应用中这里会调用API
  }

  const handlePromoteUser = (userId: string) => {
    console.log('提升用户权限:', userId)
    // 实际应用中这里会调用API
  }

  const handleSendMessage = (userId: string) => {
    console.log('发送消息给用户:', userId)
    // 实际应用中这里会调用API
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">
            管理社区用户，查看用户信息，处理用户状态
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            批量操作
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 今日新增
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              当前在线用户
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">安全事件</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              今日安全事件
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均安全等级</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⭐</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">中级</div>
            <p className="text-xs text-muted-foreground">
              社区整体安全水平
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 过滤和搜索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索用户姓名或邮箱..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="角色筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有角色</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="learner">学习者</SelectItem>
                  <SelectItem value="contributor">贡献者</SelectItem>
                  <SelectItem value="maintainer">维护者</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="suspended">已暂停</SelectItem>
                  <SelectItem value="inactive">不活跃</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 用户表格 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>安全等级</TableHead>
                <TableHead>加入时间</TableHead>
                <TableHead>最后活跃</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {user.role === 'user' && '普通用户'}
                      {user.role === 'learner' && '学习者'}
                      {user.role === 'contributor' && '贡献者'}
                      {user.role === 'maintainer' && '维护者'}
                      {user.role === 'admin' && '管理员'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>
                      {user.status === 'active' && '活跃'}
                      {user.status === 'suspended' && '已暂停'}
                      {user.status === 'inactive' && '不活跃'}
                    </Badge>
                    {user.status === 'suspended' && user.suspensionReason && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.suspensionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{user.securityLevel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{user.joinedAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{user.lastActive}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSendMessage(user.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          发送消息
                        </DropdownMenuItem>
                        {user.status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            暂停用户
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            激活用户
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handlePromoteUser(user.id)}>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          调整权限
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              没有找到匹配的用户
            </div>
          )}
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              显示 {filteredUsers.length} 个用户中的 {Math.min(filteredUsers.length, 10)} 个
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="outline" size="sm">
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作面板 */}
      <Card>
        <CardHeader>
          <CardTitle>批量操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              批量发送消息
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              批量激活用户
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              批量暂停用户
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              批量调整安全等级
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}