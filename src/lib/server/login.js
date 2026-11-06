/**
 * Authenticate a user with Supabase
 * 
 * @param {{
 *   auth: {
 *     signInWithPassword: Function
 *   },
 *   from: Function
 * }} supabase
 * @param {string} email
 * @param {string} password
 */

export const  login = async (supabase, email, password) => {

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return {
            success: false,
            message: 'Email or password is incorrect'
        };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profile) {
        return {
            success: false,
            message: 'Could not access account - try again!'
        };
    }

    return {
        success: true,
        profile
    };
}