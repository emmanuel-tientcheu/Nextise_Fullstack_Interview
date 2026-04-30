// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

// async function main() {
//   console.log('🌱 Seeding database...')

//   // 1. Créer un utilisateur admin
//   const hashedPassword = await bcrypt.hash('admin123', 10)
  
//   await prisma.user.upsert({
//     where: { email: 'admin@example.com' },
//     update: {},
//     create: {
//       email: 'admin@example.com',
//       password: hashedPassword,
//       name: 'Administrator',
//     },
//   })

//   // 2. Créer des formateurs
//   const trainers = await prisma.trainer.createMany({
//     data: [
//       {
//         name: 'Sophie Martin',
//         email: 'sophie.martin@example.com',
//         location: 'Paris',
//         subjects: ['React.js', 'Next.js', 'TypeScript'],
//         hourlyRate: 120,
//         rating: 5,
//         experience: 'Expert',
//       },
//       {
//         name: 'Thomas Dubois',
//         email: 'thomas.dubois@example.com',
//         location: 'Lyon',
//         subjects: ['Node.js', 'PostgreSQL', 'GraphQL'],
//         hourlyRate: 90,
//         rating: 4,
//         experience: 'Senior',
//       },
//       {
//         name: 'Emma Bernard',
//         email: 'emma.bernard@example.com',
//         location: 'Paris',
//         subjects: ['React.js', 'Vue.js', 'Angular'],
//         hourlyRate: 100,
//         rating: 4,
//         experience: 'Senior',
//       },
//       {
//         name: 'Nicolas Petit',
//         email: 'nicolas.petit@example.com',
//         location: 'Marseille',
//         subjects: ['Docker', 'Kubernetes', 'AWS'],
//         hourlyRate: 110,
//         rating: 4,
//         experience: 'Senior',
//       },
//     ],
//   })

//   // 3. Créer des formations
//   const courses = await prisma.course.createMany({
//     data: [
//       {
//         name: 'React.js Advanced Workshop',
//         date: new Date('2025-06-15T09:00:00Z'),
//         subjects: ['React.js', 'Next.js', 'TypeScript'],
//         location: 'Paris',
//         participants: 12,
//         notes: 'Advanced React patterns and performance',
//         price: 2500,
//         trainerPrice: 800,
//         status: 'SCHEDULED',
//       },
//       {
//         name: 'Node.js Backend Mastery',
//         date: new Date('2025-06-20T09:00:00Z'),
//         subjects: ['Node.js', 'PostgreSQL', 'GraphQL'],
//         location: 'Lyon',
//         participants: 8,
//         price: 2200,
//         trainerPrice: 750,
//         status: 'SCHEDULED',
//       },
//       {
//         name: 'Fullstack Docker Deployment',
//         date: new Date('2025-07-10T09:00:00Z'),
//         subjects: ['Docker', 'Kubernetes', 'AWS'],
//         location: 'Marseille',
//         participants: 15,
//         price: 2800,
//         trainerPrice: 900,
//         status: 'DRAFT',
//       },
//     ],
//   })

//   console.log('✅ Seed completed!')
//   console.log('📊 Trainers created:', trainers.count)
//   console.log('📚 Courses created:', courses.count)
//   console.log('🔑 Admin: admin@example.com / admin123')
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })