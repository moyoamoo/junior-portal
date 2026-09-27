<script>
    import Welcome from "../../../../components/Welcome.svelte";
    import TableBody from "../../../../components/Table/TableBody.svelte";
    import Header from "../../../../components/Header.svelte";
    import BookletNav from "../../../../components/BookletNav.svelte";
    import StripeUpgradeBtn from "../../../../components/UpgradeStripeBtn.svelte";
    import UpgradeStripeBtn from "../../../../components/UpgradeStripeBtn.svelte";

    let { data } = $props();
    let activities = $state(data.activities);
    let showStripeModal = $state(false);

    let allComplete = $derived(
        activities.length > 0 &&
            activities.every((activity) => activity.completed === true),
    );
</script>

<BookletNav
    stripes={data.stripes}
    currentStripe={data.currentStripe}
    viewingStripe={data.viewingStripe}
/>

<Welcome
    activities={data.activities}
    juniorInfo={data.user}
    theme={data.theme}
    viewingStripe={data.viewingStripe}
/>


<TableBody
    activities={data.activities}
    juniorId={data.user.juniorId}
    theme={data.theme}
    adminMode={data.adminMode}
    onActivitiesChange={(updatedActivities) => {
        activities = updatedActivities;
    }}
/>

{#if allComplete && !data.adminMode && data.currentStripe == data.viewingStripe}
    <UpgradeStripeBtn
        juniorId={data.user.juniorId}
        theme={data.theme}
        junior={data.user}
    />
{/if}
