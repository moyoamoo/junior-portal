<script>
    import Juniors from "../../components/Juniors/Juniors.svelte";

    let {data} = $props()
</script>

<Juniors users={data.users}/>