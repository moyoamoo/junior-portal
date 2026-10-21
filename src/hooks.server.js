import { redirect } from '@sveltejs/kit';

import {
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import { createServerClient } from '@supabase/ssr';

import { verifyAdminToken } from '$lib/server/admin.js';


export const handle = async ({ event, resolve }) => {

    // Supabase connection
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return event.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(
                        ({ name, value, options }) => {
                            event.cookies.set(
                                name,
                                value,
                                {
                                    ...options,
                                    path: '/'
                                }
                            );
                        }
                    );
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

/*
    // Protect admin dashboard
    if (path.startsWith('/admin/dashboard')) {

        // Normal user must be logged in
        if (!user) {
            throw redirect(303, '/');
        }


        // Get admin session cookie
        const adminToken =
            event.cookies.get('admin_session');


        // No admin session
        if (!adminToken) {
            throw redirect(303, '/admin');
        }


        // Verify admin session
        const adminSession =
            verifyAdminToken(adminToken);


        // Invalid or expired admin session
        if (!adminSession) {

            event.cookies.delete('admin_session', {
                path: '/'
            });

            throw redirect(303, '/admin');
        }
    }


    // Normal user routes
    if (path.startsWith('/booklet') && !user) {
        throw redirect(303, '/');
    }

    if (path.startsWith('/juniors') && !user) {
        throw redirect(303, '/');
    }

*/

if (path.startsWith('/admin/dashboard')) {
  // Temporary debug logging, remove once login works
  console.log('dashboard hit:', {
    hasUser: !!user,
    hasAdminCookie: !!event.cookies.get('admin_session')
  });

  // Normal user must be logged in
  if (!user) {
    console.log('redirect: no main session');
    throw redirect(303, '/');
  }

  // Get admin session cookie
  const adminToken = event.cookies.get('admin_session');

  // No admin session
  if (!adminToken) {
    console.log('redirect: no admin cookie');
    throw redirect(303, '/admin');
  }

  // Verify admin session
  const adminSession = verifyAdminToken(adminToken);

  // Invalid or expired admin session
  if (!adminSession) {
    console.log('redirect: invalid or expired token');

    event.cookies.delete('admin_session', {
      path: '/'
    });

    throw redirect(303, '/admin');
}}
    return resolve(event);
};