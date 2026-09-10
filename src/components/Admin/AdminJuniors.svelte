<script>
    let { users } = $props();
</script>

<table>
    <thead>
        <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Current Stripe</th>
            <th scope="col">Account Creation Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            {#each users as junior (junior.juniorId)}
                <th>{junior.firstName}</th>
                <th>{junior.lastName}</th>
                <th>{junior.currentStripe}</th>
                <th>
                    {junior.dateCreated}
                </th>
            {/each}
        </tr>
    </tbody>
</table>
