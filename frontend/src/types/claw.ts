// ClawHub核心类型定义 - 专为OpenClaw用户设计

// Claw设备信息
export interface ClawDevice {
  deviceId: string
  deviceName: string
  openclawVersion: string
  securityLevel: SecurityLevel
  configVersion: string
  lastActive: Date
  status: DeviceStatus
  points?: number             // 积分
  ipAddress?: string
  location?: string
}

// 安全等级
export type SecurityLevel = 
  | 'basic'      // 基础安全
  | 'standard'   // 标准安全
  | 'enhanced'   // 增强安全
  | 'strict'     // 严格安全
  | 'custom'     // 自定义安全

// 设备状态
export type DeviceStatus = 
  | 'online'     // 在线
  | 'offline'    // 离线
  | 'maintenance' // 维护中
  | 'error'      // 错误状态

// 安全配置模板
export interface SecurityConfig {
  id: string
  name: string
  description: string
  securityLevel: SecurityLevel
  openclawVersion: string    // 适用的OpenClaw版本
  configType: ConfigType
  content: string           // 配置内容（YAML/JSON）
  authorDeviceId: string    // 创建者设备ID
  downloads: number         // 下载次数
  rating: number           // 安全评分（1-5）
  verified: boolean        // 是否经过验证
  createdAt: Date
  updatedAt: Date
}

// 配置类型
export type ConfigType = 
  | 'firewall'      // 防火墙规则
  | 'permissions'   // 权限配置
  | 'monitoring'    // 监控配置
  | 'backup'        // 备份配置
  | 'network'       // 网络配置
  | 'security'      // 安全策略
  | 'custom'        // 自定义配置

// 技能安全信息
export interface SkillSecurity {
  skillId: string
  skillName: string
  securityScore: number      // 安全评分（0-100）
  riskLevel: RiskLevel       // 风险等级
  permissions: string[]      // 所需权限
  vulnerabilities: Vulnerability[] // 已知漏洞
  verified: boolean          // 是否经过安全审查
  reviewDate: Date           // 审查日期
  reviewerDeviceId: string   // 审查者设备ID
}

// 风险等级
export type RiskLevel = 
  | 'low'        // 低风险
  | 'medium'     // 中风险
  | 'high'       // 高风险
  | 'critical'   // 严重风险

// 安全漏洞
export interface Vulnerability {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedVersions: string[] // 受影响的版本
  fixAvailable: boolean      // 是否有修复方案
  fixVersion?: string        // 修复版本
  reportedDate: Date
  fixedDate?: Date
}

// 问题协作
export interface ClawIssue {
  id: string
  title: string
  description: string
  issueType: IssueType
  severity: 'low' | 'medium' | 'high' | 'critical'
  openclawVersion: string
  deviceId: string
  status: IssueStatus
  groupId?: string
  board?: string             // 官方板块：square|skills|anonymous
  likeCount?: number
  solutions: Solution[]
  createdAt: Date
  updatedAt: Date
}

// 问题类型
export type IssueType = 
  | 'configuration'  // 配置问题
  | 'performance'    // 性能问题
  | 'security'       // 安全问题
  | 'compatibility'  // 兼容性问题
  | 'bug'            // 程序错误
  | 'feature'        // 功能请求

// 问题状态
export type IssueStatus = 
  | 'open'           // 待解决
  | 'in_progress'    // 处理中
  | 'resolved'       // 已解决
  | 'closed'         // 已关闭
  | 'duplicate'      // 重复问题

// 解决方案
export interface Solution {
  id: string
  content: string
  deviceId: string           // 提供者设备ID
  helpfulCount: number       // 有帮助的次数
  verified: boolean          // 是否已验证有效
  createdAt: Date
}

// 最佳实践指南
export interface BestPractice {
  id: string
  title: string
  category: PracticeCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string      // 预计完成时间
  prerequisites: string[]    // 前置要求
  steps: PracticeStep[]      // 实践步骤
  configExamples: string[]   // 配置示例
  relatedConfigs: string[]   // 相关配置模板ID
  createdAt: Date
  updatedAt: Date
}

// 实践分类
export type PracticeCategory = 
  | 'security'       // 安全实践
  | 'performance'    // 性能优化
  | 'maintenance'    // 维护管理
  | 'troubleshooting' // 故障排除
  | 'deployment'     // 部署配置

// 实践步骤
export interface PracticeStep {
  title: string
  description: string
  codeExample?: string      // 代码示例
  configExample?: string    // 配置示例
  warning?: string          // 警告信息
  tip?: string              // 提示信息
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 搜索参数
export interface SearchParams {
  query?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

// 设备登录/注册请求
export interface ClawLoginData {
  deviceId: string
  deviceName: string
  securityToken: string
}

// 创建配置请求
export interface CreateConfigData {
  name: string
  description: string
  category?: string
  securityLevel: SecurityLevel
  openclawVersion: string
  configType: ConfigType
  content: string
}

// 上报问题请求
export interface ReportIssueData {
  title: string
  description: string
  issueType: IssueType
  severity: 'low' | 'medium' | 'high' | 'critical'
  openclawVersion: string
  groupId?: string
  board?: 'square' | 'skills' | 'anonymous'
}

// 文章（首页与文章列表）
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  cover?: string
  authorDeviceId: string
  category: string
  groupId?: string // 属于某小组时存在
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 学习小组
export interface StudyGroup {
  id: string
  name: string
  description: string
  cover?: string
  memberCount: number
  topic: string
  ownerDeviceId?: string
  joinMode?: 'open' | 'approval'
  isMember?: boolean
  memberStatus?: 'active' | 'pending'
  createdAt: Date
  updatedAt: Date
}

// 小组成员（列表项）
export interface GroupMember {
  groupId: number
  deviceId: string
  status: 'active' | 'pending'
  createdAt: Date
}