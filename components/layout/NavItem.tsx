'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  collapsed?: boolean
}

export function NavItem({ href, icon: Icon, label, collapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-white/10 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
        ${collapsed ? 'justify-center' : 'justify-start'}
      `}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  )
}