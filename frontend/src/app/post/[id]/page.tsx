import { redirect } from 'next/navigation'

// 传统帖子功能已停止，重定向到问题协作
export default function PostPage() {
  redirect('/issues')
}
