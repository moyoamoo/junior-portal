<script>
    import Table from "../../../components/Table/Table.svelte"
    import Header from "../../../components/Header.svelte";

    let {data} = $props()

       
</script>

    <Header juniorInfo={data.user} activities={data.activities} theme={data.theme} />
    <Table activities={data.activities} juniorId ={data.user.juniorId} theme={data.theme}/>


 