import { redirect } from '@sveltejs/kit';

import {
    adminSupabase,
    verifyAdminToken
} from '$lib/server/admin.js';
import { sortAlphabetically } from "$lib/utils";



export const load = async ({ locals, cookies, setHeaders }) => {


    setHeaders({
        'Cache-Control': 'no-store'
    });

    // Must have normal user session
    const user = await locals.getUser();

    if (!user) {
        throw redirect(303, '/');
    }


    // Get admin session
    const token = cookies.get('admin_session');

    const adminSession = verifyAdminToken(token);


    if (!adminSession) {

        cookies.delete('admin_session', {
            path: '/admin/dashboard'
        });

        throw redirect(303, '/admin');
    }

    let sortedUsers = []

    // Find admin in database
    const { data: profile, error } =
        await adminSupabase
            .from('profiles')
            .select('role')
            .eq('id', adminSession.userId)
            .single();


    if (error || profile?.role !== 'admin') {

        cookies.delete('admin_session', {
            path: '/admin/dashboard'
        });

        throw redirect(303, '/admin');
    }
    //get juniors 
    try {
        const { data: users, error } = await locals.supabase
            .from('Junior')
            .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe, active, dateCreated:created_at')
            .eq('active', true)

        if (error) {
            console.error(error)
            return { users: [] }
        }

        sortedUsers = sortAlphabetically(users);


    } catch (error) {
        console.log(error)
    }


    return {
        admin: true,
        users: sortedUsers
    };
};