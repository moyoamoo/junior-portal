<script>
    let { comment, onclick } = $props();
</script>

<td
    >{#if comment}
        <button class="comments-btn-add" aria-label="View Comment" {onclick}
            ><i class="fa-solid fa-eye" style="color: #ffffff;"></i></button
        >
    {:else}
        <button class="comments-btn-view" aria-label="Add Comment" {onclick}
            ><i class="fa-solid fa-plus" style="color: #ffffff;"></i></button
        >
    {/if}
</td>

<style>
    .comments-btn-view,
    .comments-btn-add {
        background-color: var(--stripe-primary);
        border-radius: 50%;
        height: 2.3em;
        width: 2.3em;
        top: 0;
        left: 0;
        border: none;
        font-size: 20px;
        margin: 0.4rem;
    }

    .comments-btn-view:hover,
    .comments-btn-add:hover {
        background-color: var(--stripe-quaternary);
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }
</style>
