export function getSubmissionCalendar(data) {
    return JSON.parse(
        data?.profile?.submissionCalendar || "{}"
    );
}

export function getTotalSubmissions(data) {
    const calendar = getSubmissionCalendar(data);

    return Object.values(calendar).reduce(
        (sum, count) => sum + count,
        0
    );
}

export function getAverageSubmissionsPerDay(data) {
    const calendar = getSubmissionCalendar(data);

    const total = Object.values(calendar).reduce(
        (sum, count) => sum + count,
        0
    );

    const days = Object.keys(calendar).length;

    return days ? (total / days).toFixed(2) : 0;
}

export function getMostActiveDay(data) {
    const calendar = getSubmissionCalendar(data);

    return Math.max(...Object.values(calendar));
}