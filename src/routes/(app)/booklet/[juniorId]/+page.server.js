import { supabase } from "$lib/supabaseClient";
import { getTheme } from '$lib/themes'
import { normaliseStripeName } from "$lib/utils.js";


export const load = async ({ params, locals, url }) => {

    // Get junior from ID in utl 
    const { data: junior, error: juniorError } = await locals.supabase
        .from('Junior')
        .select('juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe')
        .eq('junior_id', params.juniorId)
        .single();

    // Return empty if junior cannot be found 
    if (juniorError) {
        console.error(juniorError);
        return { user: null, activities: [], stripes: [] };
    }

    // Get all stripes from database
    const { data: allStripes, error: allStripesError } = await locals.supabase
        .from('stripes')
        .select('stripeName:stripe_name, stripeOrder:stripe_order')
        .order('stripe_order');

    // If stripes cannot be found return empty 
    if (allStripesError) {
        console.error(allStripesError);
        return { user: junior, activities: [], stripes: [] };
    }

    // If stripes cannot be found return empty 
    if (!allStripes || allStripes.length === 0) {
        console.error('No stripes found in the stripes table');
        return { user: junior, activities: [], stripes: [] };
    }

    // Match the text in Junior.current_stripe to a row in the stripes table
    let currentStripe = allStripes.find((stripe) => {
        return normaliseStripeName(stripe.stripeName) === normaliseStripeName(junior.currentStripe);
    });

    // If the junior's current_stripe doesn't match any stripe, fall back to the first one
    if (!currentStripe) {
        currentStripe = allStripes[0];
    }


    // Read the ?stripe= value from the URL (null if it isn't there)
    const requestedStripeName = url.searchParams.get('stripe');

    // Look the requested name up in the stripes table 
    const requestedStripe = allStripes.find((stripe) => {
        return normaliseStripeName(stripe.stripeName) === normaliseStripeName(requestedStripeName);
    });

    // Default to the current stripe
    let stripeBeingViewed = currentStripe;

    if (requestedStripe && requestedStripe.stripeOrder <= currentStripe.stripeOrder) {
        stripeBeingViewed = requestedStripe;
    }


    // Get activities based on stripe 
    const { data: activitiesData, error: activitiesError } = await locals.supabase
        .from('Activities')
        .select('activityId:activity_id, stripe, activity, activityType:activity_type, link')
        .ilike('stripe', stripeBeingViewed.stripeName);

    if (activitiesError) {
        console.error(activitiesError);
    }

    // If activities are not found, empty 
    const stripeActivities = activitiesData || [];

    const stripeActivityIds = stripeActivities.map((activity) => {
        return activity.activityId;
    });


    // Get juniors completed tasks from databse 
    const { data: completedTasksData, error: completedTasksError } = await locals.supabase
        .from('CompletedTasks')
        .select('activityId:activity_id, dateCompleted:date_completed')
        .eq('junior_id', params.juniorId)
        .in('activity_id', stripeActivityIds);

    if (completedTasksError) {
        console.error(completedTasksError);
    }

    const completedTasks = completedTasksData || [];


    // Get juniors comments 
    const { data: commentsData, error: commentsError } = await locals.supabase
        .from('TaskComments')
        .select('activityId:activity_id, comment')
        .eq('junior_id', params.juniorId)
        .in('activity_id', stripeActivityIds);

    if (commentsError) {
        console.error(commentsError);
    }

    const taskComments = commentsData || [];


    //look up map 
    const completedDateByActivityId = new Map();
    for (const task of completedTasks) {
        completedDateByActivityId.set(task.activityId, task.dateCompleted);
    }

    // Map of activityId -> the junior's comment on that activity
    const commentByActivityId = new Map();
    for (const taskComment of taskComments) {
        commentByActivityId.set(taskComment.activityId, taskComment.comment);
    }



    const activitiesWithProgress = stripeActivities.map((activity) => {

        const isCompleted = completedDateByActivityId.has(activity.activityId);


        let dateCompleted = '';
        if (isCompleted) {
            dateCompleted = completedDateByActivityId.get(activity.activityId);
        }


        let comment = null;
        if (commentByActivityId.has(activity.activityId)) {
            comment = commentByActivityId.get(activity.activityId);
        }

        return {
            ...activity,
            completed: isCompleted,
            dateCompleted: dateCompleted,
            comment: comment
        };
    });


    return {
        user: junior,
        activities: activitiesWithProgress,
        stripes: allStripes,
        currentStripe: currentStripe.stripeName,
        viewingStripe: stripeBeingViewed.stripeName,
        isCurrentStripe: stripeBeingViewed.stripeName === currentStripe.stripeName,
        theme: getTheme(stripeBeingViewed.stripeName)
    };
}