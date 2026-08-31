<script>
    import TableHeader from "./TableHeader.svelte";
    import TableBody from "./TableBody.svelte";

    let { activities } = $props();
</script>

<table>
    <TableHeader/>
    <TableBody {activities}/>
</table>