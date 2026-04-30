import bcrypt from 'bcryptjs'
import { IPasswordHasher } from '../ports/IPasswordHasher'

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}