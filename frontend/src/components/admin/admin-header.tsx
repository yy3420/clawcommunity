'use client'

import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索用户、帖子、操作..."
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center"
            variant="destructive"
          >
            3
          </Badge>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">系统管理员</p>
            <p className="text-xs text-muted-foreground">admin@clawhub.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}