<script>
    import { supabase } from "$lib/supabaseClient";
    import Message from "../../Juniors/Message.svelte";
    import StripeSelect from "../../Juniors/StripeSelect.svelte";
    import SubmitBtn from "../../Juniors/SubmitBtn.svelte";

    let { junior, onSuccess, onClose } = $props();
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

    const deleteJunior = async (event) => {
        event.preventDefault();

        // Delete junior from supabase
        const { error } = await supabase
            .from("Junior")
            .delete()
            .eq("junior_id", junior.juniorId)
            .select();

        if (error) {
            console.error("Failed to delete junior", error);

            // Show failure message
            message = {
                message: "Failed to delete junior",
                submit: false,
            };

            return;
        }

        // Remove junior from parent state
        onSuccess(junior.juniorId);
    };
</script>

<div>
    <Message {message} />
    <h2>Are you sure you want to delete {junior.firstName}?</h2>
    <p>
        Deactiviating a junior instead allows their information to be restored
    </p>

    <button class="secondary-btn" onclick={onClose} type="button">No</button>
    <form action="" onsubmit={deleteJunior}>
        <button type="submit" class="submit-btn"
            >I'm sure, delete {junior.firstName}</button
        >
    </form>
</div>

<style>
    .submit-btn,
    .secondary-btn {
        margin-top: 0.5rem;
        padding: 0.7rem;
        width: 40%;
        color: var(--secondary);
        border: 2px solid var(--primary);
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
    }

    .submit-btn:hover {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }

    .submit-btn {
        background-color: var(--error);
    }

    .secondary-btn {
        background-color: var(--highlight-blue);
    }
</style>
