<script>
    import logo from "$lib/assets/codeninjas.png";
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
</section>

<section class="junior-container">
    <div class="junior-containter-list">
        {#if foundJuniors.length == 0}
            <p>No Juniors found</p>
        {:else}
            {#each foundJuniors as user (user.juniorId)}
                <a href="/booklet/{user.juniorId}" class="junior-link">
                    {user.firstName}
                    {user.lastName}
                </a>
            {/each}
        {/if}
    </div>
</section>

<style>
    .logo {
        width: 50%;
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

    .sort-by-stripe-label {
        margin-bottom: 0.5rem;
    }
    /* Label and Input Container */
    .junior-search-container {
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }

    .junior-searchbar {
        width: 90%;
        padding: 1rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
    }

    .junior-sort-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: auto 0;
    }

    .junior-container {
        width: 80%;
        margin: 0 auto;
    }

    .junior-containter-list {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: var(--secondary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        border: 2px solid var(--primary);
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .junior-link {
        width: 100%;
        padding: 1rem;
        text-decoration: none;
        color: var(--primary);
        padding-left: 3rem;
    }

    .junior-link:nth-child(odd) {
        background-color: var(--tertiary);
    }

    .junior-link:hover {
        color: var(--code-ninjas-blue-dark);
    }

    .junior-stripe-select {
        width: 40%;
        padding: 1rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        border: 2px solid var(--primary);
        color: var(--primary);
        cursor: pointer;
        transition: all 0.3s;
    }


    .junior-stripe-select:focus {

          box-shadow: 4px 4px 0px var(--primary)
    }

    
</style>
