<script>
    let { currentStripe, openModel } = $props();
</script>

<button type="button" class="change-stripe-btn" onclick={openModel}>{currentStripe}</button>

<style>
    .change-stripe-btn {
        background-color: var(--bold-blue);
        border-radius: 12px;
        padding: 0.5rem;
        border: none;

        margin: 0.4rem;
        cursor: pointer;
        color: var(--secondary);
        font-family: "Comfortaa", sans-serif;
    }

    .change-stripe-btn:focus,
    .change-stripe-btn:hover {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }
</style>
