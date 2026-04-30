'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 text-xl font-bold">Seminar Manager</div>
        <nav className="mt-8">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-800">
            Tableau de bord
          </Link>
          <Link href="/courses" className="block px-4 py-2 hover:bg-gray-800">
            Formations
          </Link>
          <Link href="/trainers" className="block px-4 py-2 hover:bg-gray-800">
            Formateurs
          </Link>
          <Link href="/assignments" className="block px-4 py-2 hover:bg-gray-800">
            Affectations
          </Link>
          <Link href="/profile" className="block px-4 py-2 hover:bg-gray-800">
            Mon profil
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Bienvenue, {session.user?.name || session.user?.email}
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}