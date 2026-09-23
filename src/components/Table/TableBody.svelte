<script>
    import { supabase } from "$lib/supabaseClient";
    import { updateActivity, headings } from "$lib/utils";
    import ActivityRow from "./ActivityRow.svelte";
    import CommentModal from "./CommentModal.svelte";
    import {
        addCommentSupabase,
        deleteCommentSupabase,
        editCommentSupabase,
    } from "$lib/database/comments";

    let {
        activities = $bindable(),
        juniorId,
        theme,
        adminMode,
        onActivitiesChange,
    } = $props();

    let tableActivities = $state(activities);
    let commentText = $state("");

    // modal state
    let showModal = $state(false);
    let selectedActivity = $state(null);

    //sync local state changes with activites from parent
    $effect(() => {
        tableActivities = activities;
    });

    //update local state and notify parent
    const updateTableActivities = (updatedActivities) => {
        tableActivities = updatedActivities;
        onActivitiesChange?.(updatedActivities);
    };

    const updateSelectedActivity = (changes) => {
        updateTableActivities(
            updateActivity(
                tableActivities,
                selectedActivity.activityId,
                changes,
            ),
        );
    };

    //open modal
    const openCommentModal = (activity) => {
        selectedActivity = activity;
        commentText = activity.comment ?? "";
        showModal = true;
    };

    //close modal
    const closeCommentModal = () => {
        showModal = false;
        selectedActivity = null;
    };

    //change date in admin mode
    const handleDateChange = async (activityId, newDateCompleted) => {
        const activity = tableActivities.find(
            (activity) => activity.activityId === activityId,
        );

        if (!activity) {
            return;
        }

        const oldDateCompleted = activity.dateCompleted;

        // toggle the UI immediately
        updateTableActivities(
            updateActivity(tableActivities, activityId, {
                dateCompleted: newDateCompleted,
            }),
        );

        const { error } = await supabase
            .from("CompletedTasks")
            .update({ date_completed: newDateCompleted })
            .eq("junior_id", juniorId)
            .eq("activity_id", activityId);

        // if error revert back
        if (error) {
            console.error("Failed to update date:", error);

            updateTableActivities(
                updateActivity(tableActivities, activityId, {
                    dateCompleted: oldDateCompleted,
                }),
            );
        }
    };

    // toggle completed activity in database
    const handleComplete = async (activityId, newCompleted) => {
        const activity = tableActivities.find(
            (activity) => activity.activityId === activityId,
        );

        if (!activity) {
            return;
        }

        if (!adminMode && activity.completed) {
            return;
        }

        // save current state in case state has to go back
        const oldCompleted = activity.completed;
        const oldDateCompleted = activity.dateCompleted;

        // toggle the UI immediately
        updateTableActivities(
            updateActivity(tableActivities, activityId, {
                completed: newCompleted,
                dateCompleted: newCompleted
                    ? activity.dateCompleted
                    : null,
            }),
        );

        let data;
        let error;

        if (newCompleted) {
            // add completed task to database
            ({ data, error } = await supabase
                .from("CompletedTasks")
                .insert({
                    junior_id: juniorId,
                    activity_id: activity.activityId,
                })
                .select("dateCompleted:date_completed")
                .single());
        } else {
            // delete completed task from database
            ({ error } = await supabase
                .from("CompletedTasks")
                .delete()
                .eq("junior_id", juniorId)
                .eq("activity_id", activity.activityId));
        }

        // if error revert back
        if (error) {
            console.error("Failed to toggle completion:", error);

            updateTableActivities(
                updateActivity(tableActivities, activityId, {
                    completed: oldCompleted,
                    dateCompleted: oldDateCompleted,
                }),
            );

            return;
        }

        // update state with completion date
        if (newCompleted) {
            updateTableActivities(
                updateActivity(tableActivities, activityId, {
                    completed: true,
                    dateCompleted: data.dateCompleted,
                }),
            );
        }
    };

    //add comment to database from modal
    const addComment = async (commentText) => {
        const trimmedComment = commentText.trim();

        if (trimmedComment === "") {
            return;
        }

        try {
            //add comment to database
            const { data, error } = await addCommentSupabase(
                juniorId,
                selectedActivity.activityId,
                trimmedComment,
            );

            //if error revert back
            if (error) {
                console.error("Failed to mark as complete:", error);
                return;
            }

            //update state
            updateSelectedActivity({
                comment: trimmedComment,
            });

            //close modal after added comment
            closeCommentModal();
        } catch (error) {
            console.error("Unexpected error adding comment:", error);
        }
    };

    //edit existing comment in database from modal
    const editComment = async (commentText) => {
        const trimmedComment = commentText.trim();

        if (trimmedComment === "") {
            //delete comment from database
            const { data, error } = await deleteCommentSupabase(
                juniorId,
                selectedActivity.activityId,
            );

            if (error) {
                console.error("Failed to delete comment:", error);
                return;
            }

            // update state
            updateSelectedActivity({
                comment: null,
            });

            closeCommentModal();
            return;
        }

        const { data, error } = await editCommentSupabase(
            juniorId,
            selectedActivity.activityId,
            trimmedComment,
        );

        //if error revert back
        if (error) {
            console.error("Failed to edit comment:", error);
            return;
        }

        //update state
        updateSelectedActivity({
            comment: trimmedComment,
        });

        //close modal after added comment
        closeCommentModal();
    };
