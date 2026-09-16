<script>
    import Modal from "./Modal.svelte";
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    
    let { juniorId } = $props();
    let showModal = $state(false);
    let errorMessage = $state("");
</script>

<button onclick={() => (showModal = true)}> Move to Next Stripe </button>

<Modal bind:showModal>
    <div class="admin-mode">
        <h2>Move to Next Stripe</h2>
        <p>For Sensei eyes only</p>

        {#if errorMessage}
            <div class="error-message">
                <p>{errorMessage}</p>
            </div>
        {/if}

        <form
            method="POST"
            action="/admin-mode?/login"
            use:enhance={() =>
                async ({ result }) => {
                    if (result.type === "failure") {
                        errorMessage =
                            result.data?.message ?? "Invalid credentials.";
                        return;
                    }

                    if (result.type === "redirect") {
                        window.location.href = result.location;
                    }
                }}
        >
            <input
                type="hidden"
                name="returnTo"
                value={`/booklet/${juniorId}/congratulations`}
            />

            <label for="admin-email">Email</label>
            <input id="admin-email" type="email" name="email" required />

            <label for="admin-password">Password</label>
            <input
                id="admin-password"
                type="password"
                name="password"
                required
            />

            <button type="submit">Continue</button>
        </form>
    </div>
</Modal>

<style>
    .admin-mode {
        width: 100%;
    }
    .admin-mode h2 {
        margin: 0 0 0.5rem;
        text-align: center;
    }
    .admin-mode p {
        text-align: center;
        margin-bottom: 1rem;
        color: var(--code-ninjas-blue-dark);
    }
    .admin-mode form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }
    .admin-mode input {
        padding: 0.6rem;
        border: 1px solid var(--primary);
        border-radius: 6px;
        font-family: inherit;
    }
    .admin-mode form button {
        margin-top: 0.5rem;
        padding: 0.7rem;
        background-color: var(--primary);
        color: var(--secondary);
        border: 2px solid var(--primary);

        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
    }

    .admin-mode form button:hover,
    .admin-mode form button:focus {
        box-shadow: 4px 4px 0px var(--primary);
        background-color: var(--bold-blue);
    }
    .error-message {
        background-color: #ec8492;
        border-radius: 12px;
    }

    .error-message p {
        padding: 1rem;
        text-align: center;
        color: var(--secondary);
        font-weight: bold;
    }
</style>
