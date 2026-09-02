<script>
    import TableHeader from "./TableHeader.svelte";
    import TableBody from "./TableBody.svelte";
    import { formatDate } from '$lib/utils'

    let { activity } = $props();
    let date = $state("");

    $effect(() => {
        if (activity.dateCompleted != "") {
            date = formatDate(activity.dateCompleted)
        }
        console.log(date);
    });
</script>

<td>
    <time datetime="">{date}</time>
</td>
