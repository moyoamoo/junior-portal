<script>
    import DeleteJuniorBtn from "./DeleteJuniorBtn.svelte";
    import DeleteJuniorModal from "./DeleteJuniorModal.svelte";
    import ToggleActiveJuniorBtn from "../../Juniors/ToggleActiveJuniorBtn.svelte";
    import { updateJunior } from "$lib/utils";
    import Modal from "../../Modal.svelte";
    import { supabase } from "$lib/supabaseClient";
    import JuniorsStats from "./JuniorsStats.svelte";

    let { foundJuniors, stripes = [] } = $props();

    let selectedJunior = $state(null);
    let tableJuniors = $state(foundJuniors);
    let showDeleteModal = $state(false);

    // Current sort column and direction
    let sortColumn = $state("");
    let sortAscending = $state(true);

    // Keep local state in sync with search and filtering
    $effect(() => {
        tableJuniors = foundJuniors;
    });

    // Map stripe names to their database order
    let stripeOrder = $derived(
        new Map(
            stripes.map((stripe) => [stripe.stripeName, stripe.stripeOrder]),
        ),
    );

    // Sort the juniors without modifying the original array
    let sortedJuniors = $derived(
        [...tableJuniors].sort((a, b) => {
            let result = 0;

            if (sortColumn === "name") {
                const nameA = `${a.firstName} ${a.lastName}`;
                const nameB = `${b.firstName} ${b.lastName}`;

                result = nameA.localeCompare(nameB);
            }

            if (sortColumn === "stripe") {
                const orderA = stripeOrder.get(a.currentStripe) ?? Infinity;
                const orderB = stripeOrder.get(b.currentStripe) ?? Infinity;

                result = orderA - orderB;
            }

            if (sortColumn === "active") {
                result = Number(b.active) - Number(a.active);
            }

            return sortAscending ? result : -result;
        }),
    );

    // Change sort column or reverse the current direction
    const sortBy = (column) => {
        if (sortColumn === column) {
            sortAscending = !sortAscending;
        } else {
            sortColumn = column;
            sortAscending = true;
        }
    };

    const openDeleteModal = (junior) => {
        selectedJunior = junior;
        showDeleteModal = true;
    };

    const closeDeleteModal = () => {
        showDeleteModal = false;
        selectedJunior = null;
    };

    const handleJuniorDelete = (juniorId) => {
        tableJuniors = tableJuniors.filter(
            (junior) => junior.juniorId !== juniorId,
        );

        closeDeleteModal();
    };

    // Toggle active status of juniors
    const changeActiveStatus = async (junior) => {
        const newStatus = !junior.active;
        const oldStatus = junior.active;

        tableJuniors = updateJunior(tableJuniors, junior.juniorId, {
            active: newStatus,
        });

        const { error } = await supabase
            .from("Junior")
            .update({ active: newStatus })
            .eq("junior_id", junior.juniorId);

        if (error) {
            console.error("Failed to change active status", error);

            tableJuniors = updateJunior(tableJuniors, junior.juniorId, {
                active: oldStatus,
            });
        }
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
                            <th scope="col">
                                <button onclick={() => sortBy("name")}>
                                    Junior Name
                                    {#if sortColumn === "name"}
                                        <span aria-hidden="true">
                                            {sortAscending ? "▲" : "▼"}
                                        </span>
                                    {/if}
                                </button>
                            </th>

                            <th scope="col">
                                <button onclick={() => sortBy("stripe")}>
                                    Current Stripe
                                    {#if sortColumn === "stripe"}
                                        <span aria-hidden="true">
                                            {sortAscending ? "▲" : "▼"}
                                        </span>
                                    {/if}
                                </button>
                            </th>

                            <th scope="col">
                                <button onclick={() => sortBy("active")}>
                                    Status
                                    {#if sortColumn === "active"}
                                        <span aria-hidden="true">
                                            {sortAscending ? "▲" : "▼"}
                                        </span>
                                    {/if}
                                </button>
                            </th>

                            <th scope="col">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each sortedJuniors as junior (junior.juniorId)}
                            <tr>
                                <th scope="row">
                                    <a
                                        href="/admin/juniors/{junior.juniorId}"
                                        class="junior-link"
                                    >
                                        {junior.firstName}
                                        {junior.lastName}
                                    </a>
                                </th>

                                <td>{junior.currentStripe}</td>

                                <td>
                                    <ToggleActiveJuniorBtn
                                        onclick={changeActiveStatus}
                                        {junior}
                                    />
                                </td>

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
        background-color: var(--code-ninjas-blue-dark);
        text-align: left;
        padding: 1rem;
        color: var(--secondary);
        border-bottom: 2px solid var(--primary);
    }

    thead th button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        font-weight: bold;
        cursor: pointer;
    }

    thead th button:hover {
        opacity: 0.8;
    }

    thead th button:focus-visible {
        outline: 2px solid var(--secondary);
        outline-offset: 4px;
    }

    tbody th,
    tbody td {
        text-align: left;
        padding: 1rem;
    }

    tbody tr:nth-child(odd) {
        background-color: var(--tertiary);
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
