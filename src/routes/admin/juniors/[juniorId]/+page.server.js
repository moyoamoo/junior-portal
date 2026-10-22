import { error, redirect} from '@sveltejs/kit';
import { adminSupabase } from '$lib/server/admin.js';
const MIN_GAP_MINUTES = 1;
const MAX_GAP_MINUTES = 120;

export const load = async ({ locals, params }) => {

   if (!locals.adminSession) {
    throw redirect(303, '/admin');
  }

  const juniorId = params.juniorId;

  
  const [statsRes, juniorRes, completedRes, activitiesRes, stripesRes, commentsRes, sessionsRes] =
    await Promise.all([
      // Summary numbers from the view
      adminSupabase.from('junior_stats').select('*').eq('junior_id', juniorId).single(),
      // Needed for the junior's current stripe_id
      adminSupabase.from('Junior').select('junior_id, stripe_id').eq('junior_id', juniorId).single(),
      // Every completion for this junior
      adminSupabase
        .from('CompletedTasks')
        .select('id, activity_id, date_completed')
        .eq('junior_id', juniorId)
        .order('date_completed', { ascending: true }),
      // Small table, so fetch all and join in JS (no FK embedding needed)
      adminSupabase.from('Activities').select('activity_id, activity, activity_type, link, stripe_id'),
      adminSupabase.from('stripes').select('stripe_id, stripe_name, stripe_order'),
      adminSupabase
        .from('taskComments')
        .select('activity_id, comment')
        .eq('junior_id', juniorId),
      // Last 10 logins
      adminSupabase
        .from('junior_sessions')
        .select('started_at')
        .eq('junior_id', juniorId)
        .order('started_at', { ascending: false })
        .limit(10)
    ]);

  // Unknown id: show a 404 instead of an empty page
  if (statsRes.error || !statsRes.data) {
    throw error(404, 'Junior not found');
  }

  const completed = completedRes.data ?? [];
  const activities = activitiesRes.data ?? [];
  const stripes = stripesRes.data ?? [];
  const comments = commentsRes.data ?? [];

  // Lookup maps so each completion can be enriched quickly
  const activityById = new Map(activities.map((a) => [a.activity_id, a]));
  const stripeById = new Map(stripes.map((s) => [s.stripe_id, s]));
  const commentByActivity = new Map(comments.map((c) => [c.activity_id, c.comment]));

  // Build the log oldest-first so each row can look back at the previous one
  const log = completed
    .map((task, index) => {
      const activity = activityById.get(task.activity_id);
      const stripe = activity ? stripeById.get(activity.stripe_id) : null;

      // Minutes since the previous completion (null for the first one)
      let minutesSincePrevious = null;

      if (index > 0) {
        const diffMs =
          new Date(task.date_completed) - new Date(completed[index - 1].date_completed);
        const diffMinutes = Math.round(diffMs / 60000);

        // Only keep gaps that look like real working time
        if (diffMinutes >= MIN_GAP_MINUTES && diffMinutes <= MAX_GAP_MINUTES) {
          minutesSincePrevious = diffMinutes;
        }
      }

      return {
        id: task.id,
        date_completed: task.date_completed,
        activity: activity?.activity ?? 'Deleted activity',
        activity_type: activity?.activity_type ?? '-',
        link: activity?.link ?? null,
        stripe_name: stripe?.stripe_name ?? '-',
        comment: commentByActivity.get(task.activity_id) ?? null,
        minutesSincePrevious
      };
    })
    // Newest first for display
    .reverse();

  // Progress through the current stripe's booklet
  const currentStripeId = juniorRes.data?.stripe_id;
  const currentStripe = stripeById.get(currentStripeId);
  const stripeTaskIds = new Set(
    activities.filter((a) => a.stripe_id === currentStripeId).map((a) => a.activity_id)
  );
  const stripeCompleted = completed.filter((t) => stripeTaskIds.has(t.activity_id)).length;



  return {
    stats: statsRes.data,
    log,
    sessions: sessionsRes.data ?? [],
    progress: {
      stripeName: currentStripe?.stripe_name ?? '-',
      completed: stripeCompleted,
      total: stripeTaskIds.size
    }
  };
};