<script>
    let { buttonText } = $props();
</script>

<button type="submit" class="submit-btn">{buttonText}</button>

<style>
    .submit-btn {
        margin-top: 0.5rem;
        padding: 0.7rem;
        background-color: var(--bold-blue);
        color: var(--secondary);
        border: 2px solid var(--primary);
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
    }

    .submit-btn:hover {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }
</style>
