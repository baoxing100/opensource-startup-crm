import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import crypto from 'crypto';
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

/** @type {import('./$types').Actions} */
export const actions = {
    requestReset: async ({ request, url }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString();

        if (!email) {
            return fail(400, {
                error: 'Email is required'
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if user exists
            return {
                success: 'If an account exists with this email, you will receive password reset instructions.'
            };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Store reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // Send email
        const resetUrl = `${url.origin}/reset-password/${resetToken}`;
        
        try {
            await transporter.sendMail({
                from: env.SMTP_FROM || 'noreply@abetworks.in',
                to: data.email,
                subject: 'Reset Your AWCRM Password',
                html: `
                    <h1>Reset Your Password</h1>
                    <p>You requested to reset your password. Click the link below to set a new password:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                `
            });

            return {
                success: 'If an account exists with this email, you will receive password reset instructions.'
            };
        } catch (error) {
            console.error('Failed to send reset email:', error);
            return fail(500, {
                error: 'Failed to send reset email. Please try again later.'
            });
        }
    }
};
