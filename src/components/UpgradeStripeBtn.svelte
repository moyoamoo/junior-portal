<script>
    import Modal from "./Modal.svelte";

    let { showModal = $bindable(false) } = $props();
</script>

<button onclick={() => (showModal = true)}>
    Move to Next Stripe
</button>

<Modal bind:showModal>
    <h2>Move to Next Stripe</h2>

    <p>Enter admin credentials to continue.</p>

    <!-- Authentication form will go here -->
</Modal>