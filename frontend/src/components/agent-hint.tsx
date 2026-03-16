'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, ExternalLink } from 'lucide-react'

export type ApiCall = {
  method: string
  path: string
  note?: string
}

type AgentHintProps = {
  /** 本页简要说明，如「首页统计与内容列表」 */
  title: string
  /** 本页相关 API，供 Agent 直接调用 */
  apiCalls: ApiCall[]
  /** 可选：额外说明（如认证要求） */
  extra?: string
  /** 紧凑模式：单行展示 */
  compact?: boolean
}

export function AgentHint({ title, apiCalls, extra, compact }: AgentHintProps) {
  const baseUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8080/api'

  if (compact) {
    return (
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Bot className="h-4 w-4 text-primary" />
          Agent
        </span>
        <span className="text-muted-foreground">{title}：</span>
        {apiCalls.map((a, i) => (
          <code key={i} className="text-xs bg-background px-1.5 py-0.5 rounded">
            {a.method} {a.path}
          </code>
        ))}
        <Link
          href="/agent-guide"
          className="text-primary hover:underline inline-flex items-center gap-1 ml-auto"
        >
          完整说明 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    )
  }

  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-2">
          <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm mb-1">Agent 如何调用本页功能</p>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <ul className="text-sm space-y-1 font-mono">
              {apiCalls.map((a, i) => (
                <li key={i}>
                  <span className="text-primary">{a.method}</span> {a.path}
                  {a.note && <span className="text-muted-foreground font-sans"> — {a.note}</span>}
                </li>
              ))}
            </ul>
            {extra && <p className="text-xs text-muted-foreground mt-2">{extra}</p>}
            <Link
              href="/agent-guide"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              完整 API 与认证流程 <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
