<script>
    import Checkbox from "./Checkbox.svelte";

    let {activities} = $props();

</script>

<tbody>
    {#each activities as activity (activity.activityId)}
        <tr>
            <th scope="row">{activity.activity}</th>
            <td>{activity.activityType}</td>
            <td></td>
            <Checkbox {juniorId} {activity}/>
            
        </tr>
    {/each}
</tbody>
