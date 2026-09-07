import { redirect } from '@sveltejs/kit'

//reject GET requests
export const load = async () => {
    throw redirect(303, '/');
}

//logout and redirect to /
export const actions = {
    default: async ({ locals }) => {
        await locals.supabase.auth.signOut();
        throw redirect(303, '/');
    }
}  