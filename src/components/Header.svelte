<script>
  let { juniorInfo, activities, stripeThemes, defaultTheme } = $props();

  let currentStripe = $derived(
    juniorInfo.currentStripe.toLowerCase() || "bumblebee",
  );
  let theme = $derived(stripeThemes[currentStripe] || defaultTheme);
</script>

<header>
  <h1>Welcome, {juniorInfo.firstName}</h1>
  <h2 style:color={theme["--stripe-primary"]}>
    {juniorInfo.currentStripe} Stripe
  </h2>
</header>
