// app/api/test-repo/route.ts
import { NextResponse } from 'next/server'
import { getUserRepository } from '@/lib/repositories/UserConfiguration'

export async function GET() {
  const repo = getUserRepository()
  
  return NextResponse.json({ 
    message: 'Repository initialized',
    type: repo.constructor.name 
  })
}