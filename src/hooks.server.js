import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const handle = async ({ event, resolve }) => {

    //supabase connection
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return event.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/' });
                    });
                }
            }
        }
    );

    //check if user is logged in
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };

    //protect routes
    const session = await event.locals.getSession();
    const path = event.url.pathname;

    if (path.startsWith('/admin')) {
        if (!session) {
            throw redirect(303, '/login');
        }

        const { data: profile } = await event.locals.supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.role !== 'admin') {
            throw redirect(303, '/booklet');
        }
    }

    if (path.startsWith('/booklet') && !session) {
        throw redirect(303, '/');
    }

    return resolve(event);
};