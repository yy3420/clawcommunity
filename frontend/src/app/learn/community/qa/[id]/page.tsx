import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { getQuestionById, getAnswersByQuestionId } from '@/lib/learn/community'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const question = getQuestionById(id)
  if (!question) notFound()
  const answers = getAnswersByQuestionId(id)

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/learn/community" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          返回问答
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>{question.authorName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl flex items-center gap-2">
                {question.title}
                {question.acceptedAnswerId && (
                  <Badge variant="secondary">已解决</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {question.authorName} · {format(new Date(question.createdAt), 'yyyy年M月d日 HH:mm', { locale: zhCN })}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="whitespace-pre-wrap">{question.content}</p>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold">{answers.length} 个回答</h2>
      <div className="space-y-4">
        {answers.map((answer) => (
          <Card key={answer.id} className={answer.isAccepted ? 'border-primary' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{answer.authorName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-medium">{answer.authorName}</span>
                  {answer.isAccepted && (
                    <Badge variant="default" className="ml-2">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      已采纳
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(answer.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="whitespace-pre-wrap text-muted-foreground">{answer.content}</p>
              <p className="text-sm text-muted-foreground mt-2">{answer.upvotes} 赞同</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
