<script>
    import { formatDate } from "$lib/utils";

    let { activity, adminMode, onDateChange } = $props();

    let date = $derived(
        activity.dateCompleted ? formatDate(activity.dateCompleted) : "",
    );

    let inputValue = $derived(
        activity.dateCompleted ? activity.dateCompleted.split("T")[0] : "",
    );

    const canEditDate = $derived(adminMode && activity.completed);

    const handleChange = (e) => {
        const newDatePart = e.target.value; // "YYYY-MM-DD" or ""

        if (!newDatePart) {
            onDateChange(activity.activityId, null);
            return;
        }

        const oldTimePart = activity.dateCompleted
            ? activity.dateCompleted.split("T")[1]
            : "00:00:00.000000+00:00";

        onDateChange(activity.activityId, `${newDatePart}T${oldTimePart}`);
    };
</script>

<td>
    {#if canEditDate}
        <input type="date" value={inputValue} onchange={handleChange} />
    {:else if date}
        <time datetime={activity.dateCompleted}>{date}</time>
    {/if}
</td>
