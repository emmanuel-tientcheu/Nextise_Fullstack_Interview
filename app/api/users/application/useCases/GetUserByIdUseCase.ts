// application/usecases/user/GetUserByIdUseCase.ts

import { UserResponse } from "../../domaine/viewModels/UserResponse"
import { IUserRepository } from "../ports/IUserRepository"

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponse | null> {
    // Validation 1: Vérifier que l'ID existe
    if (!id) {
      throw new Error('User ID is required')
    }

    // Validation 2: Vérifier le format de l'ID (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid user ID format')
    }

    // Récupérer l'utilisateur
    const user = await this.userRepository.findById(id)

    // Pas d'utilisateur trouvé
    if (!user) {
      return null
    }

    // Retourner la réponse sans le mot de passe
    return user.toResponse()
  }
}