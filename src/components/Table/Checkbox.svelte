<script>

    let { activity, theme, onComplete } = $props();

    let checkboxColour = $derived(theme["--stripe-primary"] || "#C77E0A");

</script>

<td class="completed">
    <label class="container" style={`--stripe-checkmark-bg: ${checkboxColour}`}>
        <input
            type="checkbox"
            disabled={activity.completed}
            checked={activity.completed}
            onclick={onComplete}
        />
        <div class="checkmark"></div>
    </label>
</td>
