<script>
    import logo from "$lib/assets/codeninjas.png";
    import JuniorSearch from "./JuniorSearch.svelte";
    import AddJuniorModal from "./AddJuniorModal.svelte";
    import Juniors from "./Juniors.svelte";
    import AdminModeJuniors from "./AdminModeJuniors.svelte";
    let { users, adminMode } = $props();

    let search = $state("");
    let selectedStripe = $state("");
    let showModal = $state(false);

    let foundJuniors = $derived(
        users.filter((junior) => {
            const name = `${junior.firstName} ${junior.lastName}`
                .toLowerCase()
                .replaceAll(" ", "");

            const searchTerm = search.toLowerCase().replaceAll(" ", "");

            const matchesName = name.includes(searchTerm);

            const matchesStripe =
                !selectedStripe ||
                junior.currentStripe === selectedStripe;

            return matchesName && matchesStripe;
        }),
    );
</script>

<section class="search-sort-section">
    <img src={logo} alt="Code Ninjas Edinburgh logo" class="logo" />

    <JuniorSearch
        bind:search
        bind:selectedStripe
        {adminMode}
        onAdd={() => (showModal = true)}
    />
</section>
{#if !adminMode}
    <Juniors {foundJuniors} />
{:else}
    <AdminModeJuniors {foundJuniors}/>
{/if}

{#if adminMode}
    <AddJuniorModal bind:showModal />
{/if}

<style>
    .logo {
        width: 40%;
        margin: 1rem auto;
    }

    .search-sort-section {
        border: 2px solid var(--primary);
        background-color: var(--tertiary);
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
