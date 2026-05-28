export function Languages({ data }) {
    const languages = data?.profile?.languageProblemCount||[];

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold mb-2">
                Problems Solved by Language
            </h2>

            <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                    <div
                        key={lang.languageName}
                        className="bg-purple-500 text-white px-3 py-1 rounded-lg"
                    >
                        {lang.languageName} ({lang.problemsSolved})
                    </div>
                ))}
            </div>
        </div>
    );
}