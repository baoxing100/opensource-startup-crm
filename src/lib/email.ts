import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

// Email configuration
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(env.SMTP_PORT || '587'),
    secure: env.SMTP_SECURE === 'true',
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// Send email utility function
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM}>`,
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

// Email templates
export function getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to AWCRM!</h1>
            <p>Hello ${name},</p>
            <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
            <p>
                <a href="${verificationUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Verify Email Address
                </a>
            </p>
            <p>This link will expire in ${env.EMAIL_VERIFICATION_EXPIRY || 24} hours.</p>
            <p>If you did not create an account, no further action is required.</p>
            <p>Best regards,<br>The AWCRM Team</p>
        </div>
    `;
}

export function getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Reset Your Password</h1>
            <p>Hello ${name},</p>
            <p>You requested to reset your password. Click the button below to set a new password:</p>
            <p>
                <a href="${resetUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Reset Password
                </a>
            </p>
            <p>This link will expire in ${env.PASSWORD_RESET_EXPIRY || 1} hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>The AWCRM Team</p>
        </div>
    `;
}

export function getWelcomeEmailTemplate(name: string): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to AWCRM!</h1>
            <p>Hello ${name},</p>
            <p>Thank you for verifying your email address. Your account is now fully activated.</p>
            <p>You can now:</p>
            <ul>
                <li>Create and manage your organization</li>
                <li>Add team members</li>
                <li>Start managing your customer relationships</li>
            </ul>
            <p>If you need any help getting started, check out our documentation or contact support.</p>
            <p>Best regards,<br>The AWCRM Team</p>
        </div>
    `;
}
