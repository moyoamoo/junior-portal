import { supabase } from "$lib/supabaseClient";
import { sortAlphabetically } from "$lib/utils";


//get juniors data from supabase 
export async function load({locals}) {

    try {
        const { data: users, error } = await locals.supabase
            .from('Junior')
            .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe, active')
            .eq('active', true)

        if (error) {
            console.error(error)
            return { users: [] }
        }

        let sortedUsers = sortAlphabetically(users);

        return { users: sortedUsers}

    } catch (error) {
        console.log(error)
    }

}