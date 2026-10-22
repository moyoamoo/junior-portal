
<script>
  import { formatDateDashboard } from '$lib/utils.js';
  import ProgressBar from './ProgressBar.svelte';
  import StatsCards from './StatsCards.svelte';
    import StatsTable from './StatsTable.svelte';

  let { progress, stats, log, sessions } = $props();
</script>

<h1>{stats.firstName} {stats.lastName}</h1>

<section class="cards">
<StatsCards cardTitle={"Tasks completed"} cardBody={stats.tasksCompleted}/>
<StatsCards cardTitle={"Last task completed"} cardBody={formatDateDashboard(stats.lastCompletedAt)}/>
</section>

<ProgressBar {progress} />

<StatsTable {log}/>



<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }
  
</style>
