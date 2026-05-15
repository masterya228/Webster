import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(private config: ConfigService) {
    this.apiKey = config.get<string>('BREVO_API_KEY', '');
    this.fromEmail = config.get('MAIL_FROM_EMAIL', 'noreply@example.com');
    this.fromName = config.get('MAIL_FROM_NAME', 'Webster');

    if (!this.apiKey) {
      this.logger.warn('BREVO_API_KEY is not set — emails will not be sent');
    } else {
      this.logger.log(`Email service ready (Brevo) — from: ${this.fromName} <${this.fromEmail}>`);
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn(`Skipping email to ${to} — BREVO_API_KEY not set`);
      return;
    }

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: this.fromName, email: this.fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`Failed to send email to ${to}: ${res.status} ${text}`);
      } else {
        const data = await res.json() as any;
        this.logger.log(`Email sent to ${to} (messageId: ${data.messageId})`);
      }
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const backendUrl = this.config.get('BACKEND_PUBLIC_URL', 'http://localhost:3001');
    const link = `${backendUrl}/api/auth/verify?token=${token}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f8f7ff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px;
            box-shadow: 0 4px 24px rgba(108,99,255,.10); overflow: hidden; }
    .header { background: linear-gradient(135deg,#6c63ff,#a855f7); padding: 40px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    h2 { color: #1a1a2e; margin: 0 0 12px; font-size: 22px; }
    p { color: #6b6b8d; line-height: 1.7; margin: 0 0 20px; }
    .btn { display: inline-block; padding: 14px 32px; background: #6c63ff;
           color: #fff !important; text-decoration: none; border-radius: 10px;
           font-weight: 600; font-size: 15px; }
    .footer { padding: 24px 32px; background: #f8f7ff; text-align: center;
              color: #aaa; font-size: 12px; }
    .link { color: #6c63ff; word-break: break-all; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">Vizora</div>
    </div>
    <div class="body">
      <h2>Привіт, ${name}!</h2>
      <p>Дякуємо за реєстрацію в Vizora. Щоб активувати акаунт і почати створювати дизайни — підтвердіть свою електронну пошту.</p>
      <p style="text-align:center">
        <a href="${link}" class="btn">Підтвердити пошту</a>
      </p>
      <p style="font-size:13px">Якщо кнопка не працює, скопіюйте посилання:</p>
      <p><a href="${link}" class="link">${link}</a></p>
      <p style="font-size:13px;color:#bbb">Посилання дійсне 24 години. Якщо ви не реєструвалися — проігноруйте цей лист.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Vizora · Online Graphic Editor</div>
  </div>
</body>
</html>`;

    await this.send(to, 'Підтвердіть реєстрацію у Vizora', html);
  }

  async sendPasswordChangedEmail(to: string, name: string): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f8f7ff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px;
            box-shadow: 0 4px 24px rgba(108,99,255,.10); overflow: hidden; }
    .header { background: linear-gradient(135deg,#6c63ff,#a855f7); padding: 40px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    h2 { color: #1a1a2e; margin: 0 0 12px; font-size: 22px; }
    p { color: #6b6b8d; line-height: 1.7; margin: 0 0 20px; }
    .footer { padding: 24px 32px; background: #f8f7ff; text-align: center;
              color: #aaa; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">Vizora</div>
    </div>
    <div class="body">
      <h2>Привіт, ${name}!</h2>
      <p>Ваш акаунт Vizora успішно підтверджено. Ласкаво просимо!</p>
      <p>Тепер ви можете входити та створювати дизайни.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Vizora · Online Graphic Editor</div>
  </div>
</body>
</html>`;

    await this.send(to, 'Акаунт Vizora підтверджено', html);
  }
}
