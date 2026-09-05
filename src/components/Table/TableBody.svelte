<script>
    import { supabase } from "$lib/supabaseClient";
    import Checkbox from "./Checkbox.svelte";
    import Date from "./Date.svelte";
    import CommentBtn from "./CommentBtn.svelte";
    import CommentModal from "./CommentModal.svelte";
    import { updateActivity, headings } from "$lib/utils";

    let { activities = $bindable(), juniorId, theme } = $props();

    let tableActivities = $state(activities);
    let commentText = $state("");

    // modal state
    let showModal = $state(false);
    let selectedActivity = $state(null);

    //sync local state changes with activites from parent
    $effect(() => {
        tableActivities = activities;
    });

    function openCommentModal(activity) {
        selectedActivity = activity;
        commentText = activity.comment ?? "";
        showModal = true;
    }

    function closeCommentModal() {
        showModal = false;
        selectedActivity = null;
    }

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
                <tr>
                    <th scope="row">{activity.activity}</th>

                    <td>{activity.activityType}</td>
                    <CommentBtn
                        comment={activity.comment}
                        onclick={() => openCommentModal(activity)}
                    />

                    <Date {activity} />

                    <Checkbox
                        {activity}
                        {theme}
                        onComplete={() => handleComplete(activity.activityId)}
                    />
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<CommentModal bind:showModal>
    <textarea
        class="modal-textarea"
        bind:value={commentText}
        placeholder="Write a comment..."
    >
    </textarea>
    <button class="modal-btn">Save</button>
</CommentModal>

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

    tbody tr:hover {
        color: var(--stripe-hover);
    }

    tbody tr:nth-child(even) {
        background-color: var(--stripe-tertiary);
    }

    .modal-textarea {
        height: 70%;
        width: 10rem;
        border: 2px solid var(--primary);
        margin-bottom: 1rem;
        padding: 1rem;
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
        width: 10rem;
        border: 2px solid var(--primary);
        height: 3rem;
        background-color: var(--stripe-primary);
        color: var(--secondary);
        font-weight: bold;
        font-family: "Comfortaa", sans-serif;
    }

    .modal-btn:hover,
    .modal-btn:focus {
        box-shadow: 4px 4px 0px var(--primary);
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
            width: 80%;
            max-width: 1400px;
            font-size: 1rem;
        }

        th,
        td {
            padding: 0.7em;
        }
    }
</style>
