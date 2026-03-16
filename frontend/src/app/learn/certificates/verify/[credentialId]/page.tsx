import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, ShieldCheck } from 'lucide-react'
import { getCertificateByCredentialId } from '@/lib/learn/certificates'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ credentialId: string }>
}) {
  const { credentialId } = await params
  const cert = getCertificateByCredentialId(credentialId)
  if (!cert) notFound()

  return (
    <div className="max-w-xl mx-auto space-y-6 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        证书验证
      </div>
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">已验证</Badge>
              <CardTitle className="text-xl">{cert.courseTitle}</CardTitle>
              <CardDescription>
                颁发于 {format(new Date(cert.issuedAt), 'yyyy年M月d日', { locale: zhCN })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">凭证号</dt>
              <dd className="font-mono">{cert.credentialId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">课程</dt>
              <dd>{cert.courseTitle}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">颁发时间</dt>
              <dd>{format(new Date(cert.issuedAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            本证书由 ClawHub 安全学习路径系统颁发，证明持证人已完成对应课程学习并通过考核。
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/learn/certificates">返回我的证书</Link>
        </Button>
      </div>
    </div>
  )
}
