export function ContestData({ data }) {
    const rating = data.contestRanking.rating;
    const rank = data.contestRanking.globalRanking;
    const total_count=data.contestRanking.attendedContestsCount;

    let ratingColor = "text-gray-500";

    if (rating >= 2000) {
        ratingColor = "text-red-500";
    } else if (rating >= 1600) {
        ratingColor = "text-blue-500";
    } else if (rating >= 1400) {
        ratingColor = "text-green-500";
    } else {
        ratingColor = "text-gray-500";
    }

    return (
        <div className="flex flex-col gap-4 p-4 m-2">
            <div
                className={`flex items-center text-3xl font-bold ${ratingColor}`}
            >
                Rating:{rating}
            </div>
            <div className={`flex items-center text-2x1 `}>
                Contest Ranking:{rank}
            </div>
            <div className="flex items-center text-2x1">
                Contests attended:{total_count}
            </div>
        </div>
    );
}