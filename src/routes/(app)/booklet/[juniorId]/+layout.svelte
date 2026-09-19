<script>
    import { page } from "$app/state";

    let { children } = $props();

    let theme = $derived(page.data.theme || {});

    // theme style based on current junior's stripe
    let themeStyle = $derived(
        Object.entries(theme)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; "),
    );
</script>

<main style={themeStyle}>
    {@render children()}
</main>

<style>
    main {
        min-height: 100dvh;
        background-color: var(--stripe-secondary);
        overflow: auto;
        transition: background-color 0.3s ease;
    }
</style>
