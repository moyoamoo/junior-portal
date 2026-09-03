<script>
    import JuniorImage from "./JuniorImage.svelte";
    let { users } = $props();
</script>

<section class="search-sort-section">
    <div class="junior-search-container">
        <label class="junior-search-label" for="searchbar">Search Juniors</label
        >
        <input
            type="text"
            placeholder="Search Juniors"
            id="searchbar"
            name="searchbar"
            class="junior-searchbar"
        />
    </div>
    <div class="junior-sort-container">
        <button>Sort A-Z</button>
        <button>Sort by Stripe</button>
    </div>
</section>

<section class="junior-container">
    {#each users as user (user.juniorId)}
      
            <a href="/booklet/{user.juniorId}" class="junior-link">
                <JuniorImage currentStripe={user.currentStripe} />
                {user.firstName}
                {user.lastName}
            </a>
        
    {/each}
</section>
