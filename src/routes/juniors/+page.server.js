import { supabase } from "$lib/supabaseClient";


//get juniors data from supabase 
export async function load() {

    try {
        const { data: users, error } = await supabase
            .from('Junior')
            .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe, active')
            .eq('active', true)

        if (error) {
            console.error(error)
            return { users: [] }
        }

        console.log(users)
        return { users }
    } catch (error) {
        console.log(error)
    }

}