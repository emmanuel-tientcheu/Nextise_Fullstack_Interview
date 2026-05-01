import { IEmailSender } from "@/services/ports/IEmailSender"
import { EmailSender } from "@/services/adapters/EmailSender"

class EmailContainer {
  private static instance: EmailContainer
  private _emailSender: IEmailSender | null = null

  private constructor() {}

  static getInstance(): EmailContainer {
    if (!EmailContainer.instance) {
      EmailContainer.instance = new EmailContainer()
    }
    return EmailContainer.instance
  }

  get emailSender(): IEmailSender {
    if (!this._emailSender) {
      this._emailSender = new EmailSender()
    }
    return this._emailSender
  }
}

export const emailContainer = EmailContainer.getInstance()

// Fonction utilitaire pour l'injection
export function getEmailSender(): IEmailSender {
  return emailContainer.emailSender
}