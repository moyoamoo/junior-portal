import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ supabase, request, locals }) => {

        // Get information from +page.svelte form
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');


        //if no email/password send message
        if (!email || !password) {
            return fail(400, {
                message: 'Please enter a username and password',
                email
            });
        }

        // Sign in with supabase auth 
        const { data, error } = await locals.supabase.auth.signInWithPassword({
            email: email.toString(),
            password: password.toString()
        });

        // Return error message if login is incorrect 
        if (error) {
            return fail(400, {
                message: 'Email or password is incorrect',
                email
            });
        }

        // Get user profile from profiles table
        const { data: profile, error: profileError } = await locals.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        // If no profile or error, send message 
        if (profileError || !profile) {
            return fail(500, {
                message: 'Could not load acccount - try again!',
                email
            });
        }

        //direct to juniors page
        throw redirect(303, '/juniors');

    }
};