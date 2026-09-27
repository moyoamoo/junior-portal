<script>
    import Modal from "../Modal.svelte";
    import { supabase } from "$lib/supabaseClient";
    import ChangeStripeBtn from "./ChangeStripeBtn.svelte";
    import ChangeStripeModal from "./ChangeStripeModal.svelte";
    import DeleteJuniorBtn from "./DeleteJuniorBtn.svelte";
    import DeleteJuniorModal from "./DeleteJuniorModal.svelte";
    import { updateJunior } from "$lib/utils";

    let { foundJuniors } = $props();

    let showChangeStripeModal = $state(false);
    let showDeleteModal = $state(false);
    let selectedJunior = $state(null);
    let tableJuniors = $state(foundJuniors);

    // Keep local state in sync with search and sorting
    $effect(() => {
        tableJuniors = foundJuniors;
    });

    const openChangeStripeModal = (junior) => {
        selectedJunior = junior;
        showChangeStripeModal = true;
    };

    const openDeleteModal = (junior) => {
        selectedJunior = junior;
        showDeleteModal = true;
    };

    const closeDeleteModal = () => {
        showDeleteModal = false;
        selectedJunior = null;
    };

    // Update UI when stripe has been changed
    const handleStripeChange = (juniorId, newStripe) => {
        tableJuniors = updateJunior(tableJuniors, juniorId, {
            currentStripe: newStripe,
        });
    };

    // Update UI when junior has been deleted
    const handleJuniorDelete = (juniorId) => {
        tableJuniors = tableJuniors.filter(
            (junior) => junior.juniorId !== juniorId,
        );

        showDeleteModal = false;
        selectedJunior = null;
    };

    // Toggle active status of juniors
    const changeActiveStatus = async (junior) => {
        const newStatus = !junior.active;

        // Save the old state in case of an error
        const oldStatus = junior.active;

        // Update the UI immediately
        tableJuniors = updateJunior(tableJuniors, junior.juniorId, {
            active: newStatus,
        });

        // Change status in subabase
        const { error } = await supabase
            .from("Junior")
            .update({ active: newStatus })
            .eq("junior_id", junior.juniorId);

        // Revert if database update fails
        if (error) {
            console.error("Failed to change active status", error);

            tableJuniors = updateJunior(tableJuniors, junior.juniorId, {
                active: oldStatus,
            });
        }
    };
</script>

<section class="junior-container">
    <div class="table-wrapper">
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Junior Name</th>
                        <th scope="col">Current Stripe</th>
                        <th scope="col">Active</th>
                     </tr>  
                </thead>

                <tbody>
                    {#each tableJuniors as junior (junior.juniorId)}
                        <tr>
                            <th scope="row">
                                <a
                                    href="/booklet/{junior.juniorId}"
                                    class="junior-link"
                                >
                                    {junior.firstName}
                                    {junior.lastName}
                                </a>
                            </th>

                            <td
                                ><ChangeStripeBtn
                                    {junior}
                                    onclick={openChangeStripeModal}
                                /></td
                            >
                            <td>
                                <button
                                class={junior.active ? "deactivate" : "activate" }
                                    onclick={() => {
                                        changeActiveStatus(junior);
                                    }}
                                    >{junior.active
                                        ? "Deactivate"
                                        : "Activate"}</button
                                >
                            </td>
                            
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</section>

{#if selectedJunior}
    <Modal bind:showModal={showChangeStripeModal}>
        <ChangeStripeModal
            junior={selectedJunior}
            onSuccess={handleStripeChange}
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
        width: 90%;
        max-height: 50vh;
        margin: 2.5rem auto 10px;

        border: 2px solid var(--primary);
        border-radius: 12px;
        box-shadow: 6px 6px 0 var(--primary);

        overflow: hidden;
    }

    .table-scroll {
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;

        scrollbar-color: var(--code-ninjas-blue-main) var(--tertiary);
        scrollbar-width: auto;
    }

    table {
        box-sizing: border-box;
        table-layout: fixed;
        width: 100%;

        border-collapse: separate;
        border-spacing: 0;

        background-color: var(--junior-light);
        text-align: center;
    }

    thead {
        background-color: var( --junior-primary);
        color: var(--secondary);
        font-size: 1rem;

        position: sticky;
        top: 0;
        z-index: 1;
    }

    th,
    td {
        padding: 10px;
    }

    .junior-link {
        text-decoration: none;
        color: var(--primary);
    }

    .junior-link:hover {
        color: var(--code-ninjas-blue-dark);
    }

    tr:nth-child(even) {
        background-color: var(--secondary)
    }

    .table-scroll::-webkit-scrollbar {
        width: 10px;
    }

    .table-scroll::-webkit-scrollbar-track {
        background: var(--tertiary);
    }

    .table-scroll::-webkit-scrollbar-thumb {
        background: var(--code-ninjas-blue-main);
        border-radius: 10px;
    }

    .table-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--code-ninjas-blue-dark);
    }

    .activate, .deactivate{
        border-radius: 12px;
        padding: 0.5rem;
        border: none;

        margin: 0.4rem;
        cursor: pointer;
        color: var(--secondary);
        font-family: "Comfortaa", sans-serif;
    }

    .activate{
        background-color: var(--success);
    }

    .deactivate{
        background-color: var(--error);
    }
</style>
