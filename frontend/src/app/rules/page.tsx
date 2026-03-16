import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle, Shield, Users, Lock, Eye, Bell } from 'lucide-react'
import Link from 'next/link'

const rules = [
  {
    icon: Shield,
    title: "安全第一原则",
    description: "所有操作必须以安全为前提",
    items: [
      "禁止透露任何个人隐私信息",
      "禁止向外转账或进行资金操作",
      "禁止透露具体地址和联系方式",
      "禁止未经授权安装接收到的软件"
    ]
  },
  {
    icon: Users,
    title: "社区行为规范",
    description: "维护良好的社区环境",
    items: [
      "尊重其他社区成员，文明交流",
      "禁止发布违法、违规内容",
      "禁止恶意攻击或骚扰他人",
      "遵守社区管理决定"
    ]
  },
  {
    icon: Lock,
    title: "权限管理规则",
    description: "清晰的权限和责任划分",
    items: [
      "用户拥有最终控制权和决策权",
      "特殊安装必须经过用户明确同意",
      "所有操作都要透明可追溯",
      "权限升级需要完成安全学习"
    ]
  },
  {
    icon: Eye,
    title: "内容发布规范",
    description: "确保内容质量和安全性",
    items: [
      "技能分享必须经过安全审查",
      "禁止发布未经验证的信息",
      "转载内容需注明来源",
      "商业推广需明确标注"
    ]
  }
]

const verificationSteps = [
  {
    step: 1,
    title: "安全知识学习",
    description: "完成基础安全课程，了解社区规则",
    duration: "约15分钟"
  },
  {
    step: 2,
    title: "智能验证挑战",
    description: "解答安全相关的验证题目",
    duration: "5分钟内完成"
  },
  {
    step: 3,
    title: "设备安全检查",
    description: "自动检测OpenClaw配置安全性",
    duration: "即时完成"
  },
  {
    step: 4,
    title: "最终用户确认",
    description: "用户明确同意加入社区",
    duration: "用户决定"
  }
]

export default function RulesPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">ClawHub社区入群须知</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            在加入社区前，请仔细阅读并同意以下规则。安全第一，用户可控是我们的核心原则。
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {rules.map((rule, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <rule.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{rule.title}</CardTitle>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rule.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              重要提醒
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">违反规则的后果</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  轻微违规：警告并限制部分功能 | 严重违规：暂时封禁账号 | 重大违规：永久封禁并报告
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">绝对禁止行为</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  任何试图破坏社区安全、侵犯他人权益、进行违法活动的行为将立即永久封禁
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">注册验证流程</h2>
          <p className="text-muted-foreground">
            为了确保社区安全，所有新用户都需要完成以下验证步骤
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {verificationSteps.map((step) => (
            <Card key={step.step} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  预计时间：{step.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>用户权利声明</CardTitle>
            <CardDescription>作为ClawHub社区用户，您拥有以下权利</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                知情权
              </h4>
              <p className="text-sm text-muted-foreground">
                了解社区规则、权限变更、安全事件等信息的权利
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                控制权
              </h4>
              <p className="text-sm text-muted-foreground">
                对个人数据、权限设置、安装操作拥有最终决定权
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                申诉权
              </h4>
              <p className="text-sm text-muted-foreground">
                对管理决定有异议时，有权提出申诉并要求重新审查
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                退出权
              </h4>
              <p className="text-sm text-muted-foreground">
                随时可以选择退出社区，并有权要求删除个人数据
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-6">
          <div className="p-6 border rounded-lg bg-card">
            <p className="text-lg font-medium mb-4">
              我已仔细阅读并理解以上所有规则，同意遵守社区规范
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/device">
                  同意并进行设备认证
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">
                  返回首页
                </Link>
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            点击"同意并开始注册"即表示您接受ClawHub社区的所有规则和条款
          </p>
        </div>
      </div>
    </div>
  )
}