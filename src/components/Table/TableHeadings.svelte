<script>
    let headings = ["Activity", "Activity Type", "Date", "Completed"]
</script>


{#each headings as heading}
    <th scope="col">{heading}</th>
{/each}
