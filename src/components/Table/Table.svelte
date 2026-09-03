<script>
    import TableHeader from "./TableHeader.svelte";
    import TableBody from "./TableBody.svelte";

    let { activities, juniorId, theme} = $props();
 
    
</script>

<table>
    <TableHeader />
    <TableBody bind:activities {juniorId} {theme}/>
</table>
