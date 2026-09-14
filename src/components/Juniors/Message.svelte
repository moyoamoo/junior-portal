<script>
    let {message} = $props();
</script>
    
    {#if message.message}
        <div class={message.submit ? "success-message" : "error-message"}>
            <p>{message.message}</p>
        </div>
    {/if}

    <style>

    .error-message {
        background-color: var(--error);
        border-radius: 12px;
    }

    .success-message {
        background-color: var(--success);
        border-radius: 12px;
        color: var(--primary);
    }

    .error-message p,
    .success-message p {
        text-align: center;
        font-weight: bold;
    }

    .error-message p {
        color: var(--secondary);
    }
    </style>