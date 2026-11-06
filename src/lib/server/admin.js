import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { ADMIN_SESSION_SECRET, SUPABASE_SERVICE_ROLE_KEY} from '$env/static/private';
import crypto from 'node:crypto';

// Service client
export const adminSupabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});


// Auth client

export const createAuthClient = () => {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

// Helper: sign a string with our secret using HMAC-SHA256
const sign = (data) => {
  return crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(data)
    .digest('hex');
};


// Create an admin session token
export const createAdminToken = (userId) => {
  // Token is valid for 30 minutes
  const expires = Date.now() + 30 * 60 * 1000;

  // The part of the token that gets signed
  const data = `${userId}.${expires}`;

  return `${data}.${sign(data)}`;
};

// -----------------------------------------------------------------------------
// Verify an admin session token
// Returns { userId, expires } if valid, otherwise null
// -----------------------------------------------------------------------------
export const verifyAdminToken = (token) => {
  // No cookie at all
  if (!token) {
    return null;
  }

  // Must be exactly three parts: userId, expires, signature
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const [userId, expires, signature] = parts;

  // Reject a missing or non-numeric expiry, or an expired token
  if (!Number(expires) || Date.now() > Number(expires)) {
    return null;
  }

  // Work out what the signature should be for this userId + expiry
  const expected = Buffer.from(sign(`${userId}.${expires}`));
  const given = Buffer.from(signature);

  // timingSafeEqual throws if the lengths differ, so check the length first.
  // Otherwise an edited cookie would cause a 500 instead of a clean rejection.
  if (given.length !== expected.length) {
    return null;
  }

  // Constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(given, expected)) {
    return null;
  }

  return {
    userId,
    expires: Number(expires)
  };
};