<script>
    let { value = $bindable("") } = $props();

    const stripes = [
        "Bumblebee",
        "Chipmunk",
        "Wildcat",
        "Clownfish",
        "Skunk",
        "Zebra",
    ];
</script>

<select bind:value class="junior-stripe-select">
    <option value="">Choose a Stripe</option>

    {#each stripes as stripe}
        <option value={stripe}>
            {stripe}
        </option>
    {/each}
</select>

<style>
    .junior-stripe-select {
        padding: 0.7rem;
        background-color: var(--secondary);
        font-size: 1rem;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
    }

    .junior-stripe-select:focus,
    .junior-stripe-select:hover {
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }
</style>
