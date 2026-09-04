<script>
    import Juniors from "../../components/Juniors/Juniors.svelte";
    import Header from "../../components/Header.svelte";

    let {data} = $props()
</script>

<Header/>
<Juniors users={data.users}/>


