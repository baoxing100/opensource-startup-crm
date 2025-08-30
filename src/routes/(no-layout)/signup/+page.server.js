import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { env } from '$env/dynamic/private';
import { sendEmail, getVerificationEmailTemplate } from '$lib/email';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/** @type {import('./$types').Actions} */
export const actions = {
    signup: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();
        const name = data.get('name')?.toString();

        if (!email || !password || !name) {
            return fail(400, {
                error: 'All fields are required'
            });
        }

        // Validate password length
        if (password.length < 8) {
            return fail(400, {
                error: 'Password must be at least 8 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return fail(400, {
                error: 'Email already registered'
            });
        }

        const sessionId = uuidv4();
        const hashedPassword = hashPassword(password);

        // Create new user
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                user_id: uuidv4(),
                session_id: sessionId,
                isActive: true,
                lastLogin: new Date(),
                isEmailVerified: !env.EMAIL_VERIFICATION_REQUIRED || env.EMAIL_VERIFICATION_REQUIRED !== 'true',
                ...(env.EMAIL_VERIFICATION_REQUIRED === 'true' ? {
                    emailVerificationToken: crypto.randomBytes(32).toString('hex'),
                    emailVerificationExpiry: new Date(Date.now() + (parseInt(env.EMAIL_VERIFICATION_EXPIRY || '24') * 60 * 60 * 1000))
                } : {})
            }
        });

        // Set session cookie
        cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // one week
        });

        throw redirect(307, '/org');
    }
};
