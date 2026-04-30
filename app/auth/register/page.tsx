'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { registerAction } from "@/app/actions/register.action"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  // Rediriger si déjà connecté
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

  if (status === "authenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)

    if (!result.success) {
      setLoading(false)

      // Gérer les erreurs par champ
      if (result.errors) {
        const errorsMap: { [key: string]: string } = {}
        result.errors.forEach(err => {
          errorsMap[err.field] = err.message
        })
        setFieldErrors(errorsMap)

        if (errorsMap.general) {
          setError(errorsMap.general)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-white">Seminar</h1>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="border border-gray-600 text-white px-4 py-2 rounded-md hover:border-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Sign up
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create an account</h2>
            <p className="text-gray-400 mt-2">Get started with Seminar</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Full name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                placeholder="John Doe"
                disabled={loading}
              />
              {fieldErrors.name && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                className={`w-full px-4 py-3 bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500 ${fieldErrors.email ? 'border-red-500' : 'border-gray-700'
                  }`}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className={`w-full px-4 py-3 bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500 ${fieldErrors.password ? 'border-red-500' : 'border-gray-700'
                  }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`w-full px-4 py-3 bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}