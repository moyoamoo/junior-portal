<script>
    import Modal from "../Modal.svelte";

    let {
        showModal = $bindable(false),
        activity,
        commentText = $bindable(""),
        onAdd,
        onEdit,
    } = $props();
</script>

<Modal bind:showModal>
    <textarea
        class="modal-textarea"
        bind:value={commentText}
        placeholder="Write a comment..."
    ></textarea>

    {#if activity?.comment == null || activity?.comment === ""}
        <button class="modal-btn" onclick={() => onAdd(commentText)}>
            Add
        </button>
    {:else}
        <button class="modal-btn" onclick={() => onEdit(commentText)}>
            Save
        </button>
    {/if}
</Modal>

<style>
    .modal-textarea {
        height: 70%;
        width: 20rem;
        border: 2px solid var(--primary);
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 6px;
    }

    .modal-textarea:hover,
    .modal-textarea:focus {
        box-shadow: 4px 4px 0px var(--primary);
    }

    /* .modal-textarea:focus-visible{
        outline: 2px solid var(--stripe-primary);
    }
    */
    .modal-btn {
        background-color: var(--stripe-primary);
        color: var(--secondary);
        outline: none;
        border: 2px solid var(--primary);
        font-size: 1rem;
        font-family: "Comfortaa", sans-serif;
        cursor: pointer;
        width: 80%;
        height: 40px;
        border-radius: 6px;
    }

    .modal-btn:hover,
    .modal-btn:focus {
        box-shadow: 4px 4px 0px var(--primary);
        background-color: var(--stripe-hover);
    }
</style>
