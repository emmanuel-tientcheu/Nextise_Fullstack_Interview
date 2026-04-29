import { CreateUserDTO } from "../../infrastructure/next/CreateUserDTO"
import { IUserRepository } from "../ports/IUserRepository"
import { UserResponse } from "../../domaine/viewModels/UserResponse"


export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(data: CreateUserDTO): Promise<UserResponse> {

        if (!data.email || !data.password) {
            throw new Error('Email and password are required')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            throw new Error('Invalid email format')
        }

        if (data.password.length < 6) {
            throw new Error('Password must be at least 6 characters')
        }

        const existingUser = await this.userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new Error('Email already exists')
        }

        const user = await this.userRepository.create(data)

        // Retourner la réponse sans le mot de passe
        return user.toResponse()
    }
}