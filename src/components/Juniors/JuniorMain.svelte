<script>
    import JuniorSearch from "./JuniorSearch.svelte";
    import AddJuniorModal from "./AddJuniorModal.svelte";
    import Juniors from "./Juniors.svelte";
    import AdminModeJuniors from "./AdminModeJuniors.svelte";
    import DeleteJuniorBtn from "../Dashboard/Juniors/DeleteJuniorBtn.svelte";
    import JuniorsContainer from "../Dashboard/Juniors/JuniorsContainer.svelte";
    let { users, adminMode, adminDashboard, stripes } = $props();

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

<JuniorSearch
    bind:search
    bind:selectedStripe
    bind:selectedActive
    {adminMode}
    onAdd={() => (showModal = true)}
/>



{#if !adminMode && !adminDashboard}
    <Juniors {foundJuniors} />
{:else if adminMode}
    <AdminModeJuniors {foundJuniors} />
{:else}
 <JuniorsContainer {foundJuniors} {stripes}/>
{/if}

{#if adminMode}
    <AddJuniorModal bind:showModal />
{/if}
