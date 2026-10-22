<script>
    import { Bar } from "svelte-chartjs";
    import "chart.js/auto";

    let { juniors = [], stripes = [] } = $props();

    let chartData = $derived.by(() => {
        const counts = Object.fromEntries(
            stripes.map((stripe) => [stripe.stripeName, 0]),
        );

        for (const junior of juniors) {
            const stripe = junior.currentStripe;

            if (stripe in counts) {
                counts[stripe]++;
            }
        }

        return {
            labels: stripes.map((stripe) => stripe.stripeName),
            datasets: [
                {
                    label: "Number of juniors",
                    data: stripes.map((stripe) => counts[stripe.stripeName]),
                    backgroundColor: stripes.map(
                        (stripe) => stripe.stripeColourPrimary,
                    ),
                    borderRadius: 6,
                },
            ],
        };
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                labels: {
                color: '#000000',
                font: {
                    family: 'Comfortaa',
                    size: 12
                }
            }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };
</script>

<div class="chart">
    <Bar data={chartData} {options} />
</div>

<style>
    .chart {
    position: relative;
    width: 70%;
    height: 300px;
    background-color: var(--secondary);
    border-radius: 8px;
    padding: 1rem;
    color: var(--primary);
  
    font-family: "Comfortaa", sans-serif;
    box-shadow: var(--shadow);
    border-radius: 12px;
    border: 2px solid var(--primary);
    margin-bottom: 2rem;
}
</style>
