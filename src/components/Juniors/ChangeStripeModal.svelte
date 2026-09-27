<script>
    import { supabase } from "$lib/supabaseClient";
    import Message from "./Message.svelte";
    import StripeSelect from "./StripeSelect.svelte";
    import SubmitBtn from "./SubmitBtn.svelte";

    let { junior, onSuccess } = $props();
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

        // Update parent state
        onSuccess(junior.juniorId, selectedStripe); 

        message = {
            message: `${junior.firstName}'s stripe has been changed to ${selectedStripe}!`,
            submit: true,
        };

        selectedStripe = "";
    };
</script>

<div class="modal-container">
    <Message {message} />
    <form class="add-junior-form" onsubmit={changeStripe}>
        <p>{junior.firstName}'s current stripe: {junior.currentStripe}</p>
        <StripeSelect bind:value={selectedStripe} oninput={clearMessage} />
        <SubmitBtn buttonText={"Save Stripe"} />
    </form>
</div>

<style>
    .modal-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    p{
        text-align: center;
    }
    
</style>
