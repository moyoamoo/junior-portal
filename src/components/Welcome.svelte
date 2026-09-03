<script>
  import codeyWaving from "$lib/assets/codey_waving.png";

  import bee from "$lib/assets/bumblebee.png";
  import wildcat from "$lib/assets/wildcat.png";
  import chipmunk from "$lib/assets/chipmunk.png";
  import tiger from "$lib/assets/tiger.png";
  import skunk from "$lib/assets/skunk.png";
  import clownfish from "$lib/assets/clownfish.png";
  import zebra from "$lib/assets/zebra.png";

  let { juniorInfo, activities, theme } = $props();

  //stripe images
  const stripes = {
    Bumblebee: { alt: "bumblebee", image: bee },
    Wildcat: { alt: "wildcat", image: wildcat },
    Chipmunk: { alt: "chipmunk", image: chipmunk },
    Tiger: { alt: "tiger", image: tiger },
    Skunk: { alt: "skunk", image: skunk },
    Clownfish: { alt: "clownfish", image: clownfish },
    Zebra: { alt: "zebra", image: zebra },
  };

  let stripe = $derived(stripes[juniorInfo.currentStripe] ?? null);
</script>

<section class="welcome-section">
  <div class="welcome-section-text">
    <h1>Welcome, {juniorInfo.firstName}</h1>
    <h2 class="stripe">
      {juniorInfo.currentStripe} Stripe
    </h2>
  </div>
  <img src={codeyWaving} alt={stripe.alt} class="welcome-img-codey" />
</section>

<style>
  .welcome-section {
  position: relative;
  box-sizing: border-box;
  width: 90%;
  height: 120px;
  margin: 2.5rem auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
  border: 2px solid var(--primary);
  box-shadow: 6px 6px 0 var(--primary);
  background-color: var(--stripe-quaternary);
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

.stripe {
  color: var(--stripe-text);
}

.welcome-img-codey {
  position: absolute;
  bottom: 0;
  right: 7%;
  width: 24%;
  height: auto;
  display: block;
  z-index: 3;
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

  .welcome-img-codey {
    width: 21%;
    right: 7%;
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

  .welcome-img-codey {
    width: 19%;
    max-width: 190px;
    right: 8%;
  }
}

</style>