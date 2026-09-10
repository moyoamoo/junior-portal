
import { fail, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public';

import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

import { ADMIN_MODE_DURATION } from '$lib/server/adminMode';

export const actions = {
    login: async ({ request, locals, cookies }) => {

        // Make sure the normal user is logged in
        const normalUser = await locals.getUser();

        if (!normalUser) {
            return fail(401, {
                message: 'You must be logged in to use Admin Mode.'
            });
        }

        const formData = await request.formData();

        const email = formData.get('email');
        const password = formData.get('password');
        const returnTo = formData.get('returnTo');

        // Validate the submitted credentials
        if (!email || !password) {
            return fail(400, {
                message: 'Please enter an email and password.'
            });
        }

        // Only allow redirects to local routes
        const safeReturnTo =
            typeof returnTo === 'string' &&
                returnTo.startsWith('/') &&
                !returnTo.startsWith('//')
                ? returnTo
                : '/juniors';

        // Create a completely separate client for
        // authenticating the Admin Mode account.
        //
        // This client does not persist the Admin Mode
        // authentication session.
        const adminAuthClient = createClient(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false,
                    storage: {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {}
                    }
                }
            }
        );

        // Authenticate the account entered into
        // the Admin Mode modal
        const {
            data: authData,
            error: authError
        } = await adminAuthClient.auth.signInWithPassword({
            email,
            password
        });

        if (authError || !authData.user) {
            console.error(
                'Admin Mode auth error:',
                authError
            );

            return fail(401, {
                message:
                    authError?.message ??
                    'Invalid Admin Mode credentials.'
            });
        }

        // Create the privileged server-side client
        const adminSupabase = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        );

        // Check the role of the account entered
        // into the Admin Mode modal
        const {
            data: profile,
            error: profileError
        } = await adminSupabase
            .from('profiles')
            .select('id, role')
            .eq('id', authData.user.id)
            .single();

        // Only an admin_mode account is allowed
        if (
            profileError ||
            !profile ||
            profile.role !== 'admin_mode'
        ) {
            return fail(403, {
                message:
                    'This account does not have Admin Mode access.'
            });
        }

        // Calculate when the temporary Admin Mode
        // session will expire
        const expiresAt = new Date(
            Date.now() + ADMIN_MODE_DURATION * 1000
        ).toISOString();

        // Create the temporary Admin Mode session
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
            console.error(
                'Admin Mode session error:',
                sessionError
            );

            return fail(500, {
                message: 'Could not start Admin Mode.'
            });
        }

        // Store the temporary session ID
        // in a secure cookie
        cookies.set(
            'admin_mode_session',
            adminModeSession.id,
            {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: ADMIN_MODE_DURATION
            }
        );

        // IMPORTANT:
        // Do NOT call adminAuthClient.auth.signOut().
        //
        // The Admin Mode client is already configured
        // with persistSession: false, so it does not
        // persist this authentication session.
        //
        // Most importantly, we must never sign out
        // the normal user's Supabase session.

        // Return to the page the user was originally on
        throw redirect(303, safeReturnTo);
    },

    logout: async ({ request, locals, cookies }) => {

        // Make sure the normal user is logged in
        const normalUser = await locals.getUser();

        if (!normalUser) {
            throw redirect(303, '/');
        }

        const formData = await request.formData();

        const returnTo = formData.get('returnTo');

        // Only allow redirects to local routes
        const safeReturnTo =
            typeof returnTo === 'string' &&
                returnTo.startsWith('/') &&
                !returnTo.startsWith('//')
                ? returnTo
                : '/juniors';

        const sessionId = cookies.get('admin_mode_session');

        if (sessionId) {

            // Create the privileged server-side client
            const adminSupabase = createClient(
                PUBLIC_SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY,
                {
                    auth: {
                        persistSession: false
                    }
                }
            );

            // Delete only this user's Admin Mode session
            await adminSupabase
                .from('admin_mode_sessions')
                .delete()
                .eq('id', sessionId)
                .eq('user_id', normalUser.id);
        }

        // Remove the Admin Mode cookie
        cookies.delete('admin_mode_session', {
            path: '/'
        });

        // Return to the page the user was on
        throw redirect(303, safeReturnTo);
    }
};
