<script>
    import codey from "$lib/assets/codey_waving.png";

    let { form } = $props();
    let email = $state("");
    let password = $state("");
</script>


<section class="main-section">
    <div class="login-container">
        <form method="POST">
            <div class="login-top">
                <img
                    alt="Codey Waving"
                    src={codey}
                    class="codey-waving-login"
                />
                <h2 class="login-header">Welcome!</h2>
            </div>

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
</section>
