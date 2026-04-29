import { CreateUserDTO } from "../../infrastructure/next/CreateUserDTO"
import { UpdateUserDTO } from "../../infrastructure/next/UpdateUserDTO"
import { User } from "../../domaine/models/User"

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>
  
  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>
  
  update(id: string, data: UpdateUserDTO): Promise<User>
  
  delete(id: string): Promise<void>
  
  exists(email: string): Promise<boolean>
}