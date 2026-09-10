<script>
    let { onclick } = $props();
</script>

<div class="add-btn-container">
    <label for="add-junior">Add Junior</label>

    <button
        name="add-junior"
        id="add-junior"
        class="add-junior-btn"
        aria-label="Add Junior"
        {onclick}
        ><i class="fa-solid fa-plus" style="color: #ffffff;"></i></button
    >
</div>

<style>
    .add-btn-container {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        justify-content: center;
        align-items: center;
    }
    .add-junior-btn {
        background-color: var(--bold-blue);
        border-radius: 50%;
        height: 2.3em;
        width: 2.3em;
        top: 0;
        left: 0;
        border: none;
        font-size: 20px;
        margin: 0.4rem;
        cursor: pointer;
    }

    .add-junior-btn:focus,
    .add-junior-btn:hover {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }
</style>
