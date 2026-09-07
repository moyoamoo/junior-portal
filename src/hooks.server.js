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
    event.locals.getUser = async () => {
        const {
            data: { user }
        } = await event.locals.supabase.auth.getUser();

        return user;
    };


    //protect routes
    const session = await event.locals.getUser();
    const path = event.url.pathname;

    if (path.startsWith('/booklet') && !session) {
        throw redirect(303, '/');
    }

    if (path.startsWith('/juniors') && !session) {
        throw redirect(303, '/');
    }

    return resolve(event);
};