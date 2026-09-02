<script>
    import {page} from '$app/state'

    let { children,} = $props();

    let theme = $derived(page.data.theme || {});

    // theme style based on current junior's stripe
    let themeStyle = $derived(
        Object.entries(theme)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; "),
    );

    let pageColour = $derived(theme['--stripe-primary'] || '#C77E0A');
    let pageBg = $derived(`${pageColour}1E`);

    $effect(()=>{
        document.body.style.backgroundColor = pageBg;
    })

</script>

<div style={themeStyle}>
    {@render children()}
</div>