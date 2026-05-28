import { useState } from "react";

export function RecentActivity({ data }) {
    const [showAll, setShowAll] = useState(false);

    const submissions = data?.recentSubmissions || [];

    const visibleSubmissions = showAll
        ? submissions
        : submissions.slice(0, 3);

    return (
        <div className="flex flex-col gap-4 p-4 m-2">
            <h2 className="text-2xl font-bold">
                Recent Activity
            </h2>

            <div className="space-y-4">
                {visibleSubmissions.map((submission, index) => (
                    <div
                        key={index}
                        className="border rounded-xl p-4 shadow-md hover:shadow-lg transition"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">
                                {submission.title}
                            </h2>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${submission.statusDisplay === "Accepted"
                                        ? "bg-green-100 text-green-700"
                                        : submission.statusDisplay === "Wrong Answer"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}
                            >
                                {submission.statusDisplay}
                            </span>
                        </div>

                        <div className="mt-3 text-sm text-gray-600 space-y-1">
                            <p>
                                <span className="font-medium">Language:</span>{" "}
                                {submission.lang}
                            </p>

                            <p>
                                <span className="font-medium">Submitted:</span>{" "}
                                {new Date(
                                    submission.timestamp * 1000
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {submissions.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="self-center mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
}