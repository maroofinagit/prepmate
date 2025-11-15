import { auth } from '@/app/lib/auth';
import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
// adjust import if your auth is in another path

// POST /api/createUserExam
export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const { examId, start_date, end_date } = await req.json();

        if (!examId || !start_date || !end_date) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const userId = session.user.id;

        const userExam = await db.userExam.create({
            data: {
                user_id: userId,
                exam_id: Number(examId),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                current_stage: 'Not Started',
                progress_percent: 0,
            },
        });

        return NextResponse.json({
            success: true,
            user_exam_id: userExam.id,
        });
    } catch (err) {
        console.error('❌ Error creating UserExam:', err);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
