<script>
  import codeyWaving from "$lib/assets/codey_laptop.png";

  import bee from "$lib/assets/bumblebee.png";
  import wildcat from "$lib/assets/wildcat.png";
  import chipmunk from "$lib/assets/chipmunk.png";
  import tiger from "$lib/assets/tiger.png";
  import skunk from "$lib/assets/skunk.png";
  import clownfish from "$lib/assets/clownfish.png";
  import zebra from "$lib/assets/zebra.png";
  import codeyMicrobit from "$lib/assets/codey_mircobit.png";
  import codeyBlockCode from "$lib/assets/codey_blockcode.png";
  import codeyTablet from "$lib/assets/codey_tablet.png";
  import codeyGaming from "$lib/assets/codey_gaming.png";
  import codeyCogs from "$lib/assets/codey_cogs.png";

  let { juniorInfo, activities, theme, viewingStripe } = $props();

  //stripe images
  const stripes = {
    Bumblebee: { alt: "bumblebee", image: bee, codey: codeyBlockCode },
    Wildcat: { alt: "wildcat", image: wildcat, codey: codeyTablet },
    Chipmunk: { alt: "chipmunk", image: chipmunk, codey: codeyMicrobit },
    Tiger: { alt: "tiger", image: tiger },
    Skunk: { alt: "skunk", image: skunk, codey: codeyCogs },
    Clownfish: { alt: "clownfish", image: clownfish, codey: codeyWaving },
    Zebra: { alt: "zebra", image: zebra, codey: codeyGaming },
  };

  let stripeName = $derived(viewingStripe ?? juniorInfo.currentStripe);
  let stripe = $derived(stripes[stripeName] ?? null);
</script>

<section class="welcome-section">
  <img src={stripe.image} alt={stripe.alt} class="welcome-img-stripe" />
  <div class="welcome-section-text">
    <h1>Welcome, {juniorInfo.firstName}</h1>
    <h2 class="stripe">
      {stripeName} Stripe
    </h2>
  </div>
</section>

<style>
  .welcome-img-stripe {
    width: 20%;
    border-radius: 12px;
    border: 2px solid var(--primary);
  }
  .welcome-section {
    position: relative;
    box-sizing: border-box;
    width: 90%;
    height: 120px;
    margin: 2.5rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 12px;
    border: 2px solid var(--primary);
    box-shadow: 6px 6px 0 var(--primary);
    background-color: var(--stripe-primary);
    overflow: visible;
  }

  .welcome-section-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    width: 65%;
    position: relative;
    z-index: 2;
    color: var(--stripe-header-text);
  }

  
  .welcome-section-text h1,
  .welcome-section-text h2 {
    margin: 0;
    line-height: 1.1;
  }

  .welcome-section-text h1 {
    font-size: 2rem;
  }

  .welcome-section-text h2 {
    font-size: 1.35rem;
  }

  

  /* ---------------------------------
   320px - smaller phones
   --------------------------------- */
  @media (min-width: 320px) {
    .welcome-section {
      width: 92%;
      height: 105px;
      margin-top: 2.5rem;
    }

    .welcome-section-text {
      width: 70%;
      margin-right: 18%;
    }

    .welcome-section-text h1 {
      font-size: 1.8rem;
    }

    .welcome-section-text h2 {
      font-size: 1.2rem;
    }

    .welcome-img-codey {
      width: 25%;
      right: 5%;
    }
  }

  /* ---------------------------------
   480px - larger phones
   --------------------------------- */
  @media (min-width: 480px) {
    .welcome-section {
      width: 90%;
      height: 115px;
      margin-top: 2.75rem;
    }

    .welcome-section-text {
      width: 65%;
      margin-right: 18%;
    }

    .welcome-section-text h1 {
      font-size: 2.1rem;
    }

    .welcome-section-text h2 {
      font-size: 1.4rem;
    }

    .welcome-img-codey {
      width: 23%;
      right: 6%;
    }

    .welcome-img-stripe {
      width: 4rem;
    }
  }

  /* ---------------------------------
   768px - tablets
   --------------------------------- */
  @media (min-width: 768px) {
    .welcome-section {
      width: 85%;
      height: 125px;
      margin-top: 3.5rem;
    }

    .welcome-section-text {
      width: 60%;
      margin-right: 15%;
    }

    .welcome-section-text h1 {
      font-size: 2.5rem;
    }

    .welcome-section-text h2 {
      font-size: 1.65rem;
    }

    .welcome-img-stripe {
      width: 5rem;
    }

    .welcome-img-stripe {
      width: 8rem;
    }
  }

  /* ---------------------------------
   992px - smaller desktops
   --------------------------------- */
  @media (min-width: 992px) {
    .welcome-section {
      width: 80%;
      height: 135px;
      margin-top: 4.5rem;
    }

    .welcome-section-text {
      width: 55%;
      margin-right: 15%;
    }

    .welcome-section-text h1 {
      font-size: 2.8rem;
    }

    .welcome-section-text h2 {
      font-size: 1.85rem;
    }

    .welcome-img-codey {
      width: 20%;
      right: 8%;
    }

    .welcome-img-stripe {
      width: 12rem;
    }
  }

  /* ---------------------------------
   1200px - large screens
   --------------------------------- */
  @media (min-width: 1200px) {
    .welcome-section {
      width: 80%;
      max-width: 1400px;
      height: 145px;
      margin-top: 5.5rem;
    }

    .welcome-section-text {
      width: 55%;
      margin-right: 15%;
    }

    .welcome-section-text h1 {
      font-size: 3.1rem;
    }

    .welcome-section-text h2 {
      font-size: 2rem;
    }

    .welcome-img-stripe {
      width: 12rem;
    }
  }
</style>
