<script>
  let { juniorInfo, activities, theme } = $props();
</script>

<section class="welcome-section">
  <h1>Welcome, {juniorInfo.firstName}</h1>
  <h2 class="stripe">
    {juniorInfo.currentStripe} Stripe
  </h2>
</section>
