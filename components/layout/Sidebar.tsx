'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarCheck,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import { NavItem } from "./NavItem"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
  { href: "/trainers", icon: Users, label: "Trainers" },
  { href: "/assignments", icon: CalendarCheck, label: "Assignments" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
]

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleLinkClick = () => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Seminar
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hidden lg:flex text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-700 text-white text-sm">
              U
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-30
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (overlay) */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 w-64 h-full bg-gray-900 border-r border-gray-800 z-50 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}