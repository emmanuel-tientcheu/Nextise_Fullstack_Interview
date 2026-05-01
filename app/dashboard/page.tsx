// app/(dashboard)/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  const quickActions = [
    {
      title: 'Courses',
      description: 'Manage your seminars and training sessions',
      icon: BookOpen,
      path: '/dashboard/courses',
      color: 'bg-blue-500',
    },
    {
      title: 'Trainers',
      description: 'View and manage trainer profiles',
      icon: Users,
      path: '/dashboard/trainers',
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <p className="text-gray-400">
        Welcome to your Seminar Management Platform. Quickly access your main resources below.
      </p>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.path}
              onClick={() => router.push(action.path)}
              className="group flex items-center justify-between rounded-xl border border-gray-800 p-6 text-left transition-all duration-300 hover:border-gray-600 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg ${action.color} p-3 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
                →
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}