<script>
  // Data from +page.server.js (runes style)
  let { data } = $props();

  // Show "Never" for missing dates, UK format otherwise
  const formatDate = (value) => {
    if (!value) {
      return 'Never';
    }

    return new Date(value).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Percentage for the progress bar, guarding against divide-by-zero.
  // $derived re-runs automatically whenever data changes.
  const percent = $derived(
    data.progress.total > 0
      ? Math.round((data.progress.completed / data.progress.total) * 100)
      : 0
  );
</script>

<a href="/admin">← Back to all juniors</a>

<h1>{data.stats.first_name} {data.stats.last_name}</h1>

<section class="cards">
  <div class="card">
    <span class="label">Tasks completed</span>
    <strong>{data.stats.tasks_completed}</strong>
  </div>
  <div class="card">
    <span class="label">Last login</span>
    <strong>{formatDate(data.stats.last_login_at)}</strong>
  </div>
  <div class="card">
    <span class="label">Logins</span>
    <strong>{data.stats.login_count}</strong>
  </div>
  <div class="card">
    <span class="label">Last task completed</span>
    <strong>{formatDate(data.stats.last_completed_at)}</strong>
  </div>
  <div class="card">
    <span class="label">Avg minutes per task</span>
    <strong>{data.stats.avg_minutes_per_task ?? '-'}</strong>
  </div>
</section>

<h2>{data.progress.stripeName} progress</h2>
<progress value={data.progress.completed} max={data.progress.total || 1}></progress>
<p>{data.progress.completed} of {data.progress.total} tasks ({percent}%)</p>

<h2>Completed tasks</h2>
{#if data.log.length === 0}
  <p>No tasks completed yet.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Completed</th>
        <th>Stripe</th>
        <th>Activity</th>
        <th>Type</th>
        <th>Mins since previous</th>
        <th>Comment</th>
      </tr>
    </thead>
    <tbody>
      {#each data.log as task (task.id)}
        <tr>
          <td>{formatDate(task.date_completed)}</td>
          <td>{task.stripe_name}</td>
          <td>
            {#if task.link}
              <a href={task.link} target="_blank" rel="noopener noreferrer">{task.activity}</a>
            {:else}
              {task.activity}
            {/if}
          </td>
          <td>{task.activity_type}</td>
          <td>{task.minutesSincePrevious ?? '-'}</td>
          <td>{task.comment ?? ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<h2>Recent logins</h2>
{#if data.sessions.length === 0}
  <p>No logins recorded yet.</p>
{:else}
  <ul>
    {#each data.sessions as session}
      <li>{formatDate(session.started_at)}</li>
    {/each}
  </ul>
{/if}

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

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

  progress {
    width: 100%;
  }
</style>