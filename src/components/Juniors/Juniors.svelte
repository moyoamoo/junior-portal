<script>
    let { users } = $props();
</script>

<section>
    <ul>
        {#each users as user (user.juniorId)}
            <a href="/booklet/{user.juniorId}">
                <li>{user.firstName} {user.lastName}</li>
            </a>
        {/each}
    </ul>
</section>
