import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import './repositories/UserConfiguration'

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaPg({
  connectionString,
})

export const prisma = new PrismaClient({ adapter })