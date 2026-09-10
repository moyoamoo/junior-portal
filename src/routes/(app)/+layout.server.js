import { createClient } from '@supabase/supabase-js';

import {
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const load = async ({ locals, cookies }) => {
    const user = await locals.getUser();

    if (!user) {
        return {
            adminMode: false
        };
    }

    const sessionId = cookies.get('admin_mode_session');

    if (!sessionId) {
        return {
            adminMode: false
        };
    }

    const adminSupabase = createClient(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false
            }
        }
    );

    const {
        data: session,
        error
    } = await adminSupabase
        .from('admin_mode_sessions')
        .select('id, expires_at')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

    if (
        error ||
        !session ||
        new Date(session.expires_at) <= new Date()
    ) {
        cookies.delete('admin_mode_session', {
            path: '/'
        });

        return {
            adminMode: false
        };
    }

    return {
        adminMode: true
    };
};