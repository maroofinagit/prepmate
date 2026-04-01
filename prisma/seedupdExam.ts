import { Difficulty, ResourceType } from '../generated/prisma/enums'
import { db } from '@/app/lib/db'

async function main() {
    // ================= FIND EXISTING EXAM =================
    const exam = await db.exam.findFirst({
        where: {
            name: 'GenAI for Web Developers',
        },
    })

    if (!exam) throw new Error('❌ Exam not found')

    // ================= UPDATE EXAM =================
    await db.exam.update({
        where: { id: exam.id },
        data: {
            description:
                'Advanced practical roadmap for integrating Generative AI into real-world web applications, covering LLMs, RAG, vector databases, and scalable AI systems.',
            default_duration_weeks: 12,
        },
    })

    // ================= CLEAN OLD DATA (IMPORTANT) =================
    await db.subject.deleteMany({
        where: { exam_id: exam.id },
    })

    await db.resource.deleteMany({
        where: { exam_id: exam.id },
    })

    // ================= SUBJECTS (UPDATED FLOW) =================
    const subjects = [
        {
            name: 'Foundations of Generative AI',
            topics: [
                {
                    name: 'What are LLMs & How They Work',
                    description:
                        'Deep understanding of transformers, tokens, embeddings, and how modern LLMs generate text.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Prompt Engineering Fundamentals',
                    description:
                        'Zero-shot, few-shot, structured prompting, and controlling LLM outputs effectively.',
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: 'Building AI Features',
            topics: [
                {
                    name: 'Integrating OpenAI APIs',
                    description:
                        'Making API calls, handling responses, streaming outputs, and managing errors.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Chat Systems & Memory',
                    description:
                        'Designing chat interfaces with memory, context handling, and UX patterns.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Advanced AI Systems',
            topics: [
                {
                    name: 'RAG (Retrieval Augmented Generation)',
                    description:
                        'Combining LLMs with external data using embeddings and vector databases.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Vector Databases & Search',
                    description:
                        'Using Pinecone, Supabase, and similarity search for semantic retrieval.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Scaling & Production',
            topics: [
                {
                    name: 'AI System Architecture',
                    description:
                        'Designing scalable backend systems for AI apps with queues and caching.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Security & Guardrails',
                    description:
                        'Preventing prompt injection, ensuring moderation, and safe AI usage.',
                    difficulty: Difficulty.hard,
                },
            ],
        },
    ]

    // ================= INSERT SUBJECTS =================
    for (const subject of subjects) {
        const createdSubject = await db.subject.create({
            data: {
                name: subject.name,
                exam_id: exam.id,
            },
        })

        for (const topic of subject.topics) {
            await db.topic.create({
                data: {
                    name: topic.name,
                    description: topic.description,
                    difficulty: topic.difficulty,
                    subject_id: createdSubject.id,
                },
            })
        }
    }

    // ================= UPDATED RESOURCES =================
    await db.resource.createMany({
        data: [
            {
                title: 'OpenAI API Docs',
                type: ResourceType.article,
                url: 'https://platform.openai.com/docs',
                exam_id: exam.id,
            },
            {
                title: 'Prompt Engineering Guide',
                type: ResourceType.article,
                url: 'https://www.promptingguide.ai/',
                exam_id: exam.id,
            },
            {
                title: 'LangChain Docs',
                type: ResourceType.article,
                url: 'https://docs.langchain.com/',
                exam_id: exam.id,
            },
            {
                title: 'RAG Explained (YouTube)',
                type: ResourceType.video,
                url: 'https://www.youtube.com/watch?v=T-D1OfcDW1M',
                exam_id: exam.id,
            },
        ],
    })

    console.log('✅ Exam updated successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })