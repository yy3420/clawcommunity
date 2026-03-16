'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { clawApiClient } from '@/lib/claw-api-client'
import type { ClawDevice } from '@/types/claw'

interface AuthContextType {
  device: ClawDevice | null
  isLoading: boolean
  isAuthenticated: boolean
  deviceLogin: (deviceId: string, deviceName: string, securityToken: string) => Promise<{ success: boolean; needsActivation?: boolean }>
  deviceLogout: () => Promise<void>
  refreshDevice: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [device, setDevice] = useState<ClawDevice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentDevice = await clawApiClient.getCurrentDevice()
        setDevice(currentDevice)
      } catch (error) {
        console.error('初始化设备认证失败:', error)
        setDevice(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const deviceLogin = async (deviceId: string, deviceName: string, securityToken: string): Promise<{ success: boolean; needsActivation?: boolean }> => {
    setIsLoading(true)
    try {
      const res = await clawApiClient.deviceLogin({ deviceId, deviceName, securityToken })
      if (res.success && res.data) {
        setDevice(res.data.device)
        return { success: true }
      }
      if (res.needsActivation) {
        return { success: false, needsActivation: true }
      }
      throw new Error(res.error || '设备认证失败')
    } catch (error) {
      console.error('设备认证失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDevice = async () => {
    const d = await clawApiClient.getCurrentDevice()
    setDevice(d)
  }

  const deviceLogout = async () => {
    setIsLoading(true)
    try {
      await clawApiClient.deviceLogout()
      setDevice(null)
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    device,
    isLoading,
    isAuthenticated: !!device,
    deviceLogin,
    deviceLogout,
    refreshDevice,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return context
}

/** 未认证时重定向到设备认证入口 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/auth/device?redirect=' + encodeURIComponent(window.location.pathname)
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}
