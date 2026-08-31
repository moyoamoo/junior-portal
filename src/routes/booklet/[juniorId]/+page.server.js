import { supabase } from "$lib/supabaseClient";

//get booklet contents
export async function load({ params }) {

    //get junior from junior id
    const { data: user, error } = await supabase
        .from('Junior')
        .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe')
        .eq('junior_id', params.juniorId)
        .single()

    if (error) {
        console.error(error)
        return { user: null, activities: [] }
    }

    //get activities based on users current stripe
    const { data: activities, err } = await supabase
        .from('Activities')
        .select('activityId:activity_id, stripe, activity, activityType:activity_type, link')
        .eq('stripe', user.currentStripe)

        console.log(activities, "erer")

        console.log(activities)
    if (err) {
        console.error(err)
        return { activities: [] }
    }

    //return junior and booklet 
    return { user, activities: activities ?? [] }
}