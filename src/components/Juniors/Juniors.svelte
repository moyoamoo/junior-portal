<script>
    import JuniorImage from "./JuniorImage.svelte";
    let { users } = $props();
    let search = $state("");
    let selectedStripe = $state("");

    //filter users by what is in text input
    let foundJuniors = $derived(
        users.filter((junior) => {
            let juniorName = junior.firstName + " " + junior.lastName;
            let stripeMatch = false;
            let nameMatch = juniorName
                .toLowerCase()
                .replaceAll(" ", "")
                .includes(search.replaceAll(" ", ""));

            if (selectedStripe === "") {
                stripeMatch = true;
            } else if (junior.currentStripe.toLowerCase() === selectedStripe) {
                stripeMatch = true;
            }

            return nameMatch && stripeMatch;
        }),
    );
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
            bind:value={() => search, (s) => (search = s.toLowerCase())}
        />
    </div>
    <div class="junior-sort-container">
        <label for="sort-by-stripe">Sort by Stripe</label>
        <select
            name="sort-by-stripe"
            id="sort-by-stripe"
            bind:value={selectedStripe}
        >
            <option value="">Choose a Stripe</option>
            <option value="bumblebee">Bumblebee</option>
            <option value="chipmunk">Chipmunk</option>
            <option value="wildcat">Wildcat</option>
            <option value="clownfish">Clownfish</option>
            <option value="skunk">Skunk</option>
            <option value="zebra">Zebra</option>
            <option value="tiger">Tiger</option>
        </select>
    </div>
</section>

<section class="junior-container">
    {#if foundJuniors.length == 0}
        <div>
            <p>No Juniors found</p>
        </div>
    {:else}
        {#each foundJuniors as user (user.juniorId)}
            <a href="/booklet/{user.juniorId}" class="junior-link">
                <JuniorImage currentStripe={user.currentStripe} />
                {user.firstName}
                {user.lastName}
            </a>
        {/each}
    {/if}
</section>
