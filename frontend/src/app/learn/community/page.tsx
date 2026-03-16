'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageSquare, HelpCircle, UserPlus, ArrowRight } from 'lucide-react'
import { studyGroups, discussionPosts, questions } from '@/lib/learn/community'
import { getCourseById } from '@/lib/learn/courses'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">学习社区</h1>
        <p className="text-muted-foreground mt-1">加入学习小组、参与讨论、提问与答疑</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="groups" className="gap-2">
            <Users className="h-4 w-4" />
            学习小组
          </TabsTrigger>
          <TabsTrigger value="discussion" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            讨论区
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            问答
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {studyGroups.map((group) => {
              const course = group.courseId ? getCourseById(group.courseId) : null
              return (
                <Card key={group.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {group.name}
                    </CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                    {course && (
                      <Link
                        href={`/learn/courses/${course.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        关联课程：{course.title}
                      </Link>
                    )}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {group.memberCount} 人 · {group.isPublic ? '公开' : '需加入'}
                    </span>
                    <Button size="sm">
                      <UserPlus className="mr-1 h-4 w-4" />
                      加入
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <div className="space-y-4">
            {discussionPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/learn/community/discussion/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">{post.authorName}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </span>
                    <span className="text-sm text-muted-foreground">{post.replyCount} 回复</span>
                    <span className="text-sm text-muted-foreground">{post.likeCount} 赞</span>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/learn/community/ask">
                <HelpCircle className="mr-2 h-4 w-4" />
                提问
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/learn/community/qa/${q.id}`} className="hover:underline">
                      {q.title}
                    </Link>
                    {q.acceptedAnswerId && (
                      <Badge variant="secondary" className="ml-2">已解决</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{q.content}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">{q.authorName}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(q.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </span>
                    <span className="text-sm text-muted-foreground">{q.answerCount} 回答</span>
                    {q.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
