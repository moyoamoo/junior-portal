export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}

//update the actitivies in the table
export function updateActivity(activities, activityId, changes) {
    return activities.map((activity) =>
        activity.activityId === activityId
            ? { ...activity, ...changes }
            : activity
    );
}

//headings from booklet table
export const headings = [
    "Activity",
    "Activity Type",
    "Date",
    "Completed",
    "Comments",
];

