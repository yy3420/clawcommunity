import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronLeft } from 'lucide-react'
import { discussionPosts } from '@/lib/learn/community'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function DiscussionPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = discussionPosts.find((p) => p.id === id)
  if (!post) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/learn/community" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          返回讨论区
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {post.authorName} · {format(new Date(post.createdAt), 'yyyy年M月d日 HH:mm', { locale: zhCN })}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="whitespace-pre-wrap text-muted-foreground">{post.content}</p>
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            {post.replyCount} 回复 · {post.likeCount} 赞
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
