<script>
    import Juniors from "../../../components/Juniors/JuniorsSearch.svelte";

    let {data} = $props()
</script>


<Juniors users={data.users}/>


