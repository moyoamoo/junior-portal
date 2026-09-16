export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
}


//update the actitivies in the table - local state 
export const updateActivity = (activities, activityId, changes) => {
    return activities.map((activity) =>
        activity.activityId === activityId
            ? { ...activity, ...changes }
            : activity
    );
}

// Update a junior in admin mode - local state
export const updateJunior = (juniors, juniorId, changes) => {
    return juniors.map((junior) =>
        junior.juniorId === juniorId
            ? { ...junior, ...changes }
            : junior,
    );
}

//headings from booklet table
export const headings = [
    "Activity",
    "Activity Type",
    "Comments",
    "Date",
    "Completed",

];

//sort alphabetically
export const sortAlphabetically = (users) => {
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

//capitalise first letter 
export const capitalise = (string) => {
    let trimmedString = string.trim();
    return trimmedString && String(trimmedString[0]).toUpperCase() + String(trimmedString).slice(1);
}
