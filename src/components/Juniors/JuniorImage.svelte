<script>
    import bee from "$lib/assets/bumblebee.png";
    import wildcat from "$lib/assets/wildcat.png";
    import chipmunk from "$lib/assets/chipmunk.png";
    import tiger from "$lib/assets/tiger.png";
    import skunk from "$lib/assets/skunk.png";
    import clownfish from "$lib/assets/clownfish.png";
    import zebra from "$lib/assets/zebra.png";

    let { currentStripe } = $props();

    const stripes = {
        Bumblebee: { alt: "bumblebee", image: bee },
        Wildcat: { alt: "wildcat", image: wildcat },
        Chipmunk: { alt: "chipmunk", image: chipmunk },
        Tiger: { alt: "tiger", image: tiger },
        Skunk: { alt: "skunk", image: skunk },
        Clownfish: { alt: "clownfish", image: clownfish },
        Zebra: { alt: "zebra", image: zebra },
    };

    let stripe = $derived(stripes[currentStripe] ?? null);

</script>

<img class="junior-img" src={stripe.image} alt={stripe.alt} />
