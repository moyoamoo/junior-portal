<script>
    import { supabase } from "$lib/supabaseClient";
    import { capitalise } from "$lib/utils";
    let firstName = $state("");
    let lastName = $state("");
    let selectedStripe = $state("");
    let message = $state({ message: "", submit: false });

    const clearMessage = () => {
        message = { message: "", submit: false };
    };

    const addJunior = async (e) => {
        e.preventDefault();

        //return if not all information
        if (!firstName || !lastName || !selectedStripe) {
            message.message = "Please fill in all fields";
            return;
        }

        //format form data
        let formattedFirstName = capitalise(firstName);
        let formattedLastName = capitalise(lastName);

        //add junior to database
        const { data, error } = await supabase
            .from("Junior")
            .insert({
                first_name: formattedFirstName,
                last_name: formattedLastName,
                current_stripe: selectedStripe,
            })
            .select("junior_id")
            .single();

        //if error revert back
        if (error) {
            console.error("Failed to add junior", error);
            message = "Failed to add junior";
            return;
        }

        //send success message to user
        message.submit = true;
        message.message = `${formattedFirstName} has been added!`;

        firstName = "";
        lastName = "";
        selectedStripe = "";
    };
</script>

<section>
    {#if message.message != ""}
        <div class={message.submit ? "success-message" : "error-message"}>
            <p>{message.message}</p>
        </div>
    {/if}
    <form action="POST" class="add-junior-form" onsubmit={addJunior}>
        <label for="firstName" class="login-label"> First Name</label>
        <input
            type="text"
            name="firstName"
            id="firstName"
            class="admin-login-input"
            bind:value={firstName}
            oninput={clearMessage}
            required
        />

        <label for="lastName" class="login-label">Last Name</label>
        <input
            type="text"
            name="lastName"
            id="lastName"
            class="admin-login-input"
            bind:value={lastName}
            oninput={clearMessage}
            required
        />

        <select
            name="admin-stripe-select"
            id="admin-stripe-select"
            class="admin-stripe-select"
            oninput={clearMessage}
            bind:value={selectedStripe}
            required
        >
            <option value="">Choose a Stripe</option>
            <option value="bumblebee">Bumblebee</option>
            <option value="chipmunk">Chipmunk</option>
            <option value="wildcat">Wildcat</option>
            <option value="clownfish">Clownfish</option>
            <option value="skunk">Skunk</option>
            <option value="zebra">Zebra</option>
            <option value="tiger">Tiger</option>
        </select>

        <button type="submit" class="admin-login-button">Add Junior</button>
    </form>
</section>

<style>
    .add-junior-form {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .admin-login-button {
        padding: 0.5rem;
        background-color: var(--code-ninjas-blue-main);
        color: var(--secondary);
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        margin-top: 0.4rem;
        transition: all 0.3s;
        text-transform: uppercase;
        border: 2px solid var(--primary);
    }

    .admin-login-button:hover,
    .admin-login-button:focus {
        background-color: var(--code-ninjas-blue-accent);
        box-shadow: 4px 4px 0px var(--primary);
        transform: translate(-2px, -2px);
    }

    .admin-login-input {
        width: 90%;
        padding: 0.5rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
        margin-bottom: 0.5rem;
    }

    input:first-child {
        margin-bottom: 1rem;
    }

    .admin-stripe-select {
        padding: 0.7rem;
        background-color: var(--secondary);
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        border: 2px solid var(--primary);
    }

    .admin-stripe-select:focus {
        box-shadow: 4px 4px 0px var(--primary);
    }

    .error-message {
        background-color: #ec8492;
        border-radius: 12px;
    }

    .success-message {
        background-color: #84eca8;
        border-radius: 12px;
        color: var(--primary);
    }

    .error-message p,
    .success-message p {
        padding: 1rem;
        text-align: center;
        font-weight: bold;
    }

    .error-message p {
        color: var(--secondary);
    }
</style>
