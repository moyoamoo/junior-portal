import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

import {
    adminSupabase,
    createAdminToken
} from '$lib/server/admin.js';

export const actions = {
    default: async ({ request, locals, cookies }) => {

        const formData = await request.formData();

        const email = formData.get('email');
        const password = formData.get('password');


        // Make sure the adult is already logged in
        const user = await locals.getUser();

        if (!user) {
            throw redirect(303, '/');
        }


        // Check that fields were provided
        if (!email || !password) {
            return fail(400, {
                message: 'Please enter your email and password.',
                email
            });
        }


        // Authenticate the admin using a separate Supabase client
        const { data, error } =
            await adminSupabase.auth.signInWithPassword({
                email,
                password
            });


        // Invalid login
        if (error || !data.user) {
            return fail(400, {
                message: 'Invalid admin email or password.',
                email
            });
        }


        // Check that the account has the admin role
        const { data: profile, error: profileError } =
            await adminSupabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();


        // Not an admin
        if (profileError || profile?.role !== 'admin') {
            return fail(403, {
                message: 'You do not have admin permission.',
                email
            });
        }


        // Create the separate admin session token
        const adminToken = createAdminToken(data.user.id);


        // Store admin session in a secure cookie
        

        cookies.set('admin_session', adminToken, {
            path: '/admin/dashboard',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 30

        });

        // Send admin to dashboard
        throw redirect(303, '/admin/dashboard');
    }
};