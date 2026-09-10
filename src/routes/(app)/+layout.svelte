<script>
   import Header from "../../components/Header.svelte";

    let { data, children } = $props();
</script>

<Header adminMode={data.adminMode} />

{@render children()}