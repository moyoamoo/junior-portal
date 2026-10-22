<script>
    let {cardTitle, cardBody} = $props();
</script>


<div class="card">
    <span class="label">{cardTitle}</span>
    <strong>{cardBody}</strong>
</div>

<style>
    .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

    .label {
    display: block;
    font-size: 0.85rem;
    opacity: 0.7;
  }
</style>