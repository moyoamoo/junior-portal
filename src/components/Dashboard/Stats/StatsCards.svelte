<script>
  let { cardTitle, cardBody } = $props();
</script>

<div class="card">
  <span class="label">{cardTitle}</span>
  <strong>{cardBody}</strong>
</div>

<style>
  .card {
    padding: 1rem;
    box-shadow: var(--shadow);
    border-radius: 12px;
    border: 2px solid var(--primary);
    background-color: var(--secondary);
  }

  .label {
    display: block;
    font-size: 0.85rem;
    opacity: 0.7;
  }
</style>
