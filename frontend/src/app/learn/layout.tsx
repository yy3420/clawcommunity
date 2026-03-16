import Link from 'next/link'
import { BookOpen, LayoutDashboard, Award, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/learn', label: '学习中心', icon: LayoutDashboard },
  { href: '/learn/progress', label: '学习进度', icon: TrendingUp },
  { href: '/learn/certificates', label: '我的证书', icon: Award },
  { href: '/learn/community', label: '学习社区', icon: Users },
]

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <aside className="w-full shrink-0 md:w-56">
          <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
