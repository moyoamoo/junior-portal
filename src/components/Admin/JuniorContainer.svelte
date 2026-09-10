<script>
    import ButtonContainer from "./ButtonContainer.svelte";
</script>

<section class="junior-admin-container">
    <h2>Juniors</h2>
    <ButtonContainer />
</section>

<style>
    .junior-admin-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        flex-grow: 0;
        height: 70dvh;
        border: 2px solid var(--code-ninjas-blue-main);
        box-shadow: 4px 4px 0 var(--code-ninjas-blue-main);
        background-color: var(--secondary);
        border-radius: 25px;
        width: 70%;
        margin: 0 auto;
    }
</style>
