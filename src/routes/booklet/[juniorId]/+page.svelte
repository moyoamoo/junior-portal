<script>
    import Table from "../../../components/Table/Table.svelte"
    import Header from "../../../components/Header.svelte";

    let {data} = $props()
  

</script>

    <Header juniorInfo={data.user}/>
    <Table activities={data.activities}/>


 