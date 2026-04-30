// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl
//     const method = request.method

//     const publicRoutes = ['/login', '/register', '/api/auth']

//     const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

//     // Cas spécial: POST /api/users est publique (création de compte)
//     if (pathname === '/api/users' && method === 'POST') {
//         return NextResponse.next()
//     }

//     // Si c'est une route publique, on laisse passer
//     if (isPublicRoute) {
//         return NextResponse.next()
//     }

//     const token = await getToken({
//         req: request,
//         secret: process.env.NEXTAUTH_SECRET
//     })

//     if (pathname === '/') {
//         if (token) {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//     }

//     // Pas de token = pas authentifié
//     if (!token) {
//         // Si c'est une requête API, retourner 401
//         if (pathname.startsWith('/api')) {
//             return NextResponse.json(
//                 { error: 'Unauthorized', message: 'You must be logged in' },
//                 { status: 401 }
//             )
//         }

//         // Si c'est une page, rediriger vers login
//         const url = new URL('/auth/login', request.url)
//         url.searchParams.set('callbackUrl', pathname)
//         return NextResponse.redirect(url)
//     }

//     return NextResponse.next()
// }

// // Configuration des routes à intercepter
// export const config = {
//     matcher: [
//         // Toutes les routes API et pages dashboard
//         '/api/:path*',
//         '/dashboard/:path*',
//         // Exclure les fichiers statiques
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     ],
// }

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🔓 Routes publiques (accessibles sans authentification)
    const publicRoutes = [
        '/',                    // Page d'accueil
        '/login',              // Page de connexion
        '/register',           // Page d'inscription
        '/api/auth',           // Routes d'authentification
    ]

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    // Cas spécial: POST /api/users est publique (création de compte)
    if (pathname === '/api/users' && request.method === 'POST') {
        return NextResponse.next()
    }

    // Si c'est une route publique, on laisse passer
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Vérifier l'authentification pour toutes les autres routes
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // Pas de token = pas authentifié
    if (!token) {
        // Si c'est une requête API, retourner 401
        if (pathname.startsWith('/api')) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'You must be logged in' },
                { status: 401 }
            )
        }

        if (pathname === '/') {
            if (token) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        // Rediriger vers login
        const url = new URL('/login', request.url)
        return NextResponse.redirect(url)
    }

    // Authentifié, on laisse passer
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/courses/:path*',
        '/trainers/:path*',
        '/profile/:path*',
        '/((?!_next/static|_next/image|favicon.ico|login|register|$).*)',
    ],
}