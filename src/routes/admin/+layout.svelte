<script>
    import { page } from "$app/state";

    let { children } = $props();
</script>

<main class="admin-login-main">
    {@render children()}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background: linear-gradient(180deg, var(--code-ninjas-blue-main), var(--code-ninjas-blue-dark));
        min-height: 100dvh;
    }
</style>
