export function TagProblemCounts({ data }) {
    const fundamental =
        data?.profile?.tagProblemCounts?.fundamental || [];

    const intermediate =
        data?.profile?.tagProblemCounts?.intermediate || [];

    const advanced =
        data?.profile?.tagProblemCounts?.advanced || [];

    return (
        <div className="p-4 space-y-2">

            {/* Fundamental */}
            <div>
                <h2 className="text-xl font-bold mb-2">
                    Fundamental
                </h2>

                <div className="flex flex-wrap gap-2">
                    {fundamental.map((tag) => (
                        <div
                            key={tag.tagName}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                        >
                            {tag.tagName} ({tag.problemsSolved})
                        </div>
                    ))}
                </div>
            </div>

            {/* Intermediate */}
            <div>
                <h2 className="text-xl font-bold mb-2">
                    Intermediate
                </h2>

                <div className="flex flex-wrap gap-2">
                    {intermediate.map((tag) => (
                        <div
                            key={tag.tagName}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                        >
                            {tag.tagName} ({tag.problemsSolved})
                        </div>
                    ))}
                </div>
            </div>

            {/* Advanced */}
            <div>
                <h2 className="text-xl font-bold mb-2">
                    Advanced
                </h2>

                <div className="flex flex-wrap gap-2">
                    {advanced.map((tag) => (
                        <div
                            key={tag.tagName}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg"
                        >
                            {tag.tagName} ({tag.problemsSolved})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}