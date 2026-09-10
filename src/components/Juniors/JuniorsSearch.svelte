<script>
    import logo from "$lib/assets/codeninjas.png";
    import AddButton from "./AddButton.svelte";
    import JuniorImage from "./JuniorImage.svelte";
    import Juniors from "./Juniors.svelte";

    let { users, adminMode } = $props();
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
    <img src={logo} alt="code ninjas endinburgh logo" class="logo" />

    <div class="junior-sort-container">
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

    {#if adminMode}
        <AddButton />
    {/if}
</section>

<Juniors {foundJuniors} />

<style>
    .logo {
        width: 60%;
        margin: 1rem auto;
    }

    /*entire top section*/
    .search-sort-section {
        border: 2px solid var(--primary);
        background-color: var(--tertiary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        width: 80%;
        min-height: 10vh;
        margin: 2.5rem auto 2.5rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    label {
        margin-bottom: 0.2rem;
    }

    .junior-search-container,
    .junior-sort-container {
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }

    .junior-searchbar,
    .junior-stripe-select {
        padding: 0.7rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
    }

    .junior-stripe-select:focus {
        box-shadow: 4px 4px 0px var(--primary);
    }

    /* =================================
   320px+
   ================================= */

    /* =================================
   480px+
   ================================= */

    /* =================================
   768px+
   ================================= */
    .logo {
        width: 40%;
        margin: 1rem auto;
    }

    .junior-search-container,
    .junior-sort-container {
        width: 60%;
        margin: 0 auto;
    }

    .search-sort-section {
        width: 60%;
        padding-bottom: 1rem;
    }
    /* =================================
   992px+
   ================================= */

    /* =================================
   1200px+
   ================================= */

    .search-sort-section {
        max-width: 800px;
        padding-bottom: 1rem;
    }
</style>
