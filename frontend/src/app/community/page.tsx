import { redirect } from 'next/navigation'

// 传统社交功能已停止，重定向到首页
export default function CommunityPage() {
  redirect('/')
}
