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


//sort alphabetically
export function sortAlphabetically(users) {
    let newUsers = [...users];
    newUsers.sort((a, b) => {
        if (a.firstName > b.firstName) {
            return 1;
        } else if (a.firstName < b.firstName) {
            return -1;
        }
    });

    users = newUsers;
    return users;
}
