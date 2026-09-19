<script>
    import JuniorsSearch from "../../../components/Juniors/JuniorMain.svelte";

    let { data } = $props();
</script>

<main>
    <section class="main-section">
        <JuniorsSearch users={data.users} adminMode={data.adminMode} />
    </section>
</main>


<style>
     
</style>