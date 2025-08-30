import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { sendEmail, getWelcomeEmailTemplate } from '$lib/email';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const token = params.token;
    
    if (!token) {
        return {
            success: false,
            error: 'Invalid verification token'
        };
    }

    try {
        // Find user with matching token that hasn't expired
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpiry: {
                    gt: new Date()
                },
                isEmailVerified: false
            }
        });

        if (!user) {
            return {
                success: false,
                error: 'The verification link is invalid or has expired'
            };
        }

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiry: null
            }
        });

        // Send welcome email
        await sendEmail({
            to: user.email,
            subject: 'Welcome to BottleCRM!',
            html: getWelcomeEmailTemplate(user.name || 'there')
        });

        return {
            success: true
        };
    } catch (error) {
        console.error('Email verification error:', error);
        return {
            success: false,
            error: 'An error occurred during verification'
        };
    }
}
