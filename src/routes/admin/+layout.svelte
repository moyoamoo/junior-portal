<script>
  import { page } from '$app/state';
  import LoginHeader from "../../components/Header.svelte"
  import AdminHeader from "../../components/Dashboard/Header.svelte"
  import jrDots from "$lib/assets/jr_dots.png";

  let { children } = $props();

  const isLogin = $derived(
    page.url.pathname === '/admin' || page.url.pathname === '/admin/'
  );
</script>

<div class="shell" class:login={isLogin}>
  {#if isLogin}
    <LoginHeader />
  {:else}
    <AdminHeader />
  {/if}

  <main>
    <img src={jrDots} aria-hidden="true" alt="" class="jr-dots-background" />
    {@render children()}
  </main>
</div>

<style>
  

  main {
   
     background: linear-gradient(
      180deg,
      var(--code-ninjas-blue-main),
      var(--code-ninjas-blue-dark)
    );

        min-height: 100dvh;
        position: relative;
        overflow: hidden;
        isolation: isolate;

        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px;
  }
    .jr-dots-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.35;
        z-index: -1;
        pointer-events: none;
    }
</style>