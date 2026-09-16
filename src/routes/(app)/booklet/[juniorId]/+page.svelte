<script>
    import Welcome from "../../../../components/Welcome.svelte";
    import TableBody from "../../../../components/Table/TableBody.svelte";
    import Header from "../../../../components/Header.svelte";
    import BookletNav from "../../../../components/BookletNav.svelte";
    import StripeUpgradeBtn from "../../../../components/UpgradeStripeBtn.svelte"
    import UpgradeStripeBtn from "../../../../components/UpgradeStripeBtn.svelte";

    let { data } = $props();
    let activities = $state(data.activities);
    let showStripeModal = $state(false);

    let allComplete = $derived(
        activities.length > 0 &&
            activities.every((activity) => activity.completed === true),
    );
</script>

<Welcome
    activities={data.activities}
    juniorInfo={data.user}
    theme={data.theme}
/>

<BookletNav currentStripe={data.user.currentStripe} />

<TableBody
    activities={data.activities}
    juniorId={data.user.juniorId}
    theme={data.theme}
    adminMode={data.adminMode}
    onActivitiesChange={(updatedActivities) => {
        activities = updatedActivities;
    }}
/>

{#if allComplete && !data.adminMode}
    <UpgradeStripeBtn />
{/if}
