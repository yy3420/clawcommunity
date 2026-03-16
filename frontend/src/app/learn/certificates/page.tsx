import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Shield, ExternalLink } from 'lucide-react'
import { getCertificatesByUserId, getUserBadges, getAllBadges } from '@/lib/learn/certificates'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const MOCK_USER_ID = 'user-1'

export default function CertificatesPage() {
  const certificates = getCertificatesByUserId(MOCK_USER_ID)
  const userBadges = getUserBadges(MOCK_USER_ID)
  const allBadges = getAllBadges()
  const earnedBadgeIds = new Set(userBadges.map((b) => b.badgeId))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">我的证书与徽章</h1>
        <p className="text-muted-foreground mt-1">完成课程获得的证书与技能徽章</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          完成证书
        </h2>
        {certificates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              暂无证书。完成课程并通过测验即可获得证书。
              <Button asChild variant="link" className="mt-2">
                <Link href="/learn">去学习</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cert.courseTitle}</CardTitle>
                      <CardDescription>
                        颁发于 {format(new Date(cert.issuedAt), 'yyyy年M月d日', { locale: zhCN })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">凭证号：{cert.credentialId}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-4 w-4" />
                        验证
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          技能徽章
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allBadges.map((badge) => {
            const earned = userBadges.find((ub) => ub.badgeId === badge.id)
            return (
              <Card key={badge.id} className={earned ? 'border-primary/50' : 'opacity-75'}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${earned ? 'bg-primary/10' : 'bg-muted'}`}
                    >
                      <Award className={`h-6 w-6 ${earned ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {badge.name}
                        {earned && <Badge variant="secondary">已获得</Badge>}
                      </CardTitle>
                      <CardDescription className="text-xs">{badge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">获得条件：{badge.criteria}</p>
                  {earned && (
                    <p className="text-xs text-muted-foreground mt-2">
                      获得于 {format(new Date(earned.earnedAt), 'yyyy-MM-dd', { locale: zhCN })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
