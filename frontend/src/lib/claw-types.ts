// ClawHub 核心模块数据类型 - 聚焦 Claw 用户需求

/** Claw 设备信息 */
export interface ClawDevice {
  id: string
  name: string
  model: string
  firmwareVersion: string
  status: 'online' | 'offline' | 'syncing'
  lastSeen: Date
  configVersion?: string
  linkedUserId?: string
}

/** 安全配置模板（配置库） */
export interface ConfigTemplate {
  id: string
  name: string
  description: string
  category: string
  securityScore: number
  downloadCount: number
  authorId: string
  createdAt: Date
  tags: string[]
  checkedAt?: Date
}

/** 安全检查结果 */
export interface SecurityCheck {
  id: string
  templateId: string
  passed: boolean
  items: { name: string; passed: boolean; message?: string }[]
  checkedAt: Date
}

/** 技能（含安全审查与评分） */
export interface Skill {
  id: string
  name: string
  description: string
  securityScore: number
  auditStatus: 'pending' | 'passed' | 'rejected'
  developerId: string
  createdAt: Date
  installCount: number
  tags: string[]
}

/** 技能开发规范条目 */
export interface SkillGuideline {
  id: string
  title: string
  description: string
  required: boolean
  category: string
}

/** OpenClaw 问题/故障协作 */
export interface Issue {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  type: 'bug' | 'question' | 'best_practice'
  authorId: string
  createdAt: Date
  replyCount: number
  tags: string[]
}

/** 设备配置同步记录 */
export interface ConfigSyncRecord {
  id: string
  deviceId: string
  direction: 'push' | 'pull'
  status: 'success' | 'failed'
  at: Date
  message?: string
}
