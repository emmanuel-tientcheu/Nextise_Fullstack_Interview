import { BcryptPasswordHasher } from "@/services/adapters/BcryptPasswordHasher"
import { IPasswordHasher } from "@/services/ports/IPasswordHasher"


class ServiceContainer {
  private static instance: ServiceContainer
  private _passwordHashing: IPasswordHasher | null = null

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  get passwordHashing(): IPasswordHasher {
    if (!this._passwordHashing) {
      this._passwordHashing = new BcryptPasswordHasher()
    }
    return this._passwordHashing
  }

}

export const serviceContainer = ServiceContainer.getInstance()