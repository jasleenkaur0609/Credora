import nodemailer, {
  type SendMailOptions,
  type Transporter,
} from "nodemailer";
import { env } from "../../config/env.js";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private readonly transporter: Transporter | null;

  constructor() {
    if (
      env.smtpHost &&
      env.smtpUser &&
      env.smtpPassword &&
      env.smtpFrom
    ) {
      this.transporter = nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpPort === 465,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPassword,
        },
      });
    } else {
      this.transporter = null;
    }
  }

  private async sendEmail(
    input: SendEmailInput,
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error(
        "Email service is not configured. Configure SMTP credentials before sending emails.",
      );
    }

    const mailOptions: SendMailOptions = {
      from: env.smtpFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendTemporaryPasswordEmail(
    email: string,
    firstName: string,
    temporaryPassword: string,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Your Credora account is ready",
      text: [
        `Hello ${firstName},`,
        "",
        "Your Credora account has been created.",
        "",
        `Temporary password: ${temporaryPassword}`,
        "",
        "For security, you must change this temporary password before continuing.",
        "",
        "If you did not request this account, please contact your organization administrator.",
        "",
        "Regards,",
        "Credora Security Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Welcome to Credora</h2>

            <p>Hello ${this.escapeHtml(firstName)},</p>

            <p>
              Your Credora account has been created successfully.
            </p>

            <p>
              <strong>Temporary password:</strong>
              <code>${this.escapeHtml(temporaryPassword)}</code>
            </p>

            <p>
              For security, you must change this temporary password
              before continuing.
            </p>

            <p>
              If you did not request this account, please contact
              your organization administrator.
            </p>

            <p>
              Regards,<br />
              Credora Security Team
            </p>
          </body>
        </html>
      `,
    });
  }

  async sendEmailVerificationOtp(
    email: string,
    firstName: string,
    otp: string,
    expiresInMinutes: number,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Verify your Credora email address",
      text: [
        `Hello ${firstName},`,
        "",
        `Your Credora verification code is: ${otp}`,
        "",
        `This code expires in ${expiresInMinutes} minutes.`,
        "",
        "Do not share this code with anyone.",
        "",
        "Regards,",
        "Credora Security Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Verify your email</h2>

            <p>Hello ${this.escapeHtml(firstName)},</p>

            <p>
              Use the following verification code to verify
              your Credora email address:
            </p>

            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">
              ${this.escapeHtml(otp)}
            </p>

            <p>
              This code expires in
              <strong>${expiresInMinutes} minutes</strong>.
            </p>

            <p>
              Do not share this code with anyone.
            </p>

            <p>
              Regards,<br />
              Credora Security Team
            </p>
          </body>
        </html>
      `,
    });
  }

  async sendPasswordResetOtp(
    email: string,
    firstName: string,
    otp: string,
    expiresInMinutes: number,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Credora password reset verification",
      text: [
        `Hello ${firstName},`,
        "",
        `Your Credora password reset code is: ${otp}`,
        "",
        `This code expires in ${expiresInMinutes} minutes.`,
        "",
        "If you did not request a password reset, you can safely ignore this email and consider changing your password if you suspect unauthorized access.",
        "",
        "Do not share this code with anyone.",
        "",
        "Regards,",
        "Credora Security Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password reset verification</h2>

            <p>Hello ${this.escapeHtml(firstName)},</p>

            <p>
              Use the following code to continue resetting
              your Credora password:
            </p>

            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">
              ${this.escapeHtml(otp)}
            </p>

            <p>
              This code expires in
              <strong>${expiresInMinutes} minutes</strong>.
            </p>

            <p>
              If you did not request a password reset, you can
              safely ignore this email.
            </p>

            <p>
              Do not share this code with anyone.
            </p>

            <p>
              Regards,<br />
              Credora Security Team
            </p>
          </body>
        </html>
      `,
    });
  }

  async sendPasswordChangedEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Your Credora password was changed",
      text: [
        `Hello ${firstName},`,
        "",
        "Your Credora password was successfully changed.",
        "",
        "If you did not make this change, contact your organization administrator immediately.",
        "",
        "Regards,",
        "Credora Security Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password changed</h2>

            <p>Hello ${this.escapeHtml(firstName)},</p>

            <p>
              Your Credora password was successfully changed.
            </p>

            <p>
              If you did not make this change, contact your
              organization administrator immediately.
            </p>

            <p>
              Regards,<br />
              Credora Security Team
            </p>
          </body>
        </html>
      `,
    });
  }

  async sendSecurityNotification(
    email: string,
    firstName: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject,
      text: [
        `Hello ${firstName},`,
        "",
        message,
        "",
        "Regards,",
        "Credora Security Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Credora Security Notification</h2>

            <p>Hello ${this.escapeHtml(firstName)},</p>

            <p>
              ${this.escapeHtml(message)}
            </p>

            <p>
              Regards,<br />
              Credora Security Team
            </p>
          </body>
        </html>
      `,
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

export const emailService = new EmailService();