import { EmailService } from './email.interface';
import * as nodemailer from 'nodemailer';

export class NodemailerEmailService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: {
    host: string;
    port: number;
    auth: { user: string; pass: string; }
  }) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'noreply@ourservice.com',
      to,
      subject,
      text: body,
    });
  }
}
