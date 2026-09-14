<script>
    import { supabase } from "$lib/supabaseClient";
    import Checkbox from "./Checkbox.svelte";
    import Date from "./Date.svelte";
    import CommentBtn from "./CommentBtn.svelte";
    import Modal from "../Modal.svelte";
    import { updateActivity, headings } from "$lib/utils";
    import ActivityRow from "./ActivityRow.svelte";

    let { activities = $bindable(), juniorId, theme, adminMode } = $props();

    let tableActivities = $state(activities);
    let commentText = $state("");

    // modal state
    let showModal = $state(false);
    let selectedActivity = $state(null);

    //sync local state changes with activites from parent
    $effect(() => {
        tableActivities = activities;
    });

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

  // toggle completed activity in database
    const handleComplete = async (activityId, newCompleted) => {
        console.log(adminMode)
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
        tableActivities = updateActivity(tableActivities, activityId, {
            completed: newCompleted,
            dateCompleted: newCompleted ? activity.dateCompleted : null,
        });

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

            tableActivities = updateActivity(tableActivities, activityId, {
                completed: oldCompleted,
                dateCompleted: oldDateCompleted,
            });

            return;
        }

        // update state with completion date
        if (newCompleted) {
            tableActivities = updateActivity(tableActivities, activityId, {
                completed: true,
                dateCompleted: data.dateCompleted,
            });
        }
    };

    //add comment to database from modal
    const addComment = async (commentText) => {
        const trimmedComment = commentText.trim();

        if (trimmedComment === "") {
            return;
        }

        const { data, error } = await supabase
            .from("TaskComments")
            .insert({
                junior_id: juniorId,
                activity_id: selectedActivity.activityId,
                comment: trimmedComment,
            })
            .select()
            .single();

        //if error revert back
        if (error) {
            console.error("Failed to mark as complete:", error);
            return;
        }

        console.log("COMMENT ACTUALLY SAVED:", data);

        //update state
        tableActivities = updateActivity(
            tableActivities,
            selectedActivity.activityId,
            {
                comment: trimmedComment,
            },
        );

        //close modal after added comment
        closeCommentModal();
    };

    //edit existing comment in database from modal
    const editComment = async (commentText) => {
        const trimmedComment = commentText.trim();

        if (trimmedComment === "") {


            const { data, error } = await supabase
                .from("TaskComments")
                .delete()
                .eq("activity_id", selectedActivity.activityId)
                .eq("junior_id", juniorId)
                .select()
        
            if (error) {
                console.error("Failed to delete comment:", error);
                return;
            }

            //update state
            tableActivities = updateActivity(
                tableActivities,
                selectedActivity.activityId,
                { comment: null },
            );

            closeCommentModal();
            return;
        }

        const { data, error } = await supabase
            .from("TaskComments")
            .update({
                comment: trimmedComment,
            })
            .eq("activity_id", selectedActivity.activityId)
            .eq("junior_id", juniorId)
            .select()
            .single();

        //if error revert back
        if (error) {
            console.error("Failed to edit comment:", error);
            return;
        }


        //update state
        tableActivities = updateActivity(
            tableActivities,
            selectedActivity.activityId,
            {
                comment: trimmedComment,
            },
        );

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
                />
            {/each}
        </tbody>
    </table>
</section>

<Modal bind:showModal>
    <textarea
        class="modal-textarea"
        bind:value={commentText}
        placeholder="Write a comment..."
    >
    </textarea>
    {#if selectedActivity?.comment == null || selectedActivity?.comment === ""}
        <button
            class="modal-btn"
            onclick={() => {
                addComment(commentText);
            }}>Add</button
        >
    {:else}
        <button
            class="modal-btn"
            onclick={() => {
                editComment(commentText);
            }}>Save</button
        >
    {/if}
</Modal>

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
        margin: 2.5rem auto 10px;
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

    .modal-textarea {
        height: 70%;
        width: 20rem;
        border: 2px solid var(--primary);
        margin-bottom: 1rem;
        padding: 1rem;
             border-radius: 6px;
    }

    .modal-textarea:hover,
    .modal-textarea:focus {
        box-shadow: 4px 4px 0px var(--primary);
    }

    /* .modal-textarea:focus-visible{
        outline: 2px solid var(--stripe-primary);
    }
    */
    .modal-btn {
       background-color: var(--stripe-primary);
        color: var(--secondary);
        outline: none;
         border: 2px solid var(--primary);
        font-size: 1rem;
        font-family: "Comfortaa", sans-serif;
        cursor: pointer;
        width: 80%;
        height: 40px;
        border-radius: 6px;
    }

    .modal-btn:hover,
    .modal-btn:focus {
        box-shadow: 4px 4px 0px var(--primary);
        background-color: var(--stripe-hover);
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
