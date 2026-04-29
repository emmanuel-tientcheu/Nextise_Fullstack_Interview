import { NextRequest } from 'next/server'
import { container } from '@/lib/ioc/container'

const userController = container.getUserController()


export async function POST(request: NextRequest) {
  return userController.create(request)
}