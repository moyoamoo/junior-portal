<script>
    import { supabase } from "$lib/supabaseClient";

    let { activity, juniorId } = $props();
    let isChecked = $state(false);

    async function handleChange() {
        const isCurrentlyCompleted = isChecked;
        const newValue = !isCurrentlyCompleted;

        isChecked = newValue;

        if (newValue) {
            //add to completed tasks table in database
            const { error } = await supabase.from("CompletedTasks").insert({
                junior_id: juniorId,
                activity_id: activity.activityId,
            });

            //change state back incase of error
            if (error) {
                console.error("Failed to mark as complete:".error);
                isChecked = isCurrentlyCompleted;
            }
        } else {
            //delete from completed tasks table in database
            const { err } = await supabase
                .from("CompletedTasks")
                .delete()
                .eq("junior_id", juniorId)
                .eq("activity_id", activity.activityId);

            //change state back incase of error
            if (err) {
                console.error("Failed to mark as complete:".error);
                isChecked = isCurrentlyCompleted;
            }
        }
    }
</script>

<td class="completed">
    <label class="container">
        <input type="checkbox" checked={isChecked} onchange={handleChange} />
        <div class="checkmark"></div>
    </label>
</td>
