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

    //get user 
    event.locals.getUser = async () => {
        const {
            data: { user }
        } = await event.locals.supabase.auth.getUser();

        return user;
    };

    const user = await event.locals.getUser();
    const path = event.url.pathname;

    
    //redirect if not logged in as admin
    if (pathname.startsWith('/admin/dashboard')) {
        const adminSession = event.cookies.get('admin_session');

        if (!adminSession) {
            throw redirect(303, '/admin')
        }
    }

    //if not on admin page delete admin session
    if (!pathname.startsWith('/admin/dashboard')) {
        event.cookies.delete('admin_session', {
            path: '/'
        });

    }

    //redirect if not logged in
    if (path.startsWith('/booklet') && !user) {
        throw redirect(303, '/');
    }

    if (path.startsWith('/juniors') && !user) {
        throw redirect(303, '/');
    }


    return resolve(event);
}