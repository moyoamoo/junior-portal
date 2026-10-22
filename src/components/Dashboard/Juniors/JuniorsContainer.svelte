<script>
    import DeleteJuniorBtn from "./DeleteJuniorBtn.svelte";
    import DeleteJuniorModal from "./DeleteJuniorModal.svelte";
    import Modal from "../../Modal.svelte";
    let { foundJuniors } = $props();
    let selectedJunior = $state(null);
    let tableJuniors = $state(foundJuniors);
    let showDeleteModal = $state(false);
 
    // Keep local state in sync with search and sorting from the parent
    $effect(() => {
        tableJuniors = foundJuniors;
    });
 
    // Open delete modal
    const openDeleteModal = (junior) => {
        selectedJunior = junior;
        showDeleteModal = true;
    };
 
    // Close delete modal
    const closeDeleteModal = () => {
        showDeleteModal = false;
        selectedJunior = null;
    };
 
    // Update UI when a junior has been deleted
    const handleJuniorDelete = (juniorId) => {
        tableJuniors = tableJuniors.filter(
            (junior) => junior.juniorId !== juniorId,
        );
 
        closeDeleteModal();
    };
</script>
 
<section class="junior-container">
    {#if tableJuniors.length === 0}
        <p>No Juniors found</p>
    {:else}
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Junior Name</th>
                            <th scope="col">Current Stripe</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
 
                    <tbody>
                        {#each tableJuniors as junior (junior.juniorId)}
                            <tr>
                            
                                <th scope="row">
                                    <a
                                       href="/admin/juniors/{junior.juniorId}" class="junior-link">
                                  
                                    
                                        {junior.firstName}
                                        {junior.lastName}
                                    </a>
                                </th>
                                <td>{junior.currentStripe}</td>
                                <td>
                                    <DeleteJuniorBtn
                                        {junior}
                                        onclick={openDeleteModal}
                                    />
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</section>
 
{#if selectedJunior}
    <Modal bind:showModal={showDeleteModal}>
        <DeleteJuniorModal
            junior={selectedJunior}
            onSuccess={handleJuniorDelete}
            onClose={closeDeleteModal}

        />
    </Modal>
{/if}
 
<style>
    .junior-container {
        width: 80%;
        max-width: 800px;
        margin: 0 auto;
    }
 
    .table-wrapper {
        background-color: var(--secondary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        border: 2px solid var(--primary);
        overflow: hidden;
    }
 
    .table-scroll {
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: auto;
        scrollbar-color: var(--junior-primary) transparent;
    }
 
    table {
        width: 100%;
        border-collapse: collapse;
    }
 
    thead th {
        position: sticky;
        top: 0;
        background-color: var(--secondary);
        text-align: left;
        padding: 1rem;
        color: var(--primary);
        border-bottom: 2px solid var(--primary);
    }
 
    tbody th,
    tbody td {
        text-align: left;
        padding: 1rem;
    }
 
    tbody tr:nth-child(odd) {
        background-color: #f7eefa;
    }
 
    .junior-link {
        display: inline;
        padding: 0;
        width: auto;
        font-weight: bold;
        text-decoration: none;
        color: var(--primary);
    }
 
    .junior-link:hover {
        color: var(--code-ninjas-blue-dark);
    }
</style>
 
