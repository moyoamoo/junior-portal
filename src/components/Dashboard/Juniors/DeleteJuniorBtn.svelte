<script>
    let { onclick, junior } = $props();
</script>

<button
    type="button"
    aria-label="Delete"
    onclick={() => {
        onclick(junior);
    }}
    ><i class="fa-solid fa-trash" style="color: rgb(255, 255, 255);"
    ></i></button
>

<style>
    button {
        background-color: var(--code-ninjas-blue-dark);
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

    button:focus,
    button:hover {
        background-color: var(--error);
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }
</style>
