<script>
    let { comment, onclick } = $props();
</script>

<td
    >{#if comment}
        <button {onclick}>View</button>
    {:else}
        <button {onclick}>Add</button>
    {/if}
</td>
