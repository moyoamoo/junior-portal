<script>
    import Checkbox from "./Checkbox.svelte";
    import Date from "./Date.svelte"

    let { activities, juniorId } = $props();


</script>

<tbody>
    {#each activities as activity (activity.activityId)}
        <tr>
            <th scope="row">{activity.activity}</th>
            <td>{activity.activityType}</td>
            <Date {activity}/>
            <Checkbox {activity} {juniorId}/>
        </tr>
    {/each}
</tbody>
