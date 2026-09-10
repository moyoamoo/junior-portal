<script>
    let { form } = $props();
</script>

{#if form?.message}
    <p>{form.message}</p>
{/if}