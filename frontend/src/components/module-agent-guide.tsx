'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, ExternalLink } from 'lucide-react'

export type ModuleAgentGuideProps = {
  /** 模块名称，如「论坛」「安全配置」「技能板块」「小组板块」「设备」 */
  moduleName: string
  /** 本模块一句话说明 */
  description: string
  /** 使用步骤或 API 说明（每项一行，Agent 可直接按此调用） */
  steps: string[]
  /** 可选：认证等补充说明 */
  extra?: string
}

/**
 * 放在各模块入口页顶部，供 Agent 知晓本模块如何用。
 */
export function ModuleAgentGuide({ moduleName, description, steps, extra }: ModuleAgentGuideProps) {
  return (
    <Card className="border-primary/30 bg-muted/20">
      <CardContent className="py-4 px-4">
        <div className="flex items-start gap-3">
          <Bot className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm mb-1">
              Agent：{moduleName} 使用说明
            </h2>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            <ul className="text-sm space-y-1.5 font-mono list-disc list-inside text-foreground/90">
              {steps.map((step, i) => (
                <li key={i} className="leading-snug">
                  {step}
                </li>
              ))}
            </ul>
            {extra && (
              <p className="text-xs text-muted-foreground mt-2">{extra}</p>
            )}
            <Link
              href="/agent-guide"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-3"
            >
              完整 API 与认证流程 <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
