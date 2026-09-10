```svelte
<script>
    import Modal from "$lib/components/Modal.svelte";

    let { form } = $props();

    let showAdminMode = $state(false);
</script>

<header class="header">
    <nav>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>

        <button
            type="button"
            onclick={() => (showAdminMode = true)}
        >
            Admin Mode
        </button>

        <a href="/admin">Admin</a>
    </nav>
</header>


<Modal bind:showModal={showAdminMode}>
    <div class="admin-mode">
        <h2>Admin Mode</h2>

        <p>Enter your credentials to enable Admin Mode.</p>

        <form method="POST" action="/admin-mode?/login">
            <label for="admin-email">
                Email
            </label>

            <input
                id="admin-email"
                type="email"
                name="email"
                required
            />

            <label for="admin-password">
                Password
            </label>

            <input
                id="admin-password"
                type="password"
                name="password"
                required
            />

            {#if form?.message}
                <p class="error-message">
                    {form.message}
                </p>
            {/if}

            <button type="submit">
                Enter Admin Mode
            </button>
        </form>
    </div>
</Modal>


<style>
    header {
        background-color: var(--code-ninjas-blue-dark);
        height: 7vh;
    }

    nav {
        height: 100%;
        display: flex;
        justify-content: right;
        align-items: center;
    }

    nav button {
        background-color: var(--code-ninjas-blue-dark);
        color: var(--secondary);
        outline: none;
        border: none;
        font-size: 1rem;
        font-family: "Comfortaa", sans-serif;
        cursor: pointer;
    }

    nav a {
        text-decoration: none;
        color: var(--secondary);
        padding: 1rem;
        font-size: 1rem;
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
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
    }

    .error-message {
        color: #e74c61;
        font-size: 0.9rem;
        margin: 0;
    }
</style>
```
