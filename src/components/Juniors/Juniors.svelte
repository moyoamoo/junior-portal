<script>
    import JuniorImage from "./JuniorImage.svelte";
    let { users } = $props();
    let search = $state("");
    let sortStripe = $state("");

    //filter users by what is in text input
    let foundJuniors = $derived(
        users.filter((junior) => {
            let juniorName = junior.firstName + " " + junior.lastName;

            if (sortStripe != "") {
                if (junior.currentStripe.toLowerCase() == sortStripe) {
                    return juniorName
                        .toLowerCase()
                        .replaceAll(" ", "")
                        .includes(search.replaceAll(" ", ""));
                }
            } else {
                return juniorName
                    .toLowerCase()
                    .replaceAll(" ", "")
                    .includes(search.replaceAll(" ", ""));
            }
        }),
    );

    const sortByStripe = () => {
        let newUsers = [...users];
        newUsers.sort((a, b) => {
            if (a.currentStripe > b.currentStripe) {
                return 1;
            } else if (a.currentStripe < b.currentStripe) {
                return -1;
            }
        });

        users = newUsers;
    };
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
            bind:value={sortStripe}
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
