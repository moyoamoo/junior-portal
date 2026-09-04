<script>
    import JuniorImage from "./JuniorImage.svelte";
    let { users } = $props();

    function sortAlphabetically() {
        let newUsers = [...users];
        newUsers.sort((a, b) => {
            if (a.firstName > b.firstName) {
                return 1;
            } else if (a.firstName < b.firstName) {
                return -1;
            }
        });

        users = newUsers;
    }

    function sortByStripe(e) {
        let newUsers = [...users];
        newUsers.sort((a, b) => {
            if (a.currentStripe > b.currentStripe) {
                return 1;
            } else if (a.currentStripe < b.currentStripe) {
                return -1;
            }
        });

             users = newUsers;
    }
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
        <button onclick={sortAlphabetically}>Sort A-Z</button>
        <button onclick={sortByStripe}>Sort by Stripe</button>
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
