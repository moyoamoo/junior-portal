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

<main class="booklet-main" style={themeStyle}>
    {@render children()}
</main>
