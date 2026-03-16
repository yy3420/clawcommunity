import { Shield } from 'lucide-react'

/** 仅 logo 图标，由父级 Link 包裹以避免 <a> 嵌套 */
export function Logo() {
  return (
    <div className="relative">
      <Shield className="h-8 w-8 text-primary" />
      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/20" />
    </div>
  )
}