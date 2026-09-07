<header class="header">
    <nav>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>
        <a href="/admin">Admin</a>
    </nav>
</header>

<style>
    header {
        background-color: var(--code-ninjas-blue-dark);
        height: 2vh;
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
    }

    nav a {
        text-decoration: none;
        color: var(--secondary);
        padding: 1rem;
        font-size: 1rem;
    }
</style>
