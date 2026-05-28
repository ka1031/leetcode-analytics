export function AIInsights({ insights }) {
    return (
        <div className="mt-10 space-y-8">

            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Strengths
                </h2>

                <div className="space-y-3">
                    {insights?.strengths?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-green-100 p-4 rounded-xl"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Weaknesses
                </h2>

                <div className="space-y-3">
                    {insights?.weaknesses?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-red-100 p-4 rounded-xl"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Recommendations
                </h2>

                <div className="space-y-3">
                    {insights?.recommendations?.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="bg-blue-100 p-4 rounded-xl"
                            >
                                {item}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}