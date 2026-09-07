<script>
    import codey from "$lib/assets/codey_waving.png";
    import logo from "$lib/assets/codeninjas.png";

    let { form } = $props();
    let email = $state("");
    let password = $state("");
</script>

<section class="main-section">
    <div class="login-container">
        <form method="POST">
            <div class="login-top">
                <img alt="Codey Waving" src={logo} class="login-top-img" />
                <h2 class="login-header">Admin</h2>
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

    .login-container {
        max-width: 400px;
        border: 1px solid var(--primary);
        box-shadow: 6px 6px 0 var(--code-ninjas-blue-main);
    }
   
</style>
