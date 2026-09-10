<script>
    let { data } = $props();
    import JuniorContainer from "../../../components/Admin/JuniorContainer.svelte";
</script>

<JuniorContainer users={data.users}/>
