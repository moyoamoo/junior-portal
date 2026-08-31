<script>
    import Checkbox from "./Checkbox.svelte";

    let { activities, juniorId } = $props();

    let localActivites = $state([]);

    $effect(() => {
        localActivites = [...activities];
    });

    function handleToggle(activityId, newValue) {
        localActivites.forEach((activity) => {
            if (activity.activityId === activityId) {
                activity.completed = newValue;
            }
        });
    }
</script>

<tbody>
    {#each activities as activity (activity.activityId)}
        <tr>
            <th scope="row">{activity.activity}</th>
            <td>{activity.activityType}</td>
            <td></td>
            <Checkbox {activity} {juniorId} onToggle={handleToggle}/>
        </tr>
    {/each}
</tbody>
