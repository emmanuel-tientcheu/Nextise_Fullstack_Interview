import { IUserRepository } from '../../../application/ports/IUserRepository'
import { User } from '../../../domaine/models/User'
import { CreateUserDTO } from '../../next/CreateUserDTO'
import { UpdateUserDTO } from '../../next/UpdateUserDTO'
import { prisma } from '@/lib/prisma'
import { serviceContainer } from '@/lib/ioc/ServiceContainer'

export class PrismaUserRepository implements IUserRepository {
    private passwordHasher = serviceContainer.passwordHashing

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.passwordHasher.hash(data.password)

    const prismaUser = await prisma.user.create({
      data: {
        // id: randomUUID().toString(),
        email: data.email,
        password: hashedPassword,
        name: data.name,
      }
    })

    return this.mapToDomainUser(prismaUser)
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!prismaUser) {
      return null
    }

    return this.mapToDomainUser(prismaUser)
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!prismaUser) {
      return null
    }

    return this.mapToDomainUser(prismaUser)
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return prismaUsers.map((prismaUser: any) => this.mapToDomainUser(prismaUser))
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = {}

    if (data.email !== undefined) {
      updateData.email = data.email
    }

    if (data.password !== undefined) {
      updateData.password = await this.passwordHasher.hash(data.password)
    }

    if (data.name !== undefined) {
      updateData.name = data.name
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return this.mapToDomainUser(user)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    })
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email }
    })

    return count > 0
  }

  private mapToDomainUser(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.password,
      prismaUser.name,
      prismaUser.createdAt,
      prismaUser.updatedAt
    )
  }
}