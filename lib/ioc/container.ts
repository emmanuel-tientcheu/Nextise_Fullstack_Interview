import { IUserRepository } from "@/app/api/users/application/ports/IUserRepository"
import { UserController } from "@/app/api/users/infrastructure/next/UserController"
import { getUserRepository } from "../repositories/UserConfiguration"
import { CreateUserUseCase } from "@/app/api/users/application/useCases/CreateUserUseCase"
import { UpdateUserUseCase } from "@/app/api/users/application/useCases/UpdateUserUseCase"
import { DeleteUserUseCase } from "@/app/api/users/application/useCases/DeleteUserUseCase"
import { GetUserByIdUseCase } from "@/app/api/users/application/useCases/GetUserByIdUseCase"


class Container {
  private static instance: Container
  private userRepository: IUserRepository
  private userController: UserController | null = null

  private constructor() {
    this.userRepository = getUserRepository()
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  // Use Cases
  private getCreateUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.userRepository)
  }

  private getUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(this.userRepository)
  }

  private getDeleteUserUseCase(): DeleteUserUseCase {
    return new DeleteUserUseCase(this.userRepository)
  }

  private getUserByIdUseCase(): GetUserByIdUseCase {
    return new GetUserByIdUseCase(this.userRepository)
  }


  // Controller Principal
  getUserController(): UserController {
    if (!this.userController) {
      this.userController = new UserController(
        this.getCreateUserUseCase(),
        this.getUpdateUserUseCase(),
        this.getDeleteUserUseCase(),
        this.getUserByIdUseCase(),
      )
    }
    return this.userController
  }
}

export const container = Container.getInstance()