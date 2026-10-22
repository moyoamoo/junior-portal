<script>
    import logo from "$lib/assets/logo.svg";
</script>

<header class="header">
    <a href="/juniors">
        <img class="logo" src={logo} alt="" aria-hidden="true" /></a
    >

    <nav>
        <a href="/juniors">Leave Admin Mode</a>
        <a href="admin/juniors">Manage Juniors</a>
        <a href="admin/activites">Manage Activities</a>
        <a href="admin/accounts">Manage Accounts</a>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>
    </nav>
</header>

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

    

</style>
