<script>
    import AdminJuniors from "./AdminJuniors.svelte";

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

<section>
    <div>
        <label for="sort-by-stripe" class="sort-by-stripe-label"
            >Sort by Stripe</label
        >
        <select
            name="sort-by-stripe"
            id="sort-by-stripe"
            class="junior-stripe-select"
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
</section>

<AdminJuniors {users} />
