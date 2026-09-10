<script>
    import JuniorsSearch from "../../../components/Juniors/JuniorMain.svelte";

    let {data} = $props()
</script>


<JuniorsSearch  users={data.users} adminMode={data.adminMode}/>


