<script>
    import codey from "$lib/assets/codey_waving.png";
    import logo from "$lib/assets/codeninjas.png";
    import leftCodey from "$lib/assets/frontpagecodey.png";
    import rightCodet from "$lib/assets/frontpagecodey2.png";
    import jrDots from "$lib/assets/jr_dots.png";
    import jrLogo from "$lib/assets/jr_logo.png"

    let { form } = $props();
    let email = $state("");
    let password = $state("");
</script>

<section class="main-section">
    <img src={jrDots} aria-hidden="true" alt="" class="jr-dots-background" />
    <div class="login-container">
        <form method="POST">
            <div class="login-top">
            <img src={jrLogo} alt="">
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
    .main-section {
        background: linear-gradient(180deg, #a03497, #302467);
        min-height: 100dvh;

        position: relative;
        overflow: hidden;
        isolation: isolate;

        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px;
    }

    .jr-dots-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.35;
        z-index: -1;
        pointer-events: none;
    }

    .login-error-message {
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
