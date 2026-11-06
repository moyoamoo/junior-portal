
import { error, redirect } from '@sveltejs/kit';
import { adminSupabase } from '$lib/server/admin.js';

const MIN_GAP_MINUTES = 1;
const MAX_GAP_MINUTES = 120;

export const load = async ({ locals, params }) => {
  if (!locals.adminSession) {
    throw redirect(303, '/admin');
  }

  const juniorId = params.juniorId;

  const [
    statsRes,
    juniorRes,
    completedRes,
    activitiesRes,
    stripesRes,
    commentsRes,
    sessionsRes
  ] = await Promise.all([
    adminSupabase
      .from('junior_stats')
      .select(`
        firstName:first_name,
        lastName:last_name,
        tasksCompleted:tasks_completed,
        lastLoginAt:last_login_at,
        loginCount:login_count,
        lastCompletedAt:last_completed_at,
        avgMinutesPerTask:avg_minutes_per_task
      `)
      .eq('junior_id', juniorId)
      .single(),

    adminSupabase
      .from('Junior')
      .select('juniorId:junior_id, stripeId:stripe_id')
      .eq('junior_id', juniorId)
      .single(),

    adminSupabase
      .from('CompletedTasks')
      .select('id, activityId:activity_id, dateCompleted:date_completed')
      .eq('junior_id', juniorId)
      .order('date_completed', { ascending: true }),

    adminSupabase
      .from('Activities')
      .select(`
        activityId:activity_id,
        activity,
        activityType:activity_type,
        link,
        stripeId:stripe_id
      `),

    adminSupabase
      .from('stripes')
      .select(`
        stripeId:stripe_id,
        stripeName:stripe_name,
        stripeOrder:stripe_order
      `),

    adminSupabase
      .from('taskComments')
      .select('activityId:activity_id, comment')
      .eq('junior_id', juniorId),

    adminSupabase
      .from('junior_sessions')
      .select('startedAt:started_at')
      .eq('junior_id', juniorId)
      .order('started_at', { ascending: false })
      .limit(10)
  ]);

  // Show a 404 if the junior does not exist or their stats are unavailable.
  if (statsRes.error || !statsRes.data) {
    throw error(404, 'Junior not found');
  }

  if (juniorRes.error) {
    throw error(500, 'Failed to load junior details');
  }
const queryErrors = {
  completedTasks: completedRes.error,
  activities: activitiesRes.error,
  stripes: stripesRes.error,
  comments: commentsRes.error,
  sessions: sessionsRes.error
};

for (const [query, queryError] of Object.entries(queryErrors)) {
  if (queryError) {
    console.error(`Failed to load ${query}:`, queryError);
  }
}

if (Object.values(queryErrors).some(Boolean)) {
  throw error(500, 'Failed to load junior statistics. Check the server logs.');
}

  const completed = completedRes.data ?? [];
  const activities = activitiesRes.data ?? [];
  const stripes = stripesRes.data ?? [];
  const comments = commentsRes.data ?? [];

  // Create lookup maps 
  const activityById = new Map(
    activities.map((activity) => [activity.activityId, activity])
  );

  const stripeById = new Map(
    stripes.map((stripe) => [stripe.stripeId, stripe])
  );

  const commentByActivity = new Map(
    comments.map((comment) => [comment.activityId, comment.comment])
  );

  // Build the completion log oldest-first to calculate time gaps.
  const log = completed
    .map((task, index) => {
      const activity = activityById.get(task.activityId);
      const stripe = activity
        ? stripeById.get(activity.stripeId)
        : null;

      let minutesSincePrevious = null;

      if (index > 0) {
        const previousTask = completed[index - 1];

        const diffMs =
          new Date(task.dateCompleted) -
          new Date(previousTask.dateCompleted);

        const diffMinutes = Math.round(diffMs / 60000);

        if (
          diffMinutes >= MIN_GAP_MINUTES &&
          diffMinutes <= MAX_GAP_MINUTES
        ) {
          minutesSincePrevious = diffMinutes;
        }
      }

      return {
        id: task.id,
        dateCompleted: task.dateCompleted,
        activity: activity?.activity ?? 'Deleted activity',
        activityType: activity?.activityType ?? '-',
        link: activity?.link ?? null,
        stripeName: stripe?.stripeName ?? '-',
        comment: commentByActivity.get(task.activityId) ?? null,
        minutesSincePrevious
      };
    })
    .reverse();

  // Calculate progress through the junior's current stripe.
  const currentStripeId = juniorRes.data.stripeId;
  const currentStripe = stripeById.get(currentStripeId);

  const stripeTaskIds = new Set(
    activities
      .filter((activity) => activity.stripeId === currentStripeId)
      .map((activity) => activity.activityId)
  );

  const stripeCompleted = completed.filter(
    (task) => stripeTaskIds.has(task.activityId)
  ).length;

  return {
    stats: statsRes.data,
    log,
    sessions: sessionsRes.data ?? [],
    progress: {
      stripeName: currentStripe?.stripeName ?? '-',
      completed: stripeCompleted,
      total: stripeTaskIds.size
    }
  };
};
