import { redirect } from '@sveltejs/kit';
import { adminSupabase, verifyAdminToken } from '$lib/server/admin.js';
import { sortAlphabetically } from '$lib/utils';

// The role stored in the profiles table for admin dashboard accounts
const ADMIN_DASHBOARD_ROLE = 'admin_dashboard';

export const load = async ({ locals, cookies, setHeaders }) => {
  // Never cache this page, it contains admin-only data
  setHeaders({
    'Cache-Control': 'no-store'
  });

  // Must have the normal shared user session
  const user = await locals.getUser();

  if (!user) {
    throw redirect(303, '/');
  }

  // Read and verify our own admin session cookie
  const token = cookies.get('admin_session');
  const adminSession = verifyAdminToken(token);

  // Missing, invalid or expired admin session
  if (!adminSession) {
    cookies.delete('admin_session', {
      path: '/'
    });

    throw redirect(303, '/admin');
  }

  // Look up the admin's role with the service client (bypasses RLS)
  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', adminSession.userId)
    .single();

  // No profile, or the account doesn't have the admin dashboard role
  if (profileError || profile?.role !== ADMIN_DASHBOARD_ROLE) {
    cookies.delete('admin_session', {
      path: '/'
    });

    throw redirect(303, '/admin');
  }

  // Get the active juniors, using the normal session so RLS still applies
  let sortedUsers = [];

  try {
    const { data: users, error: juniorsError } = await locals.supabase
      .from('Junior')
      .select(
        'juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe, active, dateCreated:created_at'
      )
      .eq('active', true);

    // Query failed, so show an empty list rather than crashing the page
    if (juniorsError) {
      console.error(juniorsError);

      return {
        admin: true,
        users: []
      };
    }

    sortedUsers = sortAlphabetically(users);
  } catch (err) {
    console.error(err);
  }

  return {
    admin: true,
    users: sortedUsers
  };
};