<script>
    import { supabase } from "$lib/supabaseClient";
    import StripeSelect from "./StripeSelect.svelte";
    import SubmitBtn from "./SubmitBtn.svelte";

    let { junior } = $props();
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

    const changeStripe = async (event) => {
        event.preventDefault();

        if (!selectedStripe) {
            message = {
                message: "Please select a stripe",
                submit: false,
            };

            return;
        }

        const { error } = await supabase
            .from("Junior")
            .update({
                current_stripe: selectedStripe,
            })
            .eq("junior_id", junior.juniorId)
            .select()
            .single();

        if (error) {
            console.error("Failed to change stripe", error);

            message = {
                message: "Failed to add junior",
                submit: false,
            };

            return;
        }

        message = {
            message: `${junior.firstName} stripe has been chanegd to ${selectedStripe}!`,
            submit: true,
        };

        selectedStripe = "";
    };
</script>

<div class="modal-comtainer">
    {#if message.message}
        <div class={message.submit ? "success-message" : "error-message"}>
            <p>{message.message}</p>
        </div>
    {/if}

    <form class="add-junior-form" onsubmit={changeStripe}>
        <p>{junior.firstName}'s current stripe: {junior.currentStripe}</p>
        <StripeSelect bind:value={selectedStripe} oninput={clearMessage} />
        <SubmitBtn buttonText={"Save Stripe"} />
    </form>
</div>

<style>
    .modal-comtainer {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    form {
        display: flex;
        flex-direction: column;
        width: 70%;
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
