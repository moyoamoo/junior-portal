<script>
    import JuniorsSearch from "../../../components/Juniors/JuniorMain.svelte";
    import jrDots from "$lib/assets/jr_dots.png"
    let { data } = $props();
</script>

<main>
    <section class="main-section">
        <img src={jrDots} aria-hidden="true" alt="" class="jr-dots-background" />

        <JuniorsSearch users={data.users} adminMode={data.adminMode} />
    </section>
</main>


<style>
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