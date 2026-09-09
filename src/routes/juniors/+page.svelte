<script>
    import Juniors from "../../components/Juniors/JuniorsSearch.svelte";
    import Header from "../../components/Header.svelte";

    let {data} = $props()
</script>

<Header/>
<Juniors users={data.users}/>


