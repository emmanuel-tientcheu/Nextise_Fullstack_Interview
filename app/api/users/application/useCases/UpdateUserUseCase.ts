import { IUserRepository } from "../ports/IUserRepository"
import { UpdateUserDTO } from "../../infrastructure/next/UpdateUserDTO"
import { UserResponse } from "../../domaine/viewModels/UserResponse"

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<UserResponse> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Si on change l'email, vérifier qu'il n'est pas déjà pris
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userRepository.exists(data.email)
      if (emailExists) {
        throw new Error('Email already exists')
      }
    }

    // Validation du nouveau mot de passe si fourni
    if (data.password && data.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Validation du nouvel email si fourni
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format')
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await this.userRepository.update(id, data)

    // Retourner la réponse sans le mot de passe
    return updatedUser.toResponse()
  }
}