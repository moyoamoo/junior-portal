<script>
    import Modal from "../Modal.svelte";
    import StripeSelect from "./StripeSelect.svelte";
    import { supabase } from "$lib/supabaseClient";
    import { capitalise } from "$lib/utils";

    let { showModal = $bindable(false) } = $props();

    let firstName = $state("");
    let lastName = $state("");
    let selectedStripe = $state("");

    let message = $state({
        message: "",
        submit: false,
    });

    const clearMessage = () => {
        message = {
            message: "",
            submit: false,
        };
    };

    const addJunior = async (event) => {
        event.preventDefault();

        if (!firstName || !lastName || !selectedStripe) {
            message = {
                message: "Please fill in all fields",
                submit: false,
            };

            return;
        }

        const formattedFirstName = capitalise(firstName);
        const formattedLastName = capitalise(lastName);

        const { error } = await supabase.from("Junior").insert({
            first_name: formattedFirstName,
            last_name: formattedLastName,
            current_stripe: selectedStripe,
        });

        if (error) {
            console.error("Failed to add junior", error);

            message = {
                message: "Failed to add junior",
                submit: false,
            };

            return;
        }

        message = {
            message: `${formattedFirstName} has been added!`,
            submit: true,
        };

        firstName = "";
        lastName = "";
        selectedStripe = "";
    };
</script>

<Modal bind:showModal>
    <h2>Add a Junior</h2>
    {#if message.message}
        <div class={message.submit ? "success-message" : "error-message"}>
            <p>{message.message}</p>
        </div>
    {/if}

    <form class="add-junior-form" onsubmit={addJunior}>
        <label for="firstName"> First Name </label>

        <input
            id="firstName"
            type="text"
            bind:value={firstName}
            oninput={clearMessage}
            required
        />

        <label for="lastName"> Last Name </label>

        <input
            id="lastName"
            type="text"
            bind:value={lastName}
            oninput={clearMessage}
            required
        />

        <StripeSelect bind:value={selectedStripe} />

        <button type="submit" class="add-button"> Add Junior </button>
    </form>
</Modal>

<style>
    .add-junior-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }

    .add-button {
        margin-top: 0.5rem;
        padding: 0.7rem;
        background-color: var(--bold-blue);
        color: var(--secondary);
        border: 2px solid var(--primary);
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
    }

    .add-button:hover,
    .add-button:focus {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }

    input {
        padding: 0.6rem;
        border: 1px solid var(--primary);
        border-radius: 6px;
        font-family: inherit;
    }

    input:first-child {
        margin-bottom: 1rem;
    }

    .error-message {
        background-color: #ec8492;
        border-radius: 12px;
    }

    .success-message {
        background-color: #88d4a3;
        border-radius: 12px;
        color: var(--primary);
    }

    .error-message p,
    .success-message p {
        text-align: center;
        font-weight: bold;
    }

    .error-message p {
        color: var(--secondary);
    }
</style>
