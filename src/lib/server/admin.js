import { createClient } from '@supabase/supabase-js';
import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public';

import { ADMIN_SESSION_SECRET } from '$env/static/private';
import crypto from 'node:crypto';


// Separate Supabase client for admin authentication
export const adminSupabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);


// Create a secure admin session token
export function createAdminToken(userId) {

    const expires = Date.now() + (30 * 60 * 1000); // 30 minutes

    const data = `${userId}.${expires}`;

    const signature = crypto
        .createHmac('sha256', ADMIN_SESSION_SECRET)
        .update(data)
        .digest('hex');

    return `${data}.${signature}`;
}


// Verify an admin session token
export function verifyAdminToken(token) {

    if (!token) {
        return null;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
        return null;
    }

    const [userId, expires, signature] = parts;

    // Check expiry
    if (Date.now() > Number(expires)) {
        return null;
    }

    const data = `${userId}.${expires}`;

    const expectedSignature = crypto
        .createHmac('sha256', ADMIN_SESSION_SECRET)
        .update(data)
        .digest('hex');

    // Prevent timing attacks
    if (
        !crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        )
    ) {
        return null;
    }

    return {
        userId,
        expires: Number(expires)
    };
}