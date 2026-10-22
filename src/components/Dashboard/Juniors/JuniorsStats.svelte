<script>
    import StatsCards from "../Stats/StatsCards.svelte";
    let {juniors} = $props();

    // Number of total juniors
    let totalJuniors = $derived(juniors.length);

    // Number of active juniors
    let activeJuniors = $derived(
        juniors.filter((junior) => junior.active).length
    );

    //Number of active juniors
    let inactiveJuniors = $derived(
        juniors.filter((junior) => !junior.active).length
    );

  
</script>



<section class="stats">
    <StatsCards
        cardTitle="Total Juniors"
        cardBody={totalJuniors}
    />

    <StatsCards
        cardTitle="Active Juniors"
        cardBody={activeJuniors}
    />

    <StatsCards
        cardTitle="Inactive Juniors"
        cardBody={inactiveJuniors}
    />
</section>

<style>
    .stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
    }

    @media (max-width: 600px) {
        .stats {
            grid-template-columns: 1fr;
        }
    }
</style>