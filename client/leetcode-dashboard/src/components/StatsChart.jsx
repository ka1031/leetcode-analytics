import {
    getAverageSubmissionsPerDay,
    getTotalSubmissions,
} from "../utils/submissions";


export function StatsChart({ data }) {
    const difficultyColors = {
        Easy: "bg-green-500",
        Medium: "bg-yellow-500",
        Hard: "bg-red-500",
    };

    return (
        <div className="flex items-center justify-center p-4 m-2 gap-4">
            {data.profile.submitStatsGlobal.acSubmissionNum.map((item) => (
                <div
                    key={item.difficulty}
                    className={`text-center text-white px-4 py-2 rounded-lg ${difficultyColors[item.difficulty] || "bg-gray-500"
                        }`}
                >
                    <p className="font-semibold">{item.difficulty}</p>
                    <p>{item.count}</p>
                </div>
            ))}
            <p>
                Avg/Day: {getAverageSubmissionsPerDay(data)}
            </p>
            <p>
                Total: {getTotalSubmissions(data)}
            </p>
        </div>
    );
}