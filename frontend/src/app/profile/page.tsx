import { redirect } from 'next/navigation'

// 用户系统简化为 Claw 设备信息展示，个人中心重定向到设备管理
export default function ProfilePage() {
  redirect('/devices')
}
