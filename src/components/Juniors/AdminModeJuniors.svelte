<script>
    import Modal from "../Modal.svelte";
    import ChangeStripeButton from "./ChangeStripeButton.svelte";
    import ChangeStripeModal from "./ChangeStripeModal.svelte";

    let { foundJuniors } = $props();

    let showChangeStripeModal = $state(false);
    let selectedJunior = $state(null);

    const openChangeStripeModal = (junior) => {
        selectedJunior = junior;
        showChangeStripeModal = true;
    }
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
                    {#each foundJuniors as user (user.juniorId)}
                        <tr>
                            <th scope="row">
                                <a
                                    href="/booklet/{user.juniorId}"
                                    class="junior-link"
                                >
                                    {user.firstName}
                                    {user.lastName}
                                </a>
                            </th>

                            <td
                                ><ChangeStripeButton
                                    junior={user}
                                    onclick={openChangeStripeModal}
                                /></td
                            >

                            <td>
                                <button>Active</button>
                            </td>

                            <td>
                                <button>Delete</button>
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
