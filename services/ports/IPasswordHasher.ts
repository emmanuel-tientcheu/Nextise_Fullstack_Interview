export interface IPasswordHasher {
  /**
   * @param password - Mot de passe en clair
   * @returns Mot de passe hashé
   */
  hash(password: string): Promise<string>
  
  /**
   * @param password - Mot de passe en clair
   * @param hashedPassword - Mot de passe hashé
   * @returns true si le mot de passe correspond
   */
  compare(password: string, hashedPassword: string): Promise<boolean>
}