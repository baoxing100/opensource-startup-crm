import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const token = params.token;
    
    // Check if token exists and is valid
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        throw redirect(307, '/login?error=invalid-reset-token');
    }

    return {
        token
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    resetPassword: async ({ request, params }) => {
        const data = await request.formData();
        const password = data.get('password')?.toString();
        const token = params.token;

        if (!password || password.length < 8) {
            return fail(400, {
                error: 'Password must be at least 8 characters long'
            });
        }

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return fail(400, {
                error: 'Invalid or expired reset token'
            });
        }

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashPassword(password),
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        throw redirect(307, '/login?message=password-reset-success');
    }
};
