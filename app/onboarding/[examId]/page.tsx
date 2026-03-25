// app/onboarding/[examId]/page.tsx
import { getExamById } from '@/app/actions/action';
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

    return (

        <ClientExamStart exam={exam} />
    );
}
