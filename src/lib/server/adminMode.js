import { error } from '@sveltejs/kit';

const ADMIN_MODE_COOKIE = 'admin_mode_session';

export const ADMIN_MODE_DURATION = 30 * 60; // 30 minutes


// Get the current Admin Mode session.
export const getAdminModeSession = async ({ locals, cookies }) => {
    const sessionId = cookies.get(ADMIN_MODE_COOKIE);

    // No Admin Mode cookie
    if (!sessionId) {
        return null;
    }

   

    const { data: adminModeSession, error } = await locals.supabase
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


// Check whether Admin Mode is currently active.
export const isAdminModeActive = async ({ locals, cookies }) => {
    const session = await getAdminModeSession({
        locals,
        cookies
    });

    return session !== null;
}


// Require Admin Mode to be active
export const requireAdminMode = async ({ locals, cookies }) => {
    const session = await getAdminModeSession({
        locals,
        cookies
    });

    if (!session) {
        throw error(403, 'Admin Mode is not active');
    }

    return session;
}

// Helper function for congratulations route 
export const getValidAdminModeSession = async ({ locals, cookies }) => {
    const user = await locals.getUser();
    if (!user) {
        return null;
    }

    const sessionId = cookies.get('admin_mode_session');
    if (!sessionId) {
        return null;
    }

  
    const { data: session, error } = await locals.supabase
        .from('admin_mode_sessions')
        .select('id, user_id, expires_at')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

    if (error || !session) {
        return null;
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
        // expired — clean up so it can't be reused
        await supabase.from('admin_mode_sessions').delete().eq('id', session.id);
        cookies.delete('admin_mode_session', { path: '/' });
        return null;
    }

    return session;
}