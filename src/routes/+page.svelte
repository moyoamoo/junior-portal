<script>
    import codey from "$lib/assets/codey_waving.png";
    import logo from "$lib/assets/codeninjas.png";
    import leftCodey from "$lib/assets/frontpagecodey.png"
    import rightCodet from "$lib/assets/frontpagecodey2.png"

    let { form } = $props();
    let email = $state("");
    let password = $state("");
</script>

<section class="main-section">
    <div class="login-container">
        <form method="POST">
            <div class="login-top">
                <img alt="Codey Waving" src={logo} class="login-top-img" />
                <h2 class="login-header">Welcome!</h2>
            </div>
            {#if form?.message}
                <div class="login-error-message">
                    <p>{form.message}</p>
                </div>
            {/if}
            <div class="input-group">
                <label for="email" class="login-label">Email</label>
                <input
                    class="login-input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    id="email"
                    bind:value={email}
                    required
                />
            </div>
            <div class="input-group">
                <label for="password" class="login-label">Password</label>
                <input
                    class="login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="password"
                    bind:value={password}
                    required
                />
            </div>

            <button type="submit" class="login-button">Sign In</button>
        </form>
    </div>

    <img class="form-img-bottom" src={codey} alt="Codey Waving" />
</section>

<style>

    .login-error-message{
        background-color: #ec8492;
        border-radius: 12px;

    }

     .login-error-message p {
        padding: 1rem;
        text-align: center;
        color: var(--secondary);
        font-weight: bold;
    }
</style>