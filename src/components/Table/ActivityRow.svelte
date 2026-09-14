<script>
    import Checkbox from "./Checkbox.svelte";
    import Date from "./Date.svelte";
    import CommentBtn from "./CommentBtn.svelte";

    let { activity, juniorId, theme, onComment, handleComplete, adminMode } = $props();
</script>

<tr>
    <th scope="row">{activity.activity}</th>

    <td>{activity.activityType}</td>
    <CommentBtn comment={activity.comment} onclick={onComment} />

    <Date {activity} />

    <Checkbox
        {activity}
        {theme}
        {adminMode}
        onComplete={(checked) => handleComplete(activity.activityId, checked)}
    />
</tr>

<style>
    tr:hover {
        color: var(--stripe-text-hover);
    }

    tr:nth-child(even) {
        background-color: var(--stripe-tertiary);
    }
</style>
