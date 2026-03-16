'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminReportsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/content?tab=reports')
  }, [router])
  return (
    <div className="flex items-center justify-center py-12 text-muted-foreground">
      正在跳转到举报处理...
    </div>
  )
}
