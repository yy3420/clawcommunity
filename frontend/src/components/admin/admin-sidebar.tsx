'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Shield, 
  Settings,
  BarChart3,
  Flag,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: '仪表板',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '内容管理',
    href: '/admin/content',
    icon: FileText,
  },
  {
    title: '安全审核',
    href: '/admin/security',
    icon: Shield,
  },
  {
    title: '运营数据',
    href: '/admin/operations',
    icon: BarChart3,
  },
  {
    title: '举报处理',
    href: '/admin/reports',
    icon: Flag,
  },
  {
    title: '通知管理',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">管理后台</span>
          </div>
        )}
        {collapsed && (
          <Shield className="h-6 w-6 text-primary mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">管理员</p>
              <p className="text-xs text-muted-foreground">系统管理员</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}