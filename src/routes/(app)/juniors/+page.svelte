<script>
    import JuniorsSearch from "../../../components/Juniors/JuniorsSearch.svelte";

    let {data} = $props()
</script>


<JuniorsSearch  users={data.users} adminMode={data.adminMode}/>


