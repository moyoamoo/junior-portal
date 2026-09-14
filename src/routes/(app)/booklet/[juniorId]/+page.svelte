<script>
    import Welcome from "../../../../components/Welcome.svelte";
    import TableBody from "../../../../components/Table/TableBody.svelte";
    import Header from "../../../../components/Header.svelte";
    import BookletNav from "../../../../components/BookletNav.svelte";

    let { data } = $props();
</script>



<Welcome
    activities={data.activities}
    juniorInfo={data.user}
    theme={data.theme}
/>

<BookletNav currentStripe={data.user.currentStripe}/>

<TableBody
    activities={data.activities}
    juniorId={data.user.juniorId}
    theme={data.theme}
    adminMode={data.adminMode}
/>
 