'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockPosts, mockComments, mockReports } from '@/lib/admin-mock'
import type { ModerationPost, ModerationComment, Report } from '@/types/admin'
import { FileText, MessageSquare, Flag, Check, X, Eye } from 'lucide-react'

const postStatusLabels: Record<ModerationPost['status'], string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
}
const commentStatusLabels: Record<ModerationComment['status'], string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
}
const reportStatusLabels: Record<Report['status'], string> = {
  pending: '待处理',
  resolved: '已处理',
  dismissed: '已驳回',
}
const reportTargetLabels: Record<Report['targetType'], string> = {
  post: '帖子',
  comment: '评论',
  user: '用户',
}

export default function AdminContentPage() {
  const searchParams = useSearchParams()
  const defaultTab = useMemo(() => {
    const t = searchParams.get('tab')
    return t === 'reports' || t === 'comments' ? t : 'posts'
  }, [searchParams])
  const [posts, setPosts] = useState<ModerationPost[]>(mockPosts)
  const [comments, setComments] = useState<ModerationComment[]>(mockComments)
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [detailItem, setDetailItem] = useState<{ type: 'post' | 'comment' | 'report'; data: ModerationPost | ModerationComment | Report } | null>(null)

  const updatePostStatus = (id: string, status: ModerationPost['status']) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }
  const updateCommentStatus = (id: string, status: ModerationComment['status']) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }
  const resolveReport = (id: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action, resolvedAt: new Date().toISOString().slice(0, 10), resolvedBy: 'admin' }
          : r
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">内容审核</h1>
        <p className="text-muted-foreground">帖子审核、评论审核与举报处理</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="posts">
            <FileText className="mr-2 h-4 w-4" />
            帖子审核
            <Badge variant="secondary" className="ml-1">
              {posts.filter((p) => p.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            评论审核
            <Badge variant="secondary" className="ml-1">
              {comments.filter((c) => c.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Flag className="mr-2 h-4 w-4" />
            举报处理
            <Badge variant="secondary" className="ml-1">
              {reports.filter((r) => r.status === 'pending').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>帖子列表</CardTitle>
              <CardDescription>审核通过、拒绝或查看详情</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>举报数</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead className="w-[180px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.author}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {postStatusLabels[p.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.reportCount ?? 0}</TableCell>
                      <TableCell className="text-muted-foreground">{p.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setDetailItem({ type: 'post', data: p })}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {p.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => updatePostStatus(p.id, 'approved')}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => updatePostStatus(p.id, 'rejected')}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>评论列表</CardTitle>
              <CardDescription>审核评论内容</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>内容</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>所属帖子</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead className="w-[180px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="max-w-[200px] truncate">{c.content}</TableCell>
                      <TableCell>{c.author}</TableCell>
                      <TableCell className="text-muted-foreground">{c.postTitle}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'approved' ? 'default' : c.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {commentStatusLabels[c.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setDetailItem({ type: 'comment', data: c })}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {c.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => updateCommentStatus(c.id, 'approved')}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => updateCommentStatus(c.id, 'rejected')}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>举报列表</CardTitle>
              <CardDescription>处理用户举报</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>举报对象</TableHead>
                    <TableHead>举报人</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead className="w-[160px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <span className="text-muted-foreground">{reportTargetLabels[r.targetType]} · </span>
                        {r.targetTitle ?? r.targetId}
                      </TableCell>
                      <TableCell>{r.reporter}</TableCell>
                      <TableCell>{r.reason} {r.description && `(${r.description})`}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === 'pending' ? 'secondary' : r.status === 'resolved' ? 'default' : 'outline'}>
                          {reportStatusLabels[r.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.createdAt}</TableCell>
                      <TableCell>
                        {r.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => resolveReport(r.id, 'resolved')}>
                              采纳
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => resolveReport(r.id, 'dismissed')}>
                              驳回
                            </Button>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setDetailItem({ type: 'report', data: r })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 详情弹窗 */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {detailItem?.type === 'post' && '帖子详情'}
              {detailItem?.type === 'comment' && '评论详情'}
              {detailItem?.type === 'report' && '举报详情'}
            </DialogTitle>
            <DialogDescription>
              {detailItem?.type === 'post' && (detailItem.data as ModerationPost).title}
              {detailItem?.type === 'comment' && (detailItem.data as ModerationComment).postTitle}
              {detailItem?.type === 'report' && (detailItem.data as Report).reason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            {detailItem?.type === 'post' && (
              <>
                <p><strong>作者：</strong>{(detailItem.data as ModerationPost).author}</p>
                <p><strong>内容：</strong>{(detailItem.data as ModerationPost).content}</p>
                <p><strong>状态：</strong>{postStatusLabels[(detailItem.data as ModerationPost).status]}</p>
              </>
            )}
            {detailItem?.type === 'comment' && (
              <>
                <p><strong>内容：</strong>{(detailItem.data as ModerationComment).content}</p>
                <p><strong>作者：</strong>{(detailItem.data as ModerationComment).author}</p>
                <p><strong>状态：</strong>{commentStatusLabels[(detailItem.data as ModerationComment).status]}</p>
              </>
            )}
            {detailItem?.type === 'report' && (
              <>
                <p><strong>举报对象：</strong>{(detailItem.data as Report).targetType} - {(detailItem.data as Report).targetTitle ?? (detailItem.data as Report).targetId}</p>
                <p><strong>举报人：</strong>{(detailItem.data as Report).reporter}</p>
                <p><strong>描述：</strong>{(detailItem.data as Report).description ?? '-'}</p>
                <p><strong>状态：</strong>{reportStatusLabels[(detailItem.data as Report).status]}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setDetailItem(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
