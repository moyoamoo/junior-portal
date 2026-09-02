<script>
    let { users } = $props();
</script>

<section class="search-sort-section">
    <div class="junior-search-container">
        <label for="searchbar">Search Juniors</label>
        <input type="text" placeholder="Search Juniors" id="searchbar" name="searchbar" class="junior-searchbar"/>
    </div>
    <div class="junior-sort-container">
        <button>Sort A-Z</button>
        <button>Sort by Stripe</button>
    </div>
</section>

<section class="main-junior-section">
    <ul class="junior-link-group">
        {#each users as user (user.juniorId)}
            <a href="/booklet/{user.juniorId}" class="junior-link">
                <li>
                    {user.firstName}
                    {user.lastName} - {user.currentStripe} Stripe
                </li>
            </a>
        {/each}
    </ul>
</section>
