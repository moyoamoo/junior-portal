import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const supabase = locals.supabase;

        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            return fail(400, {
                message: 'Please enter a username and password',
                email
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toString(),
            password: password.toString()
        });

        //return error message if login is incorrect 
        if (error) {
            return fail(400, {
                message: 'Email or password is incorrect',
                email
            });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError || !profile) {
            return fail(500, {
                message: 'Could not load acccount - try again!',
                email
            });
        }

        if (profile.role === 'admin') {
            throw redirect(303, '/admin');
        } else {
            throw redirect(303, '/juniors');
        }
    }
};