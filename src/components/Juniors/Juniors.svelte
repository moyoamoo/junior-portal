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
                    <span class="junior-link-name">
                        {user.firstName}
                        {user.lastName.substring(0, 1)}</span
                    >
                    <span class="junior-link-current-stripe"
                        >{user.currentStripe}</span
                    >
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
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: var(--secondary);
        box-shadow: var(--shadow);
        border-radius: 12px;
        border: 2px solid var(--primary);
        flex-shrink: 0;
        scrollbar-color: var(--junior-primary) transparent;
    }
    .junior-link {
        box-sizing: border-box;
        width: 100%;
        padding: 1rem;
        padding-left: 3rem;
        text-decoration: none;
        color: var(--primary);
        display: flex;
        justify-content: space-between;
    }

    .junior-link:nth-child(odd) {
        background-color: #f7eefa;
    }

    .junior-link:hover {
        color: var(--code-ninjas-blue-dark);
    }

    .junior-link-current-stripe {
        text-align: left;
        flex: 0 0 12rem;
    }

    .junior-link-name{
        font-weight: bold;
    }

    .junior-container {
        max-width: 800px;
    }
</style>
