<script>
    import { supabase } from "$lib/supabaseClient";

    let { activity, juniorId } = $props();

    let isChecked = $state(activity ? activity.completed : false);

    $effect(() => {
        if (activity) {
            isChecked = activity.completed ?? false;
        }
    });

    async function handleChange() {
        console.log(activity.completed)
        let newValue = isChecked
        let oldValue = !newValue;

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
                isChecked = oldValue;
            }
        }
    }
</script>

<td class="completed">
    <label class="container">
        <input type="checkbox" bind:checked={isChecked} onchange={handleChange} />
        <div class="checkmark"></div>
    </label>
</td>
