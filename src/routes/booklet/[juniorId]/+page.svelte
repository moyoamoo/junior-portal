<script>
    import Welcome from "../../../components/Welcome.svelte";
    import TableBody from "../../../components/Table/TableBody.svelte";
    import Header from "../../../components/Header.svelte";

    let { data } = $props();
</script>

<Header />

<Welcome
    activities={data.activities}
    juniorInfo={data.user}
    theme={data.theme}
/>
<TableBody
    activities={data.activities}
    juniorId={data.user.juniorId}
    theme={data.theme}
/>
