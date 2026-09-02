<script>
    import TableHeader from "./TableHeader.svelte";
    import TableBody from "./TableBody.svelte";

    let { activities, juniorId, stripeThemes, defaultTheme} = $props();
 
    let currentStripe = $derived(activities[0].stripe.toLowerCase() || "bumblebee");
    let theme = $derived(stripeThemes[currentStripe] || defaultTheme);

    // Build CSS variable string
    let themeStyle = $derived(
        Object.entries(theme)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ')
    );
</script>

<table style={themeStyle}>
    <TableHeader />
    <TableBody {activities} {juniorId} />
</table>
