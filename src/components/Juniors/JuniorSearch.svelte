<script>
    import AddButton from "./AddButton.svelte";
    import StripeSelect from "./StripeSelect.svelte";
    import ActiveSelect from "./ActiveSelect.svelte";

    let {
        search = $bindable(""),
        selectedStripe = $bindable(""),
        selectedActive = $bindable(""),
        adminMode,
        onAdd,
    } = $props();
</script>

<div class="junior-sort-container">
    <label for="sort-by-stripe"> Sort by Stripe </label>

    <StripeSelect bind:value={selectedStripe} />
</div>

<div class="junior-search-container">
    <label for="searchbar"> Search Juniors </label>

    <input
        id="searchbar"
        type="text"
        placeholder="Search Juniors"
        bind:value={search}
        class="junior-searchbar"
    />
</div>

{#if adminMode}
    <div class="junior-sort-container">
        <label for="sort-by-active">Sort by Status</label>

        <ActiveSelect bind:value={selectedActive} />
    </div>
    <AddButton onclick={onAdd} />
{/if}

<style>
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: var(--primary);
    }

    .junior-search-container,
    .junior-sort-container {
        width: 60%;
        margin: 0 auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    .junior-searchbar {
        padding: 0.7rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
    }

    .junior-searchbar:focus,
    .junior-searchbar:hover {
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }
</style>
