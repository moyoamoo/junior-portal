<script>
    import { supabase } from "$lib/supabaseClient";
    import Message from "./Message.svelte";
    import StripeSelect from "./StripeSelect.svelte";
    import SubmitBtn from "./SubmitBtn.svelte";

    let { junior } = $props();
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

        const { error } = await supabase
            .from("Junior")
            .delete()
            .eq("junior_id", junior.juniorId)
            .select();

        if (error) {
            console.error("Failed to delete junior", error);

            message = {
                message: "Failed to delete junior",
                submit: false,
            };

            return;
        }

        message = {
            message: `${junior.firstName}'s' has been deleted!`,
            submit: true,
        };
    };
</script>

<div>
    <Message {message} />
    <h2>Are you sure you want to delete {junior.firstName}?</h2>
    <p>
        Deactiviating a junior instead allows their information to be restored
    </p>
    <form action="" onsubmit={deleteJunior}>
        <button class="secondary-btn">No</button>
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
        width:40%;
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
