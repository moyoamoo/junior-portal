<script>
    import { page } from "$app/state";

    let { children } = $props();
</script>

<main class="admin-login-main">
    {@render children()}
</main>

<style>
    .admin-login-main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: var(--code-ninjas-blue-dark);
        min-height: 100dvh;
    }
</style>
