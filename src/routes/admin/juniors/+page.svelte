<script>
    import Header from "../../../components/Dashboard/Header.svelte";
    import JuniorMain from "../../../components/Juniors/JuniorMain.svelte";

    let { data } = $props();
</script>

<Header/>
<JuniorMain users={data.users} adminDashboard={data.adminDashboard}/>