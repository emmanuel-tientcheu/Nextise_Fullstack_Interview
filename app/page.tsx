'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black  flex flex-col text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Seminar</h1>
        <div className="flex gap-4">
          <Link href="/auth/login"  className="border border-gray-600 px-4 py-2 rounded-md hover:border-white">
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 ">
        <h2 className="text-6xl font-bold leading-tight max-w-4xl">
          Build and manage your seminars effortlessly
        </h2>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl">
          A modern platform to organize trainings, assign instructors, and track progress — all in one place.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/auth/register"
            className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-600 px-6 py-3 rounded-md hover:border-white"
          >
            Sign in
          </Link>
        </div>
      </section>

      
    </div>
  )
}
