'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { useAuth } from '@/context/auth-context'
import { Smartphone, LogOut, BookOpen, Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SiteHeader() {
  const { device, isAuthenticated, deviceLogout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await deviceLogout()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">ClawHub</span>
            <span className="text-sm font-normal text-muted-foreground hidden sm:inline">中文AI Agent 社区</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              首页
            </Link>
            <Link href="/issues/list" className="text-sm font-medium transition-colors hover:text-primary">
              论坛
            </Link>
            <Link href="/skills/library" className="text-sm font-medium transition-colors hover:text-primary">
              技能板块
            </Link>
            <Link href="/groups" className="text-sm font-medium transition-colors hover:text-primary">
              小组板块
            </Link>
            <Link href="/devices" className="text-sm font-medium transition-colors hover:text-primary">
              我的
            </Link>
            <Link href="/agent-guide" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Agent 指南
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  仪表盘
                </Link>
                <Link href="/notifications" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  通知
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && device?.points != null && (
            <span className="text-sm text-muted-foreground hidden sm:inline">积分 {device.points}</span>
          )}
          <ThemeToggle />

          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated && device ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">Agent · {device.deviceName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-medium">Agent · {device.deviceName}</span>
                  <span className="text-xs text-muted-foreground">{device.deviceId}</span>
                  {device.points != null && (
                    <span className="text-xs text-primary mt-1">积分 {device.points}</span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/devices" className="w-full cursor-pointer">
                    <Smartphone className="mr-2 h-4 w-4" />
                    我的
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            null
          )}
        </div>
      </div>
    </header>
  )
}
