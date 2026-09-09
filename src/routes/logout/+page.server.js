import { redirect } from '@sveltejs/kit'

//reject GET requests
export const load = async () => {
    throw redirect(303, '/');
}

//logout and redirect to /
export const actions = {
    default: async ({ locals }) => {

        //logout of junior application
        await locals.supabase.auth.signOut();

        //delete admin cookie 
         cookies.delete('admin_session', {
            path: '/admin/dashboard'
        });

        //return to main login
        throw redirect(303, '/');
    }
}  