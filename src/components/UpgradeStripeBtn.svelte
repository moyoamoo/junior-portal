<script>
    import Modal from "./Modal.svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    let { juniorId, theme } = $props();
    let showModal = $state(false);
    let errorMessage = $state("");
</script>

<div class="move-stripe-btn-container">
    <button class="move-stripe-btn" onclick={() => (showModal = true)}>
        Move to Next Stripe
    </button>
</div>

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
                    console.log("Admin login result:", result);

                    if (result.type === "failure") {
                        errorMessage =
                            result.data?.message ?? "Invalid credentials.";
                        return;
                    }

                    if (result.type === "error") {
                        console.error("Admin login error:", result.error);
                        errorMessage =
                            "Something went wrong. Please try again.";
                        return;
                    }

                    if (result.type === "redirect") {
                        showModal = false;
                        await goto(`/booklet/${juniorId}/congratulations`);
                    }
                }}
        >
            <input
                type="hidden"
                name="returnTo"
                value={`/booklet/${juniorId}/congratulations`}
            />

            <label for="admin-email">Email</label>
            <input
                class="modal-input"
                id="admin-email"
                type="email"
                name="email"
                required
            />

            <label for="admin-password">Password</label>
            <input
                class="modal-input"
                id="admin-password"
                type="password"
                name="password"
                required
            />

            <button type="submit" class="admin-mode-btn">Continue</button>
        </form>
    </div>
</Modal>

<style>
    .move-stripe-btn-container {
        display: flex;
        justify-content: center;
    }
    .move-stripe-btn {
        color: var(--secondary);
        font-family: "Comfortaa", sans-serif;
        font-weight: bold;
        font-size: 1rem;
        text-align: center;

        background-color: var(--stripe-primary);
        padding: 1rem 1.5rem;
        margin-top: 2rem;
        margin-bottom: 2rem;

        border: 2px solid var(--primary);
        border-radius: 12px;
        cursor: pointer;

        position: relative;

        /* Tactile 3D effect */
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            6px 6px 0 var(--primary);

        transition:
            transform 0.1s ease,
            box-shadow 0.1s ease;
    }

    .move-stripe-btn:hover {
        filter: brightness(1.05);
        animation: jiggle 0.4s ease-in-out;
    }

    .move-stripe-btn:active {
        transform: translate(6px, 6px);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            0 0 0 var(--primary);
    }

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
    .modal-input {
        padding: 0.6rem;
        border: 1px solid var(--primary);
        border-radius: 6px;
        font-family: inherit;
    }
    .admin-mode-btn {
        margin-top: 0.5rem;
        padding: 0.7rem;
        background-color: var(--primary);
        color: var(--secondary);
        border: 2px solid var(--primary);

         background-color: var(--junior-primary);
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
       font-weight: bold;
    }

    .admin-mode-btn:hover,
    .admin-mode-btn:focus {
        background-color: var(--junior-secondary);
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }
    .error-message {
        background-color: var(--error);
        border-radius: 12px;
    }

    .modal-input:hover,
    .modal-input:focus {
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }

    .error-message p {
        padding: 1rem;
        text-align: center;
        color: var(--secondary);
        font-weight: bold;
    }
</style>
