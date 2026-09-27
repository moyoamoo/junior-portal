<script>
    let { value = $bindable("") } = $props();

    const activeOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];
</script>

<select bind:value class="junior-active-select">
    <option value="">All Juniors</option>

    {#each activeOptions as option}
        <option value={option.value}>
            {option.label}
        </option>
    {/each}
</select>

<style>
    .junior-active-select {
        padding: 0.7rem;
        background-color: var(--secondary);
        font-size: 1rem;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
        width: 100%;
        margin-bottom: 1rem;
    }

    .junior-active-select:focus,
    .junior-active-select:hover {
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }
</style>
