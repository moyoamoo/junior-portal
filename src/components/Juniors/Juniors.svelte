<script>
    let { users } = $props();
</script>

<section class="main-junior-section">
    <ul class="junior-link-group"> 
        {#each users as user (user.juniorId)}
            <a href="/booklet/{user.juniorId}"  class="junior-link">
                <li >{user.firstName} {user.lastName}</li>
            </a>
        {/each}
    </ul>
</section>
