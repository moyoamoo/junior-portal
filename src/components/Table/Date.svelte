<script>
   
    import { formatDate } from "$lib/utils";

    let { activity } = $props();

    let date = $derived(
        activity.dateCompleted ? formatDate(activity.dateCompleted) : "",
    );
</script>

<td>
    {#if date}
        <time datetime={activity.dateCompleted}>{date}</time>
    {/if}
</td>
