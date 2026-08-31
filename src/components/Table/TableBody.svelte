<script>
    import Checkbox from "./Checkbox.svelte";

    let { activities, juniorId } = $props();


</script>

<tbody>
    {#each activities as activity (activity.activityId)}
        <tr>
            <th scope="row">{activity.activity}</th>
            <td>{activity.activityType}</td>
            <td></td>
            <Checkbox {activity} {juniorId}/>
        </tr>
    {/each}
</tbody>