</script>

<section class="table-container">
    <table>
        <thead>
            <tr>
                {#each headings as heading}
                    <th scope="col">{heading}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each tableActivities as activity (activity.activityId)}
                <ActivityRow
                    {theme}
                    {activity}
                    {adminMode}
                    onComment={() => openCommentModal(activity)}
                    {handleComplete}
                    {handleDateChange}
                />
            {/each}
        </tbody>
    </table>
</section>

<CommentModal
    bind:showModal
    bind:commentText
    activity={selectedActivity}
    onAdd={addComment}
    onEdit={editComment}
/>

<style>
    .table-container {
        width: 92%;
        margin: 0 auto;
        overflow-x: auto;
    }
    table {
        box-sizing: border-box;
        table-layout: fixed;
        width: 90%;
        margin: 5rem auto 10px;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        background-color: var(--stripe-secondary);
        text-align: center;
        border: 2px solid var(--primary);
        border-radius: 12px;
        box-shadow: 6px 6px 0 var(--primary);
    }

    thead {
        background-color: var(--stripe-primary);
        color: var(--stripe-header-text);
        font-size: 1rem;
    }

    th {
        padding: 0.6em;
    }

    /* =================================
   320px+
   ================================= */

    @media (min-width: 320px) {
        table {
            width: 92%;
            min-width: 600px;
            font-size: 0.8rem;
        }

        th,
        td {
            padding: 0.45em;
        }
    }

    /* =================================
   480px+
   ================================= */

    @media (min-width: 480px) {
        table {
            width: 90%;
            min-width: 650px;

            font-size: 0.85rem;
        }

        th,
        td {
            padding: 0.5em;
        }
    }

    /* =================================
   768px+
   ================================= */

    @media (min-width: 768px) {
        table {
            width: 85%;

            min-width: 0;

            font-size: 0.9rem;
        }

        th,
        td {
            padding: 0.6em;
        }
    }

    /* =================================
   992px+
   ================================= */

    @media (min-width: 992px) {
        table {
            width: 80%;
            font-size: 0.95rem;
        }

        th,
        td {
            padding: 0.65em;
        }
    }

    /* =================================
   1200px+
   ================================= */

    @media (min-width: 1200px) {
        table {
            width: 70%;
            max-width: 850px;
            font-size: 1rem;
        }

        th,
        td {
            padding: 0.7em;
        }
    }
</style>
