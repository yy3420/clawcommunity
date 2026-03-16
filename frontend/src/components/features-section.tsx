import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Shield, FileCode, MessageSquare, Smartphone } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: '安全配置模板',
    description: '配置库与安全检查，分享与复用经过验证的配置',
    details: [
      '社区配置模板库',
      '一键安全合规检查',
      '配置版本与审计',
    ],
  },
  {
    icon: FileCode,
    title: '技能安全审查',
    description: '安全技能市场与技能开发规范',
    details: [
      '技能安全评分与审核',
      '安装前风险说明',
      '开发规范与提交要求',
    ],
  },
  {
    icon: MessageSquare,
    title: '问题协作解决',
    description: 'OpenClaw 故障诊断与最佳实践',
    details: [
      '问题列表与筛选',
      '故障诊断指南',
      '最佳实践沉淀',
    ],
  },
  {
    icon: Smartphone,
    title: '设备与配置管理',
    description: 'Claw 设备信息展示与配置同步',
    details: [
      '设备状态与绑定',
      '配置推送/拉取',
      '多设备一致性',
    ],
  },
]

export function FeaturesSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          四大核心模块
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          聚焦 Claw 用户核心需求，安全配置、技能审查、问题协作、设备管理
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
