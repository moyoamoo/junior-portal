import { fail } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public';

import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

import { ADMIN_MODE_DURATION } from '$lib/server/adminMode';


export const actions = {
    login: async ({ request, locals, cookies }) => {

        // Make sure a normal user is currently logged in
        const normalUser = await locals.getUser();

        if (!normalUser) {
            return fail(401, {
                message: 'You must be logged in to use Admin Mode.'
            });
        }


        // Get the credentials submitted by the modal form
        const formData = await request.formData();

        const email = formData.get('email');
        const password = formData.get('password');


        if (!email || !password) {
            return fail(400, {
                message: 'Please enter an email and password.'
            });
        }


        //Create a separate Supabase Auth client.
        
        const adminAuthClient = createClient(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );


        // Authenticate the Admin Mode account
        const {
            data: authData,
            error: authError
        } = await adminAuthClient.auth.signInWithPassword({
            email,
            password
        });


        if (authError || !authData.user) {
            return fail(401, {
                message: 'Invalid Admin Mode credentials.'
            });
        }


        //Create a server-side Supabase client using the service-role key.
       
        const adminSupabase = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        );


        // Check the Admin Mode user's profile
        const {
            data: profile,
            error: profileError
        } = await adminSupabase
            .from('profiles')
            .select('id, role')
            .eq('id', authData.user.id)
            .single();


        if (
            profileError ||
            !profile ||
            profile.role !== 'admin_mode'
        ) {
            await adminAuthClient.auth.signOut();

            return fail(403, {
                message: 'This account does not have Admin Mode access.'
            });
        }


        // Calculate the Admin Mode expiry time
        const expiresAt = new Date(
            Date.now() + ADMIN_MODE_DURATION * 1000
        ).toISOString();


        //temp admin mode session
        const {
            data: adminModeSession,
            error: sessionError
        } = await adminSupabase
            .from('admin_mode_sessions')
            .insert({
                user_id: normalUser.id,
                admin_user_id: authData.user.id,
                expires_at: expiresAt
            })
            .select('id, expires_at')
            .single();


        if (sessionError || !adminModeSession) {
            await adminAuthClient.auth.signOut();

            console.error(
                'Admin Mode session error:',
                sessionError
            );

            return fail(500, {
                message: 'Could not start Admin Mode.'
            });
        }


        // Store the temporary session ID in the browser.

        cookies.set('admin_mode_session', adminModeSession.id, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: ADMIN_MODE_DURATION
        });


        // Sign out of the temporary Auth client.
        // This does NOT sign out the normal user.
        await adminAuthClient.auth.signOut();


        return {
            success: true,
            expiresAt: adminModeSession.expires_at
        };
    }
};