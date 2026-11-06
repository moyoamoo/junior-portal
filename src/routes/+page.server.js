import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/server/login.js';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, locals }) => {

        // Get information from +page.svelte form
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');


        // Check if email and password are provided
        if (!email || !password) {
            return fail(400, {
                message: 'Please enter a username and password',
                email
            });
        }

        // Attempt to get user profile from supabase
        const result = await login(locals.supabase, email.toString(), password.toString());
        
        if (!result.success) {
            return fail(400, {
                message: result.message,
                email
            });
        }
        
        //direct to juniors page
        throw redirect(303, '/juniors');

    }
};