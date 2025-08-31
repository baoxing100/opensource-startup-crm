import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '$env/dynamic/private';
import { sendEmail, getVerificationEmailTemplate } from '$lib/email';
import crypto from 'node:crypto';

/** @type {import('./$types').Actions} */
export const actions = {
    signup: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            const email = data.get('email')?.toString().toLowerCase().trim();
            const password = data.get('password')?.toString();
            const name = data.get('name')?.toString().trim();

            // Input validation
            if (!email || !password || !name) {
                return fail(400, {
                    error: 'All fields are required',
                    name: name || '',
                    email: email || ''
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return fail(400, {
                    error: 'Please enter a valid email address',
                    name,
                    email
                });
            }

            // Password validation
            if (password.length < 8) {
                return fail(400, {
                    error: 'Password must be at least 8 characters long',
                    name,
                    email
                });
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return fail(400, {
                    error: 'Email already registered',
                    name,
                    email
                });
            }

            // Generate session and verification tokens
            const sessionId = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Create new user
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    user_id: uuidv4(),
                    session_id: sessionId,
                    isActive: true,
                    lastLogin: new Date(),
                    isEmailVerified: false,
                    emailVerificationToken: verificationToken,
                    emailVerificationExpiry: verificationExpiry
                }
            });

            // Set session cookie
            cookies.set('session', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // one week
            });

            // Send verification email
            try {
                const verificationUrl = `${env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
                await sendEmail({
                    to: email,
                    subject: 'Verify your email address',
                    html: getVerificationEmailTemplate(name, verificationUrl)
                });
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
            }

            // Create default organization
            await prisma.organization.create({
                data: {
                    name: `${name}'s Organization`,
                    users: {
                        create: {
                            userId: user.id,
                            role: 'ADMIN'
                        }
                    }
                }
            });

            throw redirect(307, '/(no-layout)/org');
        } catch (error) {
            console.error('Signup error:', error);
            return fail(500, {
                error: 'An error occurred during signup. Please try again.'
            });
        }
    }
}
    }
};
