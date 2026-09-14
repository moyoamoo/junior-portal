<script>
    import Modal from "../Modal.svelte";
    import { supabase } from "$lib/supabaseClient";
    import ChangeStripeBtn from "./ChangeStripeBtn.svelte";
    import ChangeStripeModal from "./ChangeStripeModal.svelte";
    import DeleteJuniorBtn from "./DeleteJuniorBtn.svelte";
    import DeleteJuniorModal from "./DeleteJuniorModal.svelte";

    let { foundJuniors } = $props();

    let showChangeStripeModal = $state(false);
    let showDeleteModal = $state(false);
    let selectedJunior = $state(null);

    const openChangeStripeModal = (junior) => {
        selectedJunior = junior;
        showChangeStripeModal = true;
    };

    const openDeleteModal = (junior) => {
        selectedJunior = junior;
        showDeleteModal = true;
    };
    const changeActiveStatus = async (junior) => {
        let status = !junior.active;
        const { data, error } = await supabase
            .from("Junior")
            .update({ active: status })
            .eq("junior_id", junior.juniorId)
            .select()
            .single();

        if (error) {
            console.error("Failed to change active status", error);
            return;
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
                        <th scope="col">Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {#each foundJuniors as junior (junior.juniorId)}
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
                                    onclick={() => {
                                        changeActiveStatus(junior);
                                    }}
                                    >{junior.active
                                        ? "Deactivate"
                                        : "Activate"}</button
                                >
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
</section>

{#if selectedJunior}
    <Modal bind:showModal={showChangeStripeModal}>
        <ChangeStripeModal junior={selectedJunior} />
    </Modal>

    <Modal bind:showModal={showDeleteModal}>
        <DeleteJuniorModal junior={selectedJunior} />
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

        background-color: var(--tertiary);
        text-align: center;
    }

    thead {
        background-color: var(--bold-blue);
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
        background-color: #fcf8f3;
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
</style>
