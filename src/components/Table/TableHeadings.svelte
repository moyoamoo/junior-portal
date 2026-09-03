<script>
    let headings = [
        "Activity",
        "Activity Type",
        "Date",
        "Completed",
        "Comments",
    ];
</script>

<tr>
    {#each headings as heading}
        <th scope="col">{heading}</th>
    {/each}
</tr>
