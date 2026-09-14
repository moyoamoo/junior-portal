<script>
  import bee from "$lib/assets/bumblebee.png";
  import chipmunk from "$lib/assets/chipmunk.png";
  import wildcat from "$lib/assets/wildcat.png";
  import clownfish from "$lib/assets/clownfish.png";
  import skunk from "$lib/assets/skunk.png";
  import zebra from "$lib/assets/zebra.png";

  let { currentStripe } = $props();

  const stripes = {
    Bumblebee: { alt: "bumblebee", image: bee },
    Wildcat: { alt: "wildcat", image: wildcat },
    Chipmunk: { alt: "chipmunk", image: chipmunk },
    Skunk: { alt: "skunk", image: skunk },
    Clownfish: { alt: "clownfish", image: clownfish },
    Zebra: { alt: "zebra", image: zebra },
  };

  const stripeList = Object.entries(stripes);

  const currentIndex = $derived(
    stripeList.findIndex(([name]) => name === currentStripe)
  );
</script>

<section class="booklet-nav">
  {#each stripeList as [name, stripe], i (name)}
    <img
      src={stripe.image}
      alt={stripe.alt}
      class="img-stripe"
      class:greyed={currentIndex !== -1 && i > currentIndex}
    />
  {/each}
</section>

<style>
  .booklet-nav {
    height: 8dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  .img-stripe {
    width: 10%;
    border-radius: 12px;
    border: 2px solid var(--primary);
    transition: filter 0.2s ease, opacity 0.2s ease;
  }

  .img-stripe.greyed {
    filter: grayscale(100%);
    opacity: 0.5;
  }
</style>