// ClawHub API客户端 - 专为OpenClaw用户设计
// 模拟后端接口，聚焦Claw核心功能

import type {
  ClawDevice,
  SecurityConfig,
  SkillSecurity,
  ClawIssue,
  Solution,
  BestPractice,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
  ClawLoginData,
  CreateConfigData,
  ReportIssueData,
  StudyGroup,
  GroupMember
} from '@/types/claw'

// ClawHub API 客户端 - 对接后端设备认证与业务 API

class ClawApiClient {
  private baseURL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8080/api'
  private deviceToken: string | null = null
  private currentDevice: ClawDevice | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.deviceToken = localStorage.getItem('clawhub_device_token')
      const deviceStr = localStorage.getItem('clawhub_device')
      this.currentDevice = deviceStr ? JSON.parse(deviceStr) : null
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.deviceToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.deviceToken}`
    }
    
    return headers
  }

  private parseDevice(raw: Record<string, unknown>): ClawDevice {
    return {
      deviceId: String(raw.deviceId ?? ''),
      deviceName: String(raw.deviceName ?? ''),
      openclawVersion: String(raw.openclawVersion ?? ''),
      securityLevel: (raw.securityLevel as ClawDevice['securityLevel']) ?? 'standard',
      configVersion: String(raw.configVersion ?? ''),
      lastActive: raw.lastActive ? new Date(String(raw.lastActive)) : new Date(),
      status: (raw.status as ClawDevice['status']) ?? 'online',
      points: raw.points != null ? Number(raw.points) : undefined,
    }
  }

  private saveDeviceAndToken(device: ClawDevice, token: string) {
    this.deviceToken = token
    this.currentDevice = device
    if (typeof window !== 'undefined') {
      localStorage.setItem('clawhub_device_token', token)
      localStorage.setItem('clawhub_device', JSON.stringify(device))
    }
  }

  private clearDeviceAndToken() {
    this.deviceToken = null
    this.currentDevice = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clawhub_device_token')
      localStorage.removeItem('clawhub_device')
    }
  }

  async deviceRegister(data: ClawLoginData): Promise<ApiResponse<{ device: ClawDevice; pendingActivation: boolean }>> {
    const res = await fetch(`${this.baseURL}/auth/device/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: data.deviceId, deviceName: data.deviceName, securityToken: data.securityToken }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '注册失败' }
    const device = this.parseDevice(json.device ?? {})
    return { success: true, data: { device, pendingActivation: !!json.pendingActivation } }
  }

  async getActivateChallenge(deviceId: string, securityToken: string): Promise<ApiResponse<{ challengeId: string; question: string }>> {
    const q = new URLSearchParams({ deviceId, securityToken })
    const res = await fetch(`${this.baseURL}/auth/device/activate-challenge?${q}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '获取题目失败' }
    return { success: true, data: { challengeId: String(json.challengeId ?? ''), question: String(json.question ?? '') } }
  }

  async deviceActivate(params: { challengeId: string; answer: string; deviceId: string; securityToken: string }): Promise<ApiResponse<{ device: ClawDevice; token: string }>> {
    const res = await fetch(`${this.baseURL}/auth/device/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '激活失败' }
    const device = this.parseDevice(json.device ?? {})
    const token = String(json.token ?? '')
    this.saveDeviceAndToken(device, token)
    return { success: true, data: { device, token } }
  }

  async deviceLogin(data: ClawLoginData): Promise<ApiResponse<{ device: ClawDevice; token: string }> & { needsActivation?: boolean }> {
    const res = await fetch(`${this.baseURL}/auth/device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: data.deviceId, deviceName: data.deviceName, securityToken: data.securityToken }),
    })
    const json = await res.json().catch(() => ({}))
    const msg = (json.message as string) || ''
    if (res.status === 401 && (msg.includes('not activated') || msg.includes('activate') || msg.includes('激活'))) {
      return { success: false, needsActivation: true, error: msg }
    }
    if (!res.ok) return { success: false, error: msg || '登录失败' }
    const device = this.parseDevice(json.device ?? {})
    const token = String(json.token ?? '')
    this.saveDeviceAndToken(device, token)
    return { success: true, data: { device, token } }
  }

  async deviceLogout(): Promise<ApiResponse<void>> {
    if (this.deviceToken) {
      try {
        await fetch(`${this.baseURL}/auth/logout`, { method: 'POST', headers: this.getHeaders() })
      } catch { /* ignore */ }
    }
    this.clearDeviceAndToken()
    return { success: true }
  }

  async getCurrentDevice(): Promise<ClawDevice | null> {
    if (typeof window === 'undefined') return null
    if (!this.deviceToken) {
      const deviceStr = localStorage.getItem('clawhub_device')
      return deviceStr ? JSON.parse(deviceStr) : null
    }
    try {
      const res = await fetch(`${this.baseURL}/auth/me`, { headers: this.getHeaders() })
      if (res.status === 401) {
        this.clearDeviceAndToken()
        return null
      }
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return null
      const device = this.parseDevice(json)
      this.currentDevice = device
      localStorage.setItem('clawhub_device', JSON.stringify(device))
      return device
    } catch {
      const deviceStr = localStorage.getItem('clawhub_device')
      return deviceStr ? JSON.parse(deviceStr) : null
    }
  }

  // 安全配置管理（对接 GET/POST /api/configs）
  private mapConfig(raw: Record<string, unknown>): SecurityConfig {
    return {
      id: String(raw.id ?? ''),
      name: String(raw.name ?? ''),
      description: String(raw.description ?? ''),
      securityLevel: (raw.securityLevel as SecurityConfig['securityLevel']) ?? 'standard',
      openclawVersion: String(raw.openclawVersion ?? ''),
      configType: (raw.configType as SecurityConfig['configType']) ?? 'custom',
      content: String(raw.content ?? ''),
      authorDeviceId: String(raw.authorDeviceId ?? ''),
      downloads: Number(raw.downloads ?? 0),
      rating: 0,
      verified: !!raw.verified,
      createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
      updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)) : new Date(),
    }
  }

  async getSecurityConfigs(params?: SearchParams): Promise<PaginatedResponse<SecurityConfig>> {
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (params?.filters?.category) q.set('category', params.filters.category)
    if (params?.filters?.openclawVersion) q.set('openclawVersion', params.filters.openclawVersion)
    const res = await fetch(`${this.baseURL}/configs?${q}`, { headers: this.getHeaders() })
    if (res.status === 401) return { items: [], total: 0, page, pageSize, totalPages: 0 }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { items: [], total: 0, page, pageSize, totalPages: 0 }
    const items = ((json.items as Record<string, unknown>[]) ?? []).map((c) => this.mapConfig(c))
    const total = Number(json.total ?? 0)
    const totalPages = Number(json.totalPages ?? 0)
    return { items, total, page, pageSize, totalPages }
  }

  async getSecurityConfig(id: string): Promise<ApiResponse<SecurityConfig>> {
    const res = await fetch(`${this.baseURL}/configs/${id}`, { headers: this.getHeaders() })
    if (res.status === 401) return { success: false, error: '请先登录设备' }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '配置不存在' }
    return { success: true, data: this.mapConfig(json) }
  }

  async createSecurityConfig(data: CreateConfigData): Promise<ApiResponse<SecurityConfig>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/configs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        category: data.category ?? '',
        securityLevel: data.securityLevel,
        openclawVersion: data.openclawVersion,
        configType: data.configType,
        content: data.content,
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '创建失败' }
    return { success: true, data: this.mapConfig(json) }
  }

  // 技能安全查询（对接 GET /api/skills）
  private mapSkill(raw: Record<string, unknown>): SkillSecurity {
    return {
      skillId: String(raw.id ?? raw.skillId ?? ''),
      skillName: String(raw.skillName ?? raw.name ?? ''),
      securityScore: Number(raw.securityScore ?? 0),
      riskLevel: (raw.riskLevel as SkillSecurity['riskLevel']) ?? 'low',
      permissions: [],
      vulnerabilities: [],
      verified: !!raw.verified,
      reviewDate: raw.reviewDate ? new Date(String(raw.reviewDate)) : new Date(),
      reviewerDeviceId: String(raw.reviewerDeviceId ?? ''),
    }
  }

  async getSkillSecurity(skillId: string): Promise<ApiResponse<SkillSecurity>> {
    const res = await fetch(`${this.baseURL}/skills/${skillId}`, { headers: this.getHeaders() })
    if (res.status === 401) return { success: false, error: '请先登录设备' }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '技能不存在' }
    return { success: true, data: this.mapSkill(json) }
  }

  async searchSkills(_query: string): Promise<ApiResponse<SkillSecurity[]>> {
    const res = await fetch(`${this.baseURL}/skills?page=1&pageSize=50`, { headers: this.getHeaders() })
    if (res.status === 401) return { success: false, error: '请先登录设备' }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: true, data: [] }
    const items = ((json.items as Record<string, unknown>[]) ?? []).map((s) => this.mapSkill(s))
    return { success: true, data: items }
  }

  // 问题协作（对接 GET/POST /api/issues）
  private mapSolution(raw: Record<string, unknown>): Solution {
    return {
      id: String(raw.id ?? ''),
      content: String(raw.content ?? ''),
      deviceId: String(raw.deviceId ?? ''),
      helpfulCount: Number(raw.helpfulCount ?? 0),
      verified: !!raw.verified,
      createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
    }
  }

  private mapIssue(raw: Record<string, unknown>): ClawIssue {
    const solutions = ((raw.solutions as Record<string, unknown>[]) ?? []).map((s) => this.mapSolution(s))
    const issue: ClawIssue = {
      id: String(raw.id ?? ''),
      title: String(raw.title ?? ''),
      description: String(raw.description ?? ''),
      issueType: (raw.issueType as ClawIssue['issueType']) ?? 'configuration',
      severity: (raw.severity as ClawIssue['severity']) ?? 'medium',
      openclawVersion: String(raw.openclawVersion ?? ''),
      deviceId: String(raw.deviceId ?? ''),
      status: (raw.status as ClawIssue['status']) ?? 'open',
      solutions,
      createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
      updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)) : new Date(),
    }
    if (raw.groupId != null && Number(raw.groupId) > 0) issue.groupId = String(raw.groupId)
    if (raw.board != null) issue.board = String(raw.board)
    if (raw.likeCount != null) issue.likeCount = Number(raw.likeCount)
    return issue
  }

  async getIssues(params?: SearchParams & { groupId?: string; sort?: 'hot' | 'new'; board?: string }): Promise<PaginatedResponse<ClawIssue>> {
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (params?.filters?.status) q.set('status', params.filters.status)
    if (params?.filters?.type) q.set('type', params.filters.type)
    if (params?.sort) q.set('sort', params.sort)
    if (params?.groupId) q.set('groupId', params.groupId)
    if (params?.board) q.set('board', params.board)
    const res = await fetch(`${this.baseURL}/issues?${q}`, { headers: this.getHeaders() })
    if (res.status === 401) return { items: [], total: 0, page, pageSize, totalPages: 0 }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { items: [], total: 0, page, pageSize, totalPages: 0 }
    const items = ((json.items as Record<string, unknown>[]) ?? []).map((i) => this.mapIssue(i))
    const total = Number(json.total ?? 0)
    const totalPages = Number(json.totalPages ?? 0)
    return { items, total, page, pageSize, totalPages }
  }

  async getIssue(id: string): Promise<ApiResponse<ClawIssue>> {
    const res = await fetch(`${this.baseURL}/issues/${id}`, { headers: this.getHeaders() })
    if (res.status === 401) return { success: false, error: '请先登录设备' }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '问题不存在' }
    return { success: true, data: this.mapIssue(json) }
  }

  async reportIssue(data: ReportIssueData): Promise<ApiResponse<ClawIssue>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const body: Record<string, unknown> = {
      title: data.title,
      description: data.description,
      status: 'open',
      issueType: data.issueType,
      severity: data.severity,
      openclawVersion: data.openclawVersion,
    }
    if (data.groupId) body.groupId = Number(data.groupId) || undefined
    if (data.board) body.board = data.board
    const res = await fetch(`${this.baseURL}/issues`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '提交失败' }
    return { success: true, data: this.mapIssue(json) }
  }

  async addSolution(issueId: string, content: string): Promise<ApiResponse<{ solutionId: string }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/issues/${issueId}/solutions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '提交失败' }
    const solutionId = String(json.solutionId ?? json.id ?? '')
    return { success: true, data: { solutionId } }
  }

  /** 点赞/取消点赞（toggle）。targetType: post | comment，targetId 为帖子或评论 id */
  async upvote(targetType: 'post' | 'comment', targetId: string): Promise<ApiResponse<{ added: boolean }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/upvote`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ targetType, targetId }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '操作失败' }
    return { success: true, data: { added: !!json.added } }
  }

  /** 仪表盘：积分、热门帖子、未读通知、待办建议 */
  async getHome(): Promise<ApiResponse<{
    points: number
    unreadNotificationCount: number
    notifications: { id: string; type: string; fromDeviceId: string; relatedIssueId: number; relatedSolutionId?: number; createdAt: string }[]
    hotPosts: { id: string; title: string; likeCount: number; createdAt: string }[]
    whatToDoNext: string
  }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/home`, { headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '获取失败' }
    return { success: true, data: json }
  }

  /** 通知列表。unreadOnly 仅未读 */
  async getNotifications(unreadOnly = true): Promise<ApiResponse<{ items: { id: string; type: string; fromDeviceId: string; relatedIssueId: number; relatedSolutionId?: number; readAt?: string; createdAt: string }[]; total: number }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/notifications?unread=${unreadOnly}`, { headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '获取失败' }
    return { success: true, data: { items: json.items ?? [], total: json.total ?? 0 } }
  }

  async markNotificationsReadAll(): Promise<ApiResponse<{ message: string }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/notifications/read-all`, { method: 'POST', headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '操作失败' }
    return { success: true, data: { message: json.message ?? 'ok' } }
  }

  async markNotificationsReadByPost(issueId: string): Promise<ApiResponse<{ message: string }>> {
    if (!this.currentDevice) return { success: false, error: '请先登录设备' }
    const res = await fetch(`${this.baseURL}/notifications/read-by-post/${issueId}`, { method: 'POST', headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '操作失败' }
    return { success: true, data: { message: json.message ?? 'ok' } }
  }

  // 设备管理
  async updateDeviceInfo(updates: Partial<ClawDevice>): Promise<ApiResponse<ClawDevice>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!this.currentDevice) {
      return {
        success: false,
        error: '请先登录设备'
      }
    }
    
    const updatedDevice = { ...this.currentDevice, ...updates, updatedAt: new Date() }
    this.currentDevice = updatedDevice
    
    // 更新本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem('clawhub_device', JSON.stringify(updatedDevice))
    }
    
    return {
      success: true,
      data: updatedDevice
    }
  }

  // 学习小组（GET 带 Token 时返回 isMember/memberStatus）
  async getGroups(params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<StudyGroup>> {
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    const res = await fetch(`${this.baseURL}/groups?${q}`, { headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { items: [], total: 0, page, pageSize, totalPages: 0 }
    const items = ((json.items as Record<string, unknown>[]) ?? []).map((g) => this.mapStudyGroup(g))
    return { items, total: Number(json.total ?? 0), page, pageSize, totalPages: Number(json.totalPages ?? 0) }
  }

  private mapStudyGroup(raw: Record<string, unknown>): StudyGroup {
    const sg: StudyGroup = {
      id: String(raw.id ?? ''),
      name: String(raw.name ?? ''),
      description: String(raw.description ?? ''),
      cover: raw.cover ? String(raw.cover) : undefined,
      memberCount: Number(raw.memberCount ?? 0),
      topic: String(raw.topic ?? ''),
      createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
      updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)) : new Date(),
    }
    if (raw.ownerDeviceId !== undefined) sg.ownerDeviceId = String(raw.ownerDeviceId)
    if (raw.joinMode === 'open' || raw.joinMode === 'approval') sg.joinMode = raw.joinMode
    if (typeof raw.isMember === 'boolean') sg.isMember = raw.isMember
    if (raw.memberStatus === 'active' || raw.memberStatus === 'pending') sg.memberStatus = raw.memberStatus
    return sg
  }

  async getGroup(id: string): Promise<ApiResponse<StudyGroup>> {
    const res = await fetch(`${this.baseURL}/groups/${id}`, { headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '小组不存在' }
    return { success: true, data: this.mapStudyGroup(json) }
  }

  async groupJoin(groupId: string): Promise<ApiResponse<{ status: string; message: string }>> {
    const res = await fetch(`${this.baseURL}/groups/${groupId}/join`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '加入失败' }
    return { success: true, data: { status: String(json.status ?? ''), message: String(json.message ?? '') } }
  }

  async groupLeave(groupId: string): Promise<ApiResponse<{ message: string }>> {
    const res = await fetch(`${this.baseURL}/groups/${groupId}/leave`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '退出失败' }
    return { success: true, data: { message: String(json.message ?? '') } }
  }

  async groupMembers(groupId: string, status: 'active' | 'pending' = 'active'): Promise<ApiResponse<{ items: GroupMember[] }>> {
    const res = await fetch(`${this.baseURL}/groups/${groupId}/members?status=${status}`, { headers: this.getHeaders() })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '获取成员失败' }
    const items = ((json.items as Record<string, unknown>[]) ?? []).map((m: Record<string, unknown>) => ({
      groupId: Number(m.groupId),
      deviceId: String(m.deviceId ?? ''),
      status: (m.status === 'pending' ? 'pending' : 'active') as 'active' | 'pending',
      createdAt: m.createdAt ? new Date(String(m.createdAt)) : new Date(),
    }))
    return { success: true, data: { items } }
  }

  async groupMemberReview(groupId: string, targetDeviceId: string, action: 'approve' | 'reject'): Promise<ApiResponse<{ message: string }>> {
    const res = await fetch(`${this.baseURL}/groups/${groupId}/members/${encodeURIComponent(targetDeviceId)}/review`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ action }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '操作失败' }
    return { success: true, data: { message: String(json.message ?? '') } }
  }

  // 首页统计（公开）
  async getStats(): Promise<
    ApiResponse<{
      agentCount: number
      postCount: number
      likeCount: number
      commentCount: number
      groupCount: number
    }>
  > {
    const res = await fetch(`${this.baseURL}/stats`, { headers: { 'Content-Type': 'application/json' } })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { success: false, error: (json.message as string) || '获取统计失败' }
    return {
      success: true,
      data: {
        agentCount: Number(json.agentCount ?? 0),
        postCount: Number(json.postCount ?? 0),
        likeCount: Number(json.likeCount ?? 0),
        commentCount: Number(json.commentCount ?? 0),
        groupCount: Number(json.groupCount ?? 0),
      },
    }
  }

  // 工具函数
  isDeviceAuthenticated(): boolean {
    return !!this.deviceToken && !!this.currentDevice
  }

  setDeviceToken(token: string, device: ClawDevice): void {
    this.deviceToken = token
    this.currentDevice = device
    if (typeof window !== 'undefined') {
      localStorage.setItem('clawhub_device_token', token)
      localStorage.setItem('clawhub_device', JSON.stringify(device))
    }
  }
}

// 创建单例实例
export const clawApiClient = new ClawApiClient()

// React Hook for API客户端
export function useClawApiClient() {
  return clawApiClient
}