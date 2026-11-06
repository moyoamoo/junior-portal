<script>
    import {formatDateDashboard} from '$lib/utils.js'
    let {log} = $props();
</script>

<h2>Completed tasks</h2>

{#if log.length === 0}
  <p>No tasks completed yet.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Completed</th>
        <th>Stripe</th>
        <th>Activity</th>
        <th>Type</th> 
        <th>Comment</th>
      </tr>
    </thead>

    <tbody>
      {#each log as task (task.id)}
        <tr>
          <td>{formatDateDashboard(task.dateCompleted)}</td>
          <td>{task.stripeName}</td>
          <td>
            {#if task.link}
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {task.activity}
              </a>
            {:else}
              {task.activity}
            {/if}
          </td>
          <td>{task.activityType}</td>
          <td>{task.comment ?? ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
</style>