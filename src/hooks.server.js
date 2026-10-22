import { redirect } from '@sveltejs/kit';

import {
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  PUBLIC_SUPABASE_URL
} from '$env/static/public';

import { createServerClient } from '@supabase/ssr';

import { verifyAdminToken } from '$lib/server/admin.js';

export const handle = async ({ event, resolve }) => {
  // Supabase connection (normal shared login session)
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        // Read all cookies from the incoming request
        getAll: () => {
          return event.cookies.getAll();
        },

        // Write any cookies Supabase wants to set
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, {
              ...options,
              path: '/'
            });
          });
        }
      }
    }
  );

  // Get current normal user
  event.locals.getUser = async () => {
    const {
      data: { user }
    } = await event.locals.supabase.auth.getUser();

    return user;
  };

  const user = await event.locals.getUser();
  const path = event.url.pathname;

  // Verified admin session, filled in below for admin routes.
  // Load functions can check this as a second line of defence.
  event.locals.adminSession = null;

  // Protect every page under /admin/ (dashboard, juniors, stats...).
  if (path.startsWith('/admin/')) {
    // Normal user must be logged in
    if (!user) {
      throw redirect(303, '/');
    }

    // Get admin session cookie
    const adminToken = event.cookies.get('admin_session');

    // No admin session
    if (!adminToken) {
      throw redirect(303, '/admin');
    }

    // Verify admin session (checks signature and expiry)
    const adminSession = verifyAdminToken(adminToken);

    // Invalid or expired admin session
    if (!adminSession) {
      // Cookie was set with path '/admin', so delete it with the same path
      event.cookies.delete('admin_session', {
        path: '/admin'
      });

      throw redirect(303, '/admin');
    }

    // Valid: make it available to load functions
    event.locals.adminSession = adminSession;
  }

  // Normal user routes
  if (path.startsWith('/booklet') && !user) {
    throw redirect(303, '/');
  }

  if (path.startsWith('/juniors') && !user) {
    throw redirect(303, '/');
  }

  return resolve(event);
};