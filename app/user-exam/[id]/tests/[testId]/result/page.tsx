import { getTestResult } from "@/app/actions/test";

interface PageProps {
    params: Promise<{
        id: string;
        testId: string;
    }>;
}

export default async function ResultPage({
    params,
}: PageProps) {

    const { testId } = await params;

    const data =
        await getTestResult(Number(testId));

    if (data.success === false || data.test === undefined || data.result === undefined || data.questions === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 text-lg">
                    Test not found
                </p>
            </div>
        );
    }

    const {
        test,
        result,
        questions,
    } = data;

    return (
        <div className="min-h-screen pt-32 bg-zinc-100 px-6 lg:px-10 py-16">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

                    <h1 className="text-4xl font-bold text-zinc-800 mb-2">
                        {test.title}
                    </h1>

                    <p className="text-zinc-500">
                        {test.description}
                    </p>

                    {/* SCORE */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">

                        <div className="bg-black text-white rounded-2xl p-5">
                            <p className="text-sm opacity-70 mb-1">
                                Score
                            </p>

                            <h2 className="text-3xl font-bold">
                                {result.score}/
                                {result.totalMarks}
                            </h2>
                        </div>

                        <div className="bg-white border rounded-2xl p-5">
                            <p className="text-sm text-zinc-500 mb-1">
                                Percentage
                            </p>

                            <h2 className="text-3xl font-bold">
                                {result.percentage}%
                            </h2>
                        </div>

                        <div className="bg-white border rounded-2xl p-5">
                            <p className="text-sm text-zinc-500 mb-1">
                                Correct
                            </p>

                            <h2 className="text-3xl font-bold text-green-600">
                                {result.correctAnswers}
                            </h2>
                        </div>

                        <div className="bg-white border rounded-2xl p-5">
                            <p className="text-sm text-zinc-500 mb-1">
                                Wrong
                            </p>

                            <h2 className="text-3xl font-bold text-red-600">
                                {result.wrongAnswers}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* QUESTIONS REVIEW */}
                <div className="space-y-6">

                    {questions.map((q, idx) => (

                        <div
                            key={q.id}
                            className="bg-white rounded-3xl shadow-md p-8"
                        >

                            {/* TOP */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                                <div>
                                    <p className="text-sm text-zinc-500 mb-2">
                                        Question {idx + 1}
                                    </p>

                                    <h2 className="text-2xl font-semibold text-zinc-800">
                                        {q.question}
                                    </h2>
                                </div>

                                <div>

                                    {q.isCorrect ? (

                                        <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                                            Correct
                                        </div>

                                    ) : (

                                        <div className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium">
                                            Wrong
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* OPTIONS */}
                            <div className="space-y-3">

                                {q.options.map(
                                    (
                                        option,
                                        optionIndex
                                    ) => {

                                        const isSelected =
                                            q.selectedAnswer === option;

                                        const isCorrectOption =
                                            q.correctAnswer === option;

                                        return (

                                            <div
                                                key={optionIndex}
                                                className={`p-4 rounded-2xl border

                                                ${isCorrectOption
                                                        ? "bg-green-50 border-green-300"
                                                        : isSelected
                                                            ? "bg-red-50 border-red-300"
                                                            : "bg-zinc-50 border-zinc-200"
                                                    }
                                                
                                                `}
                                            >

                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-sm font-semibold">
                                                            {String.fromCharCode(
                                                                65 +
                                                                optionIndex
                                                            )}
                                                        </div>

                                                        <span>
                                                            {option}
                                                        </span>
                                                    </div>

                                                    <div>

                                                        {isCorrectOption && (
                                                            <span className="text-green-600 font-medium">
                                                                Correct Answer
                                                            </span>
                                                        )}

                                                        {!q.isCorrect &&
                                                            isSelected && (
                                                                <span className="text-red-600 font-medium">
                                                                    Your Answer
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}