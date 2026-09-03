<script>
    let { comment, onclick } = $props();

</script>

<td
    >{#if comment}
        <button onclick={onclick}>View</button>
    {:else}
        <button onclick={onclick}>Add</button>
    {/if}
</td>
 