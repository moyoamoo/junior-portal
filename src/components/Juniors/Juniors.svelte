<script>
    let { foundJuniors } = $props();
</script>

<section class="junior-container">
    <div class="junior-containter-list">
        {#if foundJuniors.length == 0}
            <p>No Juniors found</p>
        {:else}
            {#each foundJuniors as user (user.juniorId)}
                <a href="/booklet/{user.juniorId}" class="junior-link">
                    {user.firstName}
                    {user.lastName}
                </a>
            {/each}
        {/if}
    </div>
</section>

<style>
    .junior-container {
        width: 80%;
        margin: 0 auto;
    }

    .junior-containter-list {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: var(--secondary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        border: 2px solid var(--primary);
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .junior-link {
        width: 100%;
        padding: 1rem;
        text-decoration: none;
        color: var(--primary);
        padding-left: 3rem;
    }

    .junior-link:nth-child(odd) {
        background-color: var(--tertiary);
    }

    .junior-link:hover {
        color: var(--code-ninjas-blue-dark);
    }
</style>