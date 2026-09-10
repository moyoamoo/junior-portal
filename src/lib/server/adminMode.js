import { error } from '@sveltejs/kit';

const ADMIN_MODE_COOKIE = 'admin_mode_session';

export const ADMIN_MODE_DURATION = 30 * 60; // 30 minutes


// Get the current Admin Mode session.
export async function getAdminModeSession({ locals, cookies }) {
    const sessionId = cookies.get(ADMIN_MODE_COOKIE);

    // No Admin Mode cookie
    if (!sessionId) {
        return null;
    }

    const { data: adminModeSession, error} = await locals.supabase
        .from('admin_mode_sessions')
        .select('id, user_id, admin_user_id, expires_at')
        .eq('id', sessionId)
        .single();

    // Session doesn't exist
    if (error || !adminModeSession) {
        return null;
    }

    // Check whether the session has expired
    const expiresAt = new Date(adminModeSession.expires_at);
    const now = new Date();

    if (expiresAt <= now) {
        // Remove the expired browser cookie
        cookies.delete(ADMIN_MODE_COOKIE, {
            path: '/'
        });

        return null;
    }

    return adminModeSession;
}


//Check whether Admin Mode is currently active.
export async function isAdminModeActive({ locals, cookies }) {
    const session = await getAdminModeSession({
        locals,
        cookies
    });

    return session !== null;
}


//Require Admin Mode to be active.Useful later for protected admin actions/pages
export async function requireAdminMode({ locals, cookies }) {
    const session = await getAdminModeSession({
        locals,
        cookies
    });

    if (!session) {
        throw error(403, 'Admin Mode is not active');
    }

    return session;
}