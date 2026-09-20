<script>
    import jrLogo from "$lib/assets/jr_logo.png";
    import JuniorSearch from "./JuniorSearch.svelte";
    import AddJuniorModal from "./AddJuniorModal.svelte";
    import Juniors from "./Juniors.svelte";
    import AdminModeJuniors from "./AdminModeJuniors.svelte";
    import DeleteJuniorBtn from "./DeleteJuniorBtn.svelte";
    let { users, adminMode } = $props();

    let search = $state("");
    let selectedStripe = $state("");
    let selectedActive = $state("");
    let showModal = $state(false);

    // Filter junior using values from searchbar and selects
    let foundJuniors = $derived(
        users.filter((junior) => {
            console.log(junior);
            const name = `${junior.firstName} ${junior.lastName}`
                .toLowerCase()
                .replaceAll(" ", "");

            const searchTerm = search.toLowerCase().replaceAll(" ", "");

            const matchesName = name.includes(searchTerm);

            const matchesStripe =
                !selectedStripe || junior.currentStripe === selectedStripe;

            // Can only see active juniors in admin mode
            const matchesActive =
                !adminMode ||
                !selectedActive ||
                (selectedActive === "active" && junior.active) ||
                (selectedActive === "inactive" && !junior.active);

            return matchesName && matchesStripe && matchesActive;
        }),
    );
</script>

<section class="search-sort-section">
    <img src={jrLogo} alt="Code Ninjas Edinburgh logo" class="logo" />

    <JuniorSearch
        bind:search
        bind:selectedStripe
        bind:selectedActive
        {adminMode}
        onAdd={() => (showModal = true)}
    />
</section>
{#if !adminMode}
    <Juniors {foundJuniors} />
{:else}
    <AdminModeJuniors {foundJuniors} />
{/if}

{#if adminMode}
    <AddJuniorModal bind:showModal />
{/if}

<style>
    .logo {

        margin: 1rem auto;
    }

    .search-sort-section {
        border: 2px solid var(--primary);
        background-color: var(--secondary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        width: 60%;
        max-width: 800px;
        min-height: 10vh;
        margin: 2.5rem auto;
        padding-bottom: 1rem;
        overflow: hidden;

        display: flex;
        justify-content: center;
        flex-direction: column;
    }
</style>
