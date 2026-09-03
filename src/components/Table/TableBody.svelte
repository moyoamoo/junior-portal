<script>
    import { supabase } from "$lib/supabaseClient";
    import Checkbox from "./Checkbox.svelte";
    import Date from "./Date.svelte";
    import Comments from "./Comments.svelte";
    import { updateActivity } from "$lib/utils";

    let { activities = $bindable(), juniorId, theme } = $props();

    let tableActivities = $state(activities);

    //sync local state changes with activites from parent
    $effect(() => {
        tableActivities = activities;
    });

    async function handleComplete(activityId) {
        const activity = tableActivities.find(
            (activity) => activity.activityId === activityId,
        );

        if (!activity) {
            return;
        }

        //save current state in case state has to go back
        const oldCompleted = activity.completed;
        const oldDateCompleted = activity.dateCompleted;

        tableActivities = updateActivity(tableActivities, activityId, {
            completed: true,
        });

        //add to completed task from table in database
        const { data, error } = await supabase
            .from("CompletedTasks")
            .insert({
                junior_id: juniorId,
                activity_id: activity.activityId,
            })
            .select("dateCompleted:date_completed")
            .single();
        
        
        if (error) {
            console.error("Failed to mark as complete:", error);

            tableActivities = updateActivity(tableActivities, activityId, {
                completed: oldCompleted,
                dateCompleted: oldDateCompleted,
            });

            return;
        }

        tableActivities = updateActivity(tableActivities, activityId, {
            completed: true,
            dateCompleted: data.dateCompleted,
        });
    }
</script>

<tbody>
    {#each tableActivities as activity (activity.activityId)}
        <tr>
            <th scope="row">{activity.activity}</th>
            <td>{activity.activityType}</td>
            <Date {activity} />
            <Checkbox
                {activity}
                {theme}
                onComplete={() => handleComplete(activity.activityId)}
            />
            <Comments comment={activity.comment}/>
        </tr>
    {/each}
</tbody>
