// app/(auth)/login/page.tsx
'use client'

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Message de succès après inscription
  useEffect(() => {
    const registered = searchParams.get('registered')
    const registeredEmail = searchParams.get('email')
    
    if (registered === 'true' && registeredEmail) {
      setMessage(`Account created successfully! Please sign in with ${registeredEmail}`)
      setEmail(registeredEmail)
    }
  }, [searchParams])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Email ou mot de passe incorrect")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-white">Seminar</h1>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="border border-gray-600 text-white px-4 py-2 rounded-md hover:border-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Sign up
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {/* Message de succès */}
          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-md mb-6 text-center">
              {message}
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}