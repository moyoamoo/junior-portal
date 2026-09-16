<script>
    import { enhance } from "$app/forms";

    let { data } = $props();
    let errorMessage = $state("");
</script>

<h1>Congratulations!</h1>

<form method="POST" use:enhance>
    <button type="submit">Start Next Stripe</button>
</form>

{#if errorMessage}
    <p>{errorMessage}</p>
{/if}