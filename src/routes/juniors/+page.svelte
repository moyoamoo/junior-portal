<script>
    import Juniors from "../../components/Juniors/Juniors.svelte";
    import JuniorsSearch from "../../components/Juniors/JuniorsSearch.svelte";

    let {data} = $props()
</script>

<Juniors users={data.users}/>


