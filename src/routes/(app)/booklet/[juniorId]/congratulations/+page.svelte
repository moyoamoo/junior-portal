<script>
    import { enhance } from "$app/forms";
    import Fireworks from "../../../../../components/Fireworks.svelte";

    import bee from "$lib/assets/bumblebee.png";
    import wildcat from "$lib/assets/wildcat.png";
    import chipmunk from "$lib/assets/chipmunk.png";
    import tiger from "$lib/assets/tiger.png";
    import skunk from "$lib/assets/skunk.png";
    import clownfish from "$lib/assets/clownfish.png";
    import zebra from "$lib/assets/zebra.png";

    let { data } = $props();
    let errorMessage = $state("");

    //stripe images
    const stripeImages = {
        Bumblebee: bee,
        Wildcat: wildcat,
        Chipmunk: chipmunk,
        Tiger: tiger,
        Skunk: skunk,
        Clownfish: clownfish,
        Zebra: zebra,
    };
</script>

<section class="congrats-container">
    <h1>Congratulations {data.junior.firstName}!</h1>
    <p>You have completed {data.junior.currentStripe} stripe</p>
    <img
        src={stripeImages[data.junior.currentStripe]}
        alt={stripeImages[data.junior.currentStripe]}
        class="stripe-img"
    />
    <Fireworks />
    <p>
        You're ready to start your next stripe,
        {data.nextStripe.stripeName}
    </p>

    <form method="POST" use:enhance class="move-stripe-btn-container">
        <button type="submit" class="move-stripe-btn">Start Next Stripe</button>
    </form>
</section>

{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

<style>
    h1 {
        font-size: 2.5rem;
    }
    p {
        font-size: 2rem;
    }
    .congrats-container {
        position: relative;
        z-index: 1;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        min-height: 100dvh;
        box-sizing: border-box;
    }
    .stripe-img {
        width: 20%;
        border: 2px solid var(--primary);
        border-radius: 12px;
        box-shadow: 6px 6px 0 var(--primary);
    }

    .move-stripe-btn-container {
        display: flex;
        justify-content: center;
    }
    .move-stripe-btn {
        color: var(--secondary);
        font-family: "Comfortaa", sans-serif;
        font-weight: bold;
        font-size: 1rem;
        text-align: center;

        background-color: var(--stripe-primary);
        padding: 1rem 1.5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;

        border: 2px solid var(--primary);
        border-radius: 12px;
        cursor: pointer;

        position: relative;

        /* Tactile 3D effect */
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            6px 6px 0 var(--primary);

        transition:
            transform 0.1s ease,
            box-shadow 0.1s ease;
    }

    .move-stripe-btn:hover {
        filter: brightness(1.05);
        animation: jiggle 0.4s ease-in-out;
    }

    .move-stripe-btn:active {
        transform: translate(6px, 6px);

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            0 0 0 var(--primary);
    }

    @keyframes jiggle {
        0% {
            transform: rotate(0deg);
        }
        20% {
            transform: rotate(-3deg);
        }
        40% {
            transform: rotate(3deg);
        }
        60% {
            transform: rotate(-2deg);
        }
        80% {
            transform: rotate(2deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }
</style>
