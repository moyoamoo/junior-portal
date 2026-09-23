<script>
    import bee from "$lib/assets/bumblebee.png";
    import chipmunk from "$lib/assets/chipmunk.png";
    import wildcat from "$lib/assets/wildcat.png";
    import clownfish from "$lib/assets/clownfish.png";
    import skunk from "$lib/assets/skunk.png";
    import zebra from "$lib/assets/zebra.png";

    let { stripes, currentStripe, viewingStripe } = $props();

    const images = {
        bumblebee: bee,
        chipmunk,
        wildcat,
        clownfish,
        skunk,
        zebra,
    };

    const currentOrder = $derived(
        stripes.find(
            (stripe) =>
                stripe.stripeName.toLowerCase() ===
                currentStripe?.toLowerCase(),
        )?.stripeOrder ?? 0,
    );

    const items = $derived(
        stripes.map((stripe) => {
            const key = stripe.stripeName.toLowerCase();

            return {
                name: stripe.stripeName,
                image: images[key],

                locked: stripe.stripeOrder > currentOrder,

                viewing: key === viewingStripe?.toLowerCase(),
            };
        }),
    );
</script>

<nav class="booklet-nav" aria-label="Booklets">
    {#each items as item (item.name)}
        {#if item.locked}
            <span
                class="stripe greyed"
                aria-disabled="true"
                title="Not unlocked yet"
            >
                <img src={item.image} alt={item.name} class="img-stripe" />
            </span>
        {:else}
            <a
                class="stripe"
                class:viewing={item.viewing}
                href="?stripe={item.name}"
                aria-current={item.viewing ? "page" : null}
            >
                <img src={item.image} alt={item.name} class="img-stripe" />
            </a>
        {/if}
    {/each}
</nav>

<style>
    .booklet-nav {
        height: 5dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        margin-top: 5rem;
    }

    .stripe {
        display: block;
        max-width: 6%;
    }

    .img-stripe {
        display: block;
        width: 100%;
        border-radius: 12px;
        border: 2px solid var(--primary);
        transition:
            filter 0.2s ease,
            opacity 0.2s ease,
            box-shadow 0.2s ease;
    }

    .stripe:hover .img-stripe,
    .stripe:focus-visible .img-stripe {
        box-shadow: var(--shadow);
    }

    /* The booklet currently on screen */
    .stripe.viewing .img-stripe {
        box-shadow: var(--shadow);
        outline: 1px solid var(--primary);
    }

    /* Locked stripes: greyed out and not clickable */
    .stripe.greyed {
        pointer-events: none;
    }

    .stripe.greyed .img-stripe {
        filter: grayscale(100%);
        opacity: 0.5;
    }

    /* =================================
   320px+
   ================================= */

    @media (min-width: 320px) {
          .stripe {
            display: block;
            width: 10%;
        }
        
    }


    /* =================================
   768px+
   ================================= */

    @media (min-width: 768px) {
        .stripe {
            display: block;
            width: 10%;
        }
    }

   
</style>
