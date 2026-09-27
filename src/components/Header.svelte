<script>
    import Modal from "./Modal.svelte";
    import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import headerBackground from "$lib/assets/header-background.svg";
    import logo from "$lib/assets/logo.svg";

    let { form, adminMode = false } = $props();

    let showAdminMode = $state(false);
    let errorMessage = $state("");
</script>

<header class="header">
    <a href="/juniors">
        <img class="logo" src={logo} alt="" aria-hidden="true" /></a
    >

    <nav>
        <a href="/juniors">Home</a>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>
        {#if adminMode}
            <form method="POST" action="/admin-mode?/logout">
                <input
                    type="hidden"
                    name="returnTo"
                    value={page.url.pathname}
                /> <button type="submit"> Leave Admin Mode </button>
            </form>
        {:else}
            <button
                type="button"
                onclick={() => {
                    errorMessage = "";
                    showAdminMode = true;
                }}
            >
                Admin Mode
            </button>
        {/if} <a href="/admin">Admin</a>
    </nav>
</header>

{#if !adminMode}
    <Modal bind:showModal={showAdminMode}>
        <div class="admin-mode">
            <div class="login-top">
                <h2>Admin Mode</h2>
                <p>For Sensei eyes only</p>
            </div>

            {#if errorMessage}
                <div class="error-message">
                    <p>
                        {errorMessage}
                    </p>
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
                    value={page.url.pathname}
                />

                <label class="login-label" for="admin-email"> Email </label>

                <input
                    class="login-input admin-mode-input"
                    id="admin-email"
                    type="email"
                    name="email"
                    required
                />

                <label class="login-label" for="admin-password">
                    Password
                </label>

                <input
                    class="login-input admin-mode-input"
                    id="admin-password"
                    type="password"
                    name="password"
                    required
                />

                <button type="submit" class="login-button">
                    Enter Admin Mode
                </button>
            </form>
        </div>
    </Modal>
{/if}

<style>
    header {
        background-color: var(--secondary);
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5rem;
    }
    nav {
        height: 100%;
        display: flex;
        justify-content: right;
        align-items: center;
    }

    nav button {
        background-color: transparent;
        color: var(--primary);
        outline: none;
        border: none;
        font-size: 1rem;
        font-family: "Comfortaa", sans-serif;
        cursor: pointer;
        font-weight: bold;
    }
    nav a {
        text-decoration: none;
        color: var(--primary);
        padding: 1rem;
        font-size: 1rem;
        font-weight: bold;
    }
    .admin-mode {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .admin-mode-input{
        margin-bottom: 1rem;
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
