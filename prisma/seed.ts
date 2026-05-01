// prisma/seed.ts
import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Trainer, Prisma } from '../lib/generated/prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type CourseWithTrainer = Prisma.CourseGetPayload<{
  include: { assignedTrainer: true }
}>

async function main() {
  console.log('🌱 Starting database seed...')

  // ============================================
  // 1. CRÉER L'UTILISATEUR ADMIN
  // ============================================
  console.log('📝 Creating admin user...')

  const hashedPassword = await bcrypt.hash('password', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Administrator',
    },
  })
  console.log(`✅ Admin created: ${admin.email} / password`)

  // ============================================
  // 2. CRÉER DES FORMATEURS
  // ============================================
  console.log('👨‍🏫 Creating trainers...')

  await prisma.trainer.createMany({
    data: [
      {
        name: 'Sophie Martin',
        email: 'sophie.martin@example.com',
        location: 'Paris',
        subjects: ['React.js', 'Next.js', 'TypeScript'],
        hourlyRate: 120,
        rating: 5,
        experience: 'Expert',
      },
      {
        name: 'Thomas Dubois',
        email: 'thomas.dubois@example.com',
        location: 'Lyon',
        subjects: ['Node.js', 'PostgreSQL', 'GraphQL'],
        hourlyRate: 90,
        rating: 4,
        experience: 'Senior',
      },
      {
        name: 'Emma Bernard',
        email: 'emma.bernard@example.com',
        location: 'Paris',
        subjects: ['React.js', 'Vue.js', 'Angular'],
        hourlyRate: 100,
        rating: 4,
        experience: 'Senior',
      },
      {
        name: 'Nicolas Petit',
        email: 'nicolas.petit@example.com',
        location: 'Marseille',
        subjects: ['Docker', 'Kubernetes', 'AWS'],
        hourlyRate: 110,
        rating: 4,
        experience: 'Senior',
      },
      {
        name: 'Julie Lambert',
        email: 'julie.lambert@example.com',
        location: 'Bordeaux',
        subjects: ['Python', 'Django', 'FastAPI'],
        hourlyRate: 95,
        rating: 4,
        experience: 'Senior',
      },
    ],
    skipDuplicates: true,
  })

  const allTrainers = await prisma.trainer.findMany()
  const trainerMap = new Map(allTrainers.map((t: Trainer) => [t.name, t.id]))
  console.log(`✅ ${allTrainers.length} trainers ready`)

  // ============================================
  // 3. CRÉER DES COURS
  // ============================================
  console.log('📚 Creating courses...')

  const addDays = (d: number) => {
    const dt = new Date()
    dt.setDate(dt.getDate() + d)
    return dt
  }
  const addMonths = (m: number) => {
    const dt = new Date()
    dt.setMonth(dt.getMonth() + m)
    return dt
  }

  await prisma.course.createMany({
    data: [
      {
        name: 'React.js Advanced Workshop',
        date: addMonths(1),
        subjects: ['React.js', 'Next.js', 'TypeScript'],
        location: 'Paris',
        participants: 12,
        notes: 'Advanced React patterns, hooks, and performance optimization',
        price: 2500,
        trainerPrice: 800,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Sophie Martin'),
      },
      {
        name: 'Node.js Backend Mastery',
        date: addMonths(2),
        subjects: ['Node.js', 'PostgreSQL', 'GraphQL'],
        location: 'Lyon',
        participants: 8,
        notes: 'Build scalable backend APIs with Node.js and GraphQL',
        price: 2200,
        trainerPrice: 700,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Thomas Dubois'),
      },
      {
        name: 'Fullstack Docker Deployment',
        date: addMonths(3),
        subjects: ['Docker', 'Kubernetes', 'AWS'],
        location: 'Marseille',
        participants: 15,
        notes: 'Containerization and orchestration for fullstack apps',
        price: 2800,
        trainerPrice: 900,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Nicolas Petit'),
      },
      {
        name: 'Modern Frontend with Vue.js',
        date: addDays(7),
        subjects: ['Vue.js', 'Pinia', 'Vite'],
        location: 'Paris',
        participants: 10,
        price: 2000,
        trainerPrice: 650,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Emma Bernard'),
      },
      {
        name: 'Python Backend with FastAPI',
        date: addDays(14),
        subjects: ['Python', 'FastAPI', 'SQLAlchemy'],
        location: 'Bordeaux',
        participants: 6,
        price: 2100,
        trainerPrice: 680,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Julie Lambert'),
      },
      {
        name: 'Next.js Fullstack Development',
        date: addDays(21),
        subjects: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        location: 'Paris',
        participants: 14,
        notes: 'Build fullstack applications with Next.js App Router',
        price: 2700,
        trainerPrice: 850,
        status: 'SCHEDULED',
        assignedTrainerId: trainerMap.get('Sophie Martin'),
      },
      {
        name: 'Cloud Architecture with AWS',
        date: addMonths(4),
        subjects: ['AWS', 'Serverless', 'CloudFormation'],
        location: 'Lyon',
        participants: 20,
        price: 3200,
        trainerPrice: 1000,
        status: 'DRAFT',
      },
    ],
    skipDuplicates: true,
  })

  const courseCount = await prisma.course.count()
  console.log(`✅ ${courseCount} courses ready`)

  // ============================================
  // 4. RÉCAPITULATIF
  // ============================================
  const allCourses = await prisma.course.findMany({
    include: { assignedTrainer: true },
    orderBy: { date: 'asc' },
  })

  console.log('\n📊 Seed completed successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔐 LOGIN CREDENTIALS:')
  console.log('   Email: admin@test.com')
  console.log('   Password: password')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📅 UPCOMING COURSES:')
  allCourses.forEach((course: CourseWithTrainer) => {
    const dateStr = course.date.toLocaleDateString()
    const trainerName = course.assignedTrainer?.name || 'Not assigned'
    console.log(`   - ${course.name} (${dateStr}) - ${course.location} - Trainer: ${trainerName}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })