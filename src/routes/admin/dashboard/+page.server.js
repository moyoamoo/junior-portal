import { redirect } from '@sveltejs/kit';

import {
    adminSupabase,
    verifyAdminToken
} from '$lib/server/admin.js';


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


    return {
        admin: true
    };
};