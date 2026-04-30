
import { randomUUID } from 'crypto'
import { IUserRepository } from '../../../application/ports/IUserRepository'
import { User } from '../../../domaine/models/User'
import { CreateUserDTO } from '../../next/CreateUserDTO'
import { UpdateUserDTO } from '../../next/UpdateUserDTO'
import { serviceContainer } from '@/lib/ioc/ServiceContainer'

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map()
    private passwordHasher = serviceContainer.passwordHashing

    async create(data: CreateUserDTO): Promise<User> {
        const now = new Date()
        const hashedPassword = await this.passwordHasher.hash(data.password)

        const user = new User(
            randomUUID(),
            data.email,
            hashedPassword,
            data.name || null,
            now,
            now
        )

        this.users.set(user.id, user)
        return user
    }

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user
            }
        }
        return null
    }

    async update(id: string, data: UpdateUserDTO): Promise<User> {
        const existingUser = await this.findById(id)
        if (!existingUser) {
            throw new Error(`User with id ${id} not found`)
        }

        const updatedUser = new User(
            existingUser.id,
            data.email ?? existingUser.email,
            data.password ? await this.passwordHasher.hash(data.password) : existingUser.password,
            data.name !== undefined ? data.name : existingUser.name,
            existingUser.createdAt,
            new Date()
        )

        this.users.set(id, updatedUser)
        return updatedUser
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id)
    }

    async exists(email: string): Promise<boolean> {
        const user = await this.findByEmail(email)
        return user !== null
    }



}