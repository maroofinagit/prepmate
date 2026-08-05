// app/onboarding/[examId]/page.tsx
import { getExamById, getUserExam } from '@/app/actions/action';
import ClientExamStart from '@/components/ClientExamStart';

export default async function Page({ params }: { params: Promise<{ examId: string }> }) {
    const { examId } = await params;
    const exam = await getExamById(Number(examId));

    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
                Exam not found.
            </div>
        );
    }

    const userExam = await getUserExam(exam.id);
    console.log("User Exam:", userExam);

    if (userExam) {
        return (
            <div className="min-h-screen flex items-center text-center justify-center text-gray-600 text-lg">
                You have already started this exam.<br /> Please go to your dashboard to continue.
            </div>
        );
    }

    return (

        <ClientExamStart exam={exam} />
    );
}
