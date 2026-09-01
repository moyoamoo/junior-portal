import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const supabase = locals.supabase;
        
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            return fail(400, { 
                message: 'Please fill in all fields', 
                email 
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toString(),
            password: password.toString()
        });

        if (error) {
            return fail(400, { 
                message: error.message, 
                email 
            });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            return fail(500, { 
                message: 'Profile not found', 
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