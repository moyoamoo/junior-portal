import { supabase } from "$lib/supabaseClient";
import { getTheme } from '$lib/themes'

//get booklet contents
export async function load({ params }) {

    //get junior from junior id
    const { data: user, error: userError } = await supabase
        .from('Junior')
        .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe')
        .eq('junior_id', params.juniorId)
        .single()



    //return empty object if error
    if (userError) {
        console.error(userError)
        return { user: null, activities: [], theme: null }
    }

    //get theme based on the junior's current stripe
    const theme = getTheme(user.currentStripe);

    //get activities based on users current stripe
    const { data: activities, error: activitiesError } = await supabase
        .from('Activities')
        .select('activityId:activity_id, stripe, activity, activityType:activity_type, link')
        .eq('stripe', user.currentStripe)

    //return empty object if error
    if (activitiesError) {
        console.error(activitiesError)
        return { user, activities: [], theme }
    }

    //get junior completed tasks
    const { data: completedTasks, error: completedError } = await supabase
        .from('CompletedTasks')
        .select('activityId:activity_id, dateCompleted:date_completed')
        .eq('junior_id', params.juniorId)

    if (completedError) {
        console.error(completedError)
    }

    //lookup map: activityId -> dateCompleted
    const completedMap = new Map(
        (completedTasks || []).map(task => [task.activityId, task.dateCompleted])
    );

    //change actitivies to have completed tasks and date
    const updatedActivities = (activities || []).map(activity => {
        const isCompleted = completedMap.has(activity.activityId);
        return {
            ...activity,
            completed: isCompleted,
            dateCompleted: isCompleted ? completedMap.get(activity.activityId) : ""
        };
    });



    return { user, activities: updatedActivities, theme }
}