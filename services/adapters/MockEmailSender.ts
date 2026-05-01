import { AssignmentEmailData, EmailResult } from "@/lib/email/types"
import { IEmailSender } from "../ports/IEmailSender"

export class MockEmailSender implements IEmailSender {
  async sendAssignmentEmail(data: AssignmentEmailData): Promise<EmailResult> {
    return { success: true, messageId: 'mock-message-id' }
  }

  async sendTestEmail(to: string): Promise<EmailResult> {
    return { success: true, messageId: 'mock-test-message-id' }
  }

  isConfigured(): boolean {
    return true
  }
}