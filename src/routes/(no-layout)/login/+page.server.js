import axios from 'axios';
import prisma from '$lib/prisma'

import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';


/**
 * @param {Object} params - OAuth parameters
 * @param {string} params.access_token - Access token
 */
async function fetchUserData(params) {
  const url = 'https://www.googleapis.com/oauth2/v1/userinfo'

  // console.log('access token', params)
  try {
    const response = await axios.get(url, {
      params,
      headers: {},
      timeout: 60000 // timeout in milliseconds
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

/** @type {import('@sveltejs/kit').ServerLoad} */
export async function load({ url, cookies }) {
  const code = url.searchParams.get('code');
  const message = url.searchParams.get('message');
  const error = url.searchParams.get('error');

  let alert = null;
  if (message === 'password-reset-success') {
    alert = {
      type: 'success',
      message: 'Your password has been reset successfully. Please log in with your new password.'
    };
  } else if (error === 'invalid-reset-token') {
    alert = {
      type: 'error',
      message: 'The password reset link is invalid or has expired. Please request a new one.'
    };
  }
  const redirect_uri = env.GOOGLE_LOGIN_DOMAIN + '/login'

    // Check if the user is already authenticated
  if (code != null) {
    const tokenParams = {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET
    }
    let info

    try {
      const response = await axios.post('https://accounts.google.com/o/oauth2/token', tokenParams)
      info = response.data
    } catch (error) {
      console.error('Error:', error)
    }

    const user_info = await fetchUserData({ access_token: info.access_token })

    const session_id = uuidv4()
    
    await prisma.user.upsert({
      where: { email: user_info.email },
      update: { 
        session_id: session_id,
        profilePhoto: user_info.picture,
        lastLogin: new Date() 
      },
      create: {
        email: user_info.email,
        name: user_info.name,
        profilePhoto: user_info.picture,
        user_id: user_info.id,
        session_id: session_id
      }
    })

    await cookies.set('session', session_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 7 // one week
    });
        
    throw redirect(307, '/bounce');
  }

  // Check for existing session
  const sessionId = cookies.get('session');
  if (sessionId) {
    const user = await prisma.user.findUnique({
      where: { session_id: sessionId }
    });
    
    if (user) {
      throw redirect(307, '/bounce');
    }
  }

  const google_login_url = (
    'https://accounts.google.com/o/oauth2/auth?client_id=' +
    env.GOOGLE_CLIENT_ID +
    '&response_type=code' +
    '&scope=https://www.googleapis.com/auth/userinfo.profile ' +
    'https://www.googleapis.com/auth/userinfo.email' +
    '&redirect_uri=' + redirect_uri +
    '&state=google'
  )

  return { google_url: google_login_url }
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return fail(400, {
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toString() }
        });

        if (!user || !user.password) {
            return fail(400, {
                error: 'Invalid email or password'
            });
        }

        // Compare password hash
        const hashedPassword = hashPassword(password.toString());
        if (hashedPassword !== user.password) {
            return fail(400, {
                error: 'Invalid email or password'
            });
        }

        // Generate session ID
        const sessionId = uuidv4();

        // Update user with new session
        await prisma.user.update({
            where: { id: user.id },
            data: {
                session_id: sessionId,
                lastLogin: new Date()
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

        throw redirect(307, '/bounce');
    }
};
