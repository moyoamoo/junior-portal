<script>
    import Header from "../../../components/Dashboard/Header.svelte";
    import JuniorMain from "../../../components/Juniors/JuniorMain.svelte";
    import JuniorsStats from "../../../components/Dashboard/Juniors/JuniorsStats.svelte";
    import JuniorsStripeChart from "../../../components/Dashboard/Juniors/JuniorStripeChart.svelte";

    let { data } = $props();
</script>

<JuniorsStats juniors={data.users} />

<JuniorMain
    users={data.users}
    adminDashboard={data.adminDashboard}
    stripes={data.stripes}
/>


<JuniorsStripeChart juniors={data.users} stripes={data.stripes}/>