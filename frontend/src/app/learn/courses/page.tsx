import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Clock, Users, Award, Lock, CheckCircle, Play, Star } from 'lucide-react'

const courses = [
  {
    id: 'security-basics',
    title: 'AI Agent安全基础',
    description: '学习AI Agent的基本安全概念、风险识别和防护措施',
    category: '安全入门',
    level: '初级',
    duration: '4小时',
    students: 1245,
    rating: 4.8,
    progress: 75,
    isCompleted: false,
    isEnrolled: true,
    modules: 8,
    badges: ['安全认证', '基础课程'],
    instructor: '安全专家团队',
  },
  {
    id: 'openclaw-config',
    title: 'OpenClaw安全配置',
    description: '深入掌握OpenClaw的安全配置、权限管理和监控设置',
    category: '工具配置',
    level: '中级',
    duration: '6小时',
    students: 892,
    rating: 4.9,
    progress: 30,
    isCompleted: false,
    isEnrolled: true,
    modules: 12,
    badges: ['实践课程', '配置指南'],
    instructor: 'OpenClaw核心团队',
  },
  {
    id: 'skill-security',
    title: '技能安全开发',
    description: '学习如何开发安全的AI Agent技能，避免常见安全漏洞',
    category: '开发安全',
    level: '高级',
    duration: '8小时',
    students: 567,
    rating: 4.7,
    progress: 0,
    isCompleted: false,
    isEnrolled: false,
    modules: 10,
    badges: ['开发认证', '高级课程'],
    instructor: '安全架构师',
  },
  {
    id: 'community-security',
    title: '社区安全管理',
    description: '学习如何管理和维护安全的AI Agent社区环境',
    category: '社区管理',
    level: '中级',
    duration: '5小时',
    students: 432,
    rating: 4.6,
    progress: 100,
    isCompleted: true,
    isEnrolled: true,
    modules: 7,
    badges: ['管理认证', '完成课程'],
    instructor: '社区安全专家',
  },
  {
    id: 'incident-response',
    title: '安全事件响应',
    description: '学习如何识别、分析和响应AI Agent安全事件',
    category: '应急响应',
    level: '高级',
    duration: '7小时',
    students: 321,
    rating: 4.9,
    progress: 0,
    isCompleted: false,
    isEnrolled: false,
    modules: 9,
    badges: ['专家课程', '实战训练'],
    instructor: '安全响应团队',
  },
  {
    id: 'privacy-protection',
    title: '隐私保护实践',
    description: '学习如何在AI Agent开发中保护用户隐私和数据安全',
    category: '隐私安全',
    level: '中级',
    duration: '5小时',
    students: 654,
    rating: 4.8,
    progress: 0,
    isCompleted: false,
    isEnrolled: false,
    modules: 8,
    badges: ['隐私认证', '合规课程'],
    instructor: '隐私保护专家',
  },
]

const learningPaths = [
  {
    id: 'beginner-path',
    title: '安全初学者路径',
    description: '从零开始学习AI Agent安全，适合所有新用户',
    courses: 3,
    duration: '15小时',
    progress: 60,
    color: 'blue',
  },
  {
    id: 'developer-path',
    title: '开发者安全路径',
    description: '专注于技能开发和配置安全，适合开发者',
    courses: 4,
    duration: '26小时',
    progress: 25,
    color: 'green',
  },
  {
    id: 'admin-path',
    title: '管理员安全路径',
    description: '学习社区管理和安全运维，适合管理员',
    courses: 3,
    duration: '16小时',
    progress: 0,
    color: 'purple',
  },
]

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">安全学习中心</h1>
        <p className="text-muted-foreground">
          系统学习AI Agent安全知识，提升你的安全技能等级
        </p>
      </div>

      {/* 学习路径 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">推荐学习路径</h2>
          <Button variant="outline">查看所有路径</Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {learningPaths.map((path) => (
            <Card key={path.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-${path.color}-500`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {path.title}
                </CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">包含课程</span>
                    <span className="font-medium">{path.courses}门课程</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">预计时长</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">学习进度</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={path.progress > 0 ? "default" : "outline"}>
                  {path.progress > 0 ? '继续学习' : '开始学习'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 课程筛选 */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">全部课程</TabsTrigger>
            <TabsTrigger value="enrolled">我的课程</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
            <TabsTrigger value="recommended">推荐课程</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>共 {courses.length} 门课程</span>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                    {course.isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                    {course.badges.map((badge) => (
                      <Badge key={badge} variant="outline" className="bg-primary/10">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.modules}个模块
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        {course.rating}
                      </span>
                    </div>

                    {course.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">学习进度</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students}人学习
                      </span>
                      <span className="text-muted-foreground">讲师: {course.instructor}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  {course.isEnrolled ? (
                    <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                      {course.progress > 0 ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          继续学习
                        </>
                      ) : (
                        '开始学习'
                      )}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline">
                      <Lock className="mr-2 h-4 w-4" />
                      立即加入
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrolled">
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>你还没有加入任何课程</p>
            <Button className="mt-4">浏览课程</Button>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>你还没有完成任何课程</p>
            <Button className="mt-4">开始学习</Button>
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>根据你的学习情况推荐课程</p>
            <Button className="mt-4">查看推荐</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* 成就展示 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              我的学习成就
            </CardTitle>
            <CardDescription>通过学习获得的证书和徽章</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-1">1</div>
                <div className="text-sm text-muted-foreground">完成课程</div>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-1">15</div>
                <div className="text-sm text-muted-foreground">学习时长(小时)</div>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-sm text-muted-foreground">获得徽章</div>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-1">中级</div>
                <div className="text-sm text-muted-foreground">安全等级</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}