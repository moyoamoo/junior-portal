<script>
    let { onclick, junior } = $props();
</script>

<button
    class={junior.active ? "deactivate" : "activate"}
    onclick={() => {
        onclick(junior);
    }}>{junior.active ? "Deactivate" : "Activate"}</button
>

<style>
    .activate,
    .deactivate {
        border-radius: 12px;
        padding: 0.5rem;
        border: none;
        width: 120px;
        margin: 0.4rem;
        cursor: pointer;
        color: var(--code-ninjas-blue-dark);
        font-family: "Comfortaa", sans-serif;
    }

    .activate {
        background-color: var(--success);

    }

    .deactivate {
        background-color: var(--error);
    }
</style>
