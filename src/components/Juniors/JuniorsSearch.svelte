<script>
    import logo from "$lib/assets/codeninjas.png";
    import JuniorImage from "./JuniorImage.svelte";
    import Juniors from "./Juniors.svelte";

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
 
<Juniors {foundJuniors}/>
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
        font-size: .9rem;
    }
    /* Label and Input Container */
    .junior-search-container {
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }

    .junior-searchbar {
        width: 90%;
        padding: .7rem;
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

   /* =================================
   992px+
   ================================= */
    
   
    /* =================================
   1200px+
   ================================= */

  
</style>
