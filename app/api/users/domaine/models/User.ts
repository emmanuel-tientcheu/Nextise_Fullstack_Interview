// application/entities/User.ts

import { UserResponse } from "../viewModels/UserResponse";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly name: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Convertit l'entité en DTO de réponse (sans le mot de passe)
  toResponse(): UserResponse {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}