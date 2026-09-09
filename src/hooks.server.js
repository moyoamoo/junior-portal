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


    // Get current user
    event.locals.getUser = async () => {

        const {
            data: { user }
        } = await event.locals.supabase.auth.getUser();

        return user;
    };


    const user = await event.locals.getUser();
    const path = event.url.pathname;


    // Protect admin dashboard
    if (path.startsWith('/admin/dashboard')) {

        // Adult must be logged in
        if (!user) {
            throw redirect(303, '/');
        }


        // Get admin session cookie
        const adminToken =
            event.cookies.get('admin_session');


        // Cookie doesn't exist
        if (!adminToken) {
            throw redirect(303, '/admin');
        }


        // Verify token
        const adminSession =
            verifyAdminToken(adminToken);


        // Token is invalid or expired
        if (!adminSession) {

            event.cookies.delete('admin_session', {
                path: '/admin/dashboard'
            });

            throw redirect(303, '/admin');
        }
    }


    // Admin session is only valid while accessing the dashboard
    if (!path.startsWith('/admin/dashboard')) {
        event.cookies.delete('admin_session', {
            path: '/admin/dashboard'
        });
    }



    // Protect normal user routes
    if (path.startsWith('/booklet') && !user) {
        throw redirect(303, '/');
    }

    if (path.startsWith('/juniors') && !user) {
        throw redirect(303, '/');
    }


    return resolve(event);
};