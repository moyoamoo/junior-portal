import { redirect } from '@sveltejs/kit'
//reject GET requests
export const load = async () => {
    throw redirect(303, '/');
}

//logout and redirect to /
/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ locals, cookies }) => {

        //logout of junior application
        await locals.supabase.auth.signOut();

        //delete admin cookie 
         cookies.delete('admin_mode_session', {
            path: '/'
        });

        //return to main login
        throw redirect(303, '/');
    }
}  