<script>
    let { comment } = $props();
</script>

<td>{#if comment}
    <span>{comment}</span>
    {/if}
</td>
