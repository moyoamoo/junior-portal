<script>
    let { progress } = $props();

    // Calculate the completion percentage reactively.\
    const percent = $derived(
        progress.total > 0
            ? Math.round((progress.completed / progress.total) * 100)
            : 0,
    );
</script>

<h2>{progress.stripeName} progress</h2>

<progress value={progress.completed} max={progress.total || 1}></progress>

<p>
    {progress.completed} of {progress.total} tasks ({percent}%)
</p>

<style>
    progress {
        width: 100%;
    }
</style>
