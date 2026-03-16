import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'

export default function AskQuestionPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/learn/community" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          返回问答
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold">提问</h1>
        <p className="text-muted-foreground text-sm mt-1">描述你的问题，社区会帮你解答</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>新问题</CardTitle>
          <CardDescription>请清晰描述问题，并添加相关标签便于他人查找</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" placeholder="简要概括你的问题" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">详细描述</Label>
            <Textarea id="content" placeholder="请详细描述问题背景、已尝试的方法等..." rows={6} />
          </div>
          <div className="space-y-2">
            <Label>标签（可选）</Label>
            <Input placeholder="例如：密码学、Web安全" />
          </div>
          <div className="flex gap-2">
            <Button>发布问题</Button>
            <Button variant="outline" asChild>
              <Link href="/learn/community">取消</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
