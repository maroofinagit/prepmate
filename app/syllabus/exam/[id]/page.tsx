import { getExamById } from "@/app/actions/action";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExamById(Number(id));

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Exam not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10 mt-20 border border-gray-200">
        {/* Exam Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{exam.name}</h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          {exam.description || "No description provided for this exam."}
        </p>

        {/* Subjects */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Subjects Overview
        </h2>

        <div className="space-y-10">
          {exam.subjects.map((subject, index) => (
            <div key={subject.id}>
              <h3 className="text-xl font-semibold text-gray-700">
                {index + 1}. {subject.name}
              </h3>

              <div className="ml-8 mt-2">
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Topics:
                </h4>
                {subject.topics.length > 0 ? (
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    {subject.topics.map((topic) => (
                      <li key={topic.id}>
                        <span className="font-medium">{topic.name}</span>{" "}
                        <span className="text-gray-500 text-sm">
                          ({topic.difficulty})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic ml-6">
                    No topics added for this subject.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/onboarding">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
              ← Back to Onboarding
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
