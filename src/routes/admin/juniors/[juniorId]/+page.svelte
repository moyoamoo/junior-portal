
<script>
  import Header from '../../../../components/Dashboard/Header.svelte';
  import StatsMain from '../../../../components/Dashboard/Stats/StatsMain.svelte';

  let { data } = $props();
</script>



<StatsMain
  progress={data.progress}
  stats={data.stats}
  log={data.log}
  sessions={data.sessions}
/>
