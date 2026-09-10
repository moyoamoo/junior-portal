<script>
	let { showModal = $bindable(), children } = $props();

	let dialog = $state();

	$effect(() => {
		if (showModal) {
			dialog.showModal();
		} else if (dialog?.open){
			dialog.close();
		}
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) {
			dialog.close();
		}
	}}
>
	{@render children?.()}

	<button
	    type="button"
		onclick={() => dialog.close()}
		aria-label="Close"
		class="modal-btn-close"
		><i class="fa-solid fa-x" style="color: #ffffff;"></i></button
	>
</dialog>

<style>
	dialog {
		width: 25rem;
		height: 25rem;
		border-radius: 0.2em;
		padding: 1rem;
		border: 2px solid var(--primary);
		border-radius: 12px;
		box-shadow: 6px 6px 0 var(--primary);

		position: relative;
		overflow: visible;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-btn-close {
		position: absolute;
		top: -1rem;
		right: -1rem;

		background-color: #e74c61;
		border-radius: 50%;
		height: 2.3em;
		width: 2.3em;
		font-size: 15px;

		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border: 2px solid var(--primary);

        box-shadow: 3px 2px 0px var(--primary);
	}

	.modal-btn-close:hover,
	.modal-btn-close:focus{
		background-color: #ed6879;
	}
</style>
