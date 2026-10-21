import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { adminSupabase, createAdminToken } from '$lib/server/admin.js';

import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import {
    adminSupabase,
    createAuthClient,
    createAdminToken
} from '$lib/server/admin.js';

export const actions = {
    default: async ({ request, locals, cookies }) => {
        // The shared main login must already exist before anyone can go to admin
        const user = await locals.getUser();

        if (!user) {
            throw redirect(303, '/');
        }

        // Read the form fields
        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString();

        // Make sure both fields were filled in
        if (!email || !password) {
            return fail(400, {
                message: 'Please enter your email and password.',
                email
            });
        }


        try {
            // Check the credentials with a throwaway client so the main session cookies are left untouched
            const authClient = createAuthClient();

            const { data, error } = await authClient.auth.signInWithPassword({
                email,
                password
            });

            // Wrong email or password
            if (error || !data.user) {
                console.error('admin sign-in failed:', error);

                return fail(400, {
                    message: 'Invalid admin email or password.',
                    email
                });
            }

            // Look up the role with the secret-key client (bypasses RLS)
            const { data: profile, error: profileError } = await adminSupabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            // No profile row, or the account isn't an admin
            // This login is for the admin dashboard, so only that role is allowed
            if (profileError || profile?.role !== 'admin_dashboard') {
                console.error('admin role check failed:', profileError, profile);

                return fail(403, {
                    message: 'You do not have admin permission.',
                    email
                });
            }

            // You can't be in admin mode and the admin dashboard at the same time,
            // so remove the admin mode cookie (use the path admin mode sets it with)
            cookies.delete('admin_mode_session', { path: '/' });

            // Create our own signed token, separate from the Supabase session
            const adminToken = createAdminToken(data.user.id);

            // Store it in an httpOnly cookie, only sent to the dashboard routes
            cookies.set('admin_session', adminToken, {
                path: '/admin/dashboard',
                httpOnly: true,
                secure: !dev,
                sameSite: 'lax',
                maxAge: 60 * 30
            });
        } catch (err) {
            // Something crashed, e.g. a network failure or a missing env variable
            console.error('admin login crashed:', err);

            return fail(500, {
                message: 'Something went wrong, please try again.',
                email
            });
        }

        // Success: send the admin to the dashboard (outside the try on purpose)
        throw redirect(303, '/admin/dashboard');
    }
};