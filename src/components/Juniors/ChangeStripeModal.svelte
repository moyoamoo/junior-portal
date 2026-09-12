<script>
    import Modal from "../Modal.svelte";

    let { junior } = $props();
</script>

<form class="add-junior-form">
    <p>{junior.firstName}'s current stripe: {junior.currentStripe}</p>
</form>
