<script>
    let headings = ["Activity", "Activity Type", "Date", "Completed", "Comments"]
</script>


{#each headings as heading}
    <th scope="col">{heading}</th>
{/each}
