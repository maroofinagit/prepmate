// run this file with `npx prisma db seed` to seed the database with CA Intermediate subjects, topics, and resources

import { Difficulty, ResourceType } from '../generated/prisma/enums'
import { db } from '@/app/lib/db'

async function main() {
    // ================= CREATE EXAM =================
    const exam = await db.exam.upsert({
        where: {
            id: 9, // 👈 replace with your placement exam id
        },
        update: {
            name: 'GenAI for Web Developers',
            description:
                'Practical application of Generative AI in modern web and full-stack development including LLM integration, AI-powered features, and production deployment.',
            default_duration_weeks: 12,
        },
        create: {
            name: 'GenAI for Web Developers',
            description:
                'Practical application of Generative AI in modern web and full-stack development including LLM integration, AI-powered features, and production deployment.',
            default_duration_weeks: 12,
        },
    })

    // ================= CLEAN OLD DATA (IMPORTANT) =================
    
    await db.topic.deleteMany({
        where: {
            subject: {
                exam_id: exam.id,
            },
        },
    })
    
    await db.subject.deleteMany({
        where: { exam_id: exam.id },
    })


    await db.resource.deleteMany({
        where: { exam_id: exam.id },
    })

    // ================= SUBJECTS DATA =================
    const subjects: any[] = [
        {
            name: 'Foundations of Generative AI',
            topics: [
                {
                    name: 'What is Generative AI?',
                    description: `
Start your journey by understanding what Generative AI really is.

In this topic, you will:
- Understand how Large Language Models (LLMs) like GPT work
- Learn how text is broken into tokens and processed
- Understand probability-based text generation
- Explore real-world use cases (chatbots, copilots, automation)

Goal: Build a strong mental model of how AI generates responses.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Prompt Engineering Fundamentals',
                    description: `
Learn how to communicate effectively with AI models.

You will learn:
- Zero-shot vs Few-shot prompting
- Role-based prompting (system/user)
- Controlling output format (JSON, structured data)
- Avoiding vague prompts

Goal: Write prompts that produce consistent and reliable outputs.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Tokens, Context Window & Cost Optimization',
                    description: `
Understand the hidden mechanics that affect performance and cost.

Covers:
- What tokens are and how they are counted
- Context window limitations
- How long conversations impact cost
- Techniques to optimize token usage

Goal: Build cost-efficient and scalable AI features.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'LLM Integration in Web Apps',
            topics: [
                {
                    name: 'Integrating LLM APIs (OpenAI & Others)',
                    description: `
Learn how to connect AI models with your backend.

You will:
- Make API calls using SDKs
- Handle responses and errors
- Understand request/response lifecycle
- Secure API keys properly

Goal: Successfully integrate AI into any web application.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Building Chat-Based Interfaces',
                    description: `
Design and implement real chat systems like ChatGPT.

Covers:
- Message history management
- Conversation memory handling
- UX patterns for chat apps
- Structuring backend + frontend flow

Goal: Build a fully functional AI chat system.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Streaming & Real-Time AI Responses',
                    description: `
Improve user experience with real-time AI responses.

Learn:
- Streaming responses using SSE/WebSockets
- Typing indicators and partial outputs
- Handling long responses efficiently

Goal: Make AI feel fast, alive, and interactive.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Rate Limits, Retries & Optimization',
                    description: `
Make your system production-ready.

Includes:
- Handling API rate limits
- Retry mechanisms and fallbacks
- Caching responses
- Reducing latency

Goal: Build stable and reliable AI-powered systems.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Building Real AI Features',
            topics: [
                {
                    name: 'Text Generation Systems',
                    description: `
Build practical AI features used in real products.

Examples:
- Blog generators
- Email writers
- Resume builders
- Caption generators

Goal: Create reusable AI-powered utilities for applications.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Semantic Search with Embeddings',
                    description: `
Go beyond keyword search and build intelligent search systems.

You will:
- Understand embeddings deeply
- Implement similarity search
- Rank results based on meaning

Goal: Build Google-like smart search features.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'RAG (Retrieval Augmented Generation)',
                    description: `
Combine your own data with AI responses.

Covers:
- How RAG works step-by-step
- Connecting vector DB + LLM
- Query → Retrieve → Generate flow

Goal: Build AI that answers based on your custom data.
        `,
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'AI Assistants & Copilots',
                    description: `
Embed AI inside your product as a smart assistant.

Includes:
- Form autofill
- Inline suggestions
- AI copilots (like GitHub Copilot)

Goal: Make your app intelligent and interactive.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Vector Databases & Data Handling',
            topics: [
                {
                    name: 'Embeddings Deep Dive',
                    description: `
Understand how text is converted into vectors.

You will:
- Learn embedding generation
- Compare similarity techniques
- Store and retrieve embeddings

Goal: Build the foundation for intelligent data systems.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Working with Vector Databases',
                    description: `
Use tools like Pinecone, Weaviate, or Supabase.

Covers:
- Storing vectors
- Querying similar data
- Performance optimization

Goal: Build scalable AI search systems.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Chunking, Indexing & Data Pipelines',
                    description: `
Prepare data properly for AI usage.

Includes:
- Document chunking strategies
- Preprocessing text
- Efficient indexing

Goal: Improve retrieval quality in AI systems.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Backend Architecture for GenAI',
            topics: [
                {
                    name: 'Designing AI Middleware',
                    description: `
Structure your backend for AI workflows.

You will:
- Handle prompts centrally
- Log responses
- Manage retries and failures

Goal: Build maintainable and scalable AI backends.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Queues & Async Processing',
                    description: `
Handle heavy AI tasks efficiently.

Covers:
- Background jobs
- Queue systems (BullMQ)
- Worker architecture

Goal: Prevent blocking and improve performance.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Caching AI Responses',
                    description: `
Reduce cost and speed up responses.

Learn:
- When to cache
- Cache invalidation strategies
- Redis-based caching

Goal: Optimize performance and reduce API costs.
        `,
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: 'Frontend UX for AI Apps',
            topics: [
                {
                    name: 'Designing AI-First UX',
                    description: `
Design interfaces that feel intelligent.

Includes:
- Loading states
- Streaming UI
- Trust indicators

Goal: Build delightful AI experiences.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Handling Errors & Edge Cases',
                    description: `
Prepare for real-world failures.

You will:
- Handle API failures
- Show fallback responses
- Improve user trust

Goal: Make your app resilient and user-friendly.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Interactive AI Components',
                    description: `
Build reusable AI UI components.

Examples:
- Chat widgets
- Inline assistants
- Smart inputs

Goal: Create modular AI UI systems.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Security, Limits & Guardrails',
            topics: [
                {
                    name: 'Prompt Injection & AI Security',
                    description: `
Protect your system from misuse.

Covers:
- Prompt injection attacks
- Input sanitization
- Secure AI design

Goal: Build safe AI applications.
        `,
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Content Moderation',
                    description: `
Ensure safe and appropriate outputs.

Includes:
- Moderation APIs
- Filtering harmful content
- User safety systems

Goal: Maintain ethical AI usage.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'User Limits & Cost Control',
                    description: `
Control usage and prevent abuse.

You will:
- Implement quotas
- Track usage per user
- Prevent excessive API usage

Goal: Build sustainable AI systems.
        `,
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Deployment & Scaling AI Apps',
            topics: [
                {
                    name: 'Deploying AI Applications',
                    description: `
Take your app live.

Covers:
- Vercel deployment
- Environment variables
- Serverless AI functions

Goal: Launch production-ready AI apps.
        `,
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Monitoring & Logging',
                    description: `
Track everything happening in your system.

Includes:
- Logging prompts and responses
- Error tracking
- Performance monitoring

Goal: Debug and improve your AI system.
        `,
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Scaling AI Systems',
                    description: `
Handle real-world traffic and growth.

You will:
- Optimize performance
- Handle high load
- Scale backend systems

Goal: Build AI systems that handle thousands of users.
        `,
                    difficulty: Difficulty.hard,
                },
            ],
        },
    ]

    // ================= RESOURCES =================
    const resources = [
        // 🔹 CORE DOCUMENTATION (Start Here)
        {
            title: 'OpenAI API Documentation (Core LLM Concepts & Usage)',
            type: ResourceType.article,
            url: 'https://platform.openai.com/docs',
        },
        {
            title: 'Vercel AI SDK (Streaming, Chat & UI Integration)',
            type: ResourceType.article,
            url: 'https://sdk.vercel.ai/',
        },
        {
            title: 'LangChain Documentation (Advanced LLM Workflows)',
            type: ResourceType.article,
            url: 'https://docs.langchain.com/',
        },

        // 🔹 LEARNING + UNDERSTANDING (Concept Clarity)
        {
            title: 'Full Stack LLM App Tutorial (FreeCodeCamp)',
            type: ResourceType.video,
            url: 'https://www.youtube.com/watch?v=...',
        },
        {
            title: 'Prompt Engineering Guide (DeepLearning.AI)',
            type: ResourceType.article,
            url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
        },
        {
            title: 'Generative AI for Developers (Google)',
            type: ResourceType.article,
            url: 'https://developers.google.com/machine-learning/resources',
        },

        // 🔹 VECTOR DATABASES & RAG
        {
            title: 'Pinecone Vector Database Guide',
            type: ResourceType.article,
            url: 'https://docs.pinecone.io/',
        },
        {
            title: 'Supabase Vector Embeddings Guide',
            type: ResourceType.article,
            url: 'https://supabase.com/docs/guides/ai',
        },
        {
            title: 'RAG Explained (Practical Guide)',
            type: ResourceType.article,
            url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
        },

        // 🔹 REAL PROJECT BUILDING
        {
            title: 'Build ChatGPT Clone (End-to-End Project)',
            type: ResourceType.video,
            url: 'https://www.youtube.com/watch?v=...',
        },
        {
            title: 'AI SaaS App Architecture Guide',
            type: ResourceType.article,
            url: 'https://vercel.com/blog/ai',
        },

        // 🔹 BACKEND & SCALING
        {
            title: 'BullMQ Queue System (Async Processing)',
            type: ResourceType.article,
            url: 'https://docs.bullmq.io/',
        },
        {
            title: 'Redis Caching Strategies',
            type: ResourceType.article,
            url: 'https://redis.io/docs/',
        },

        // 🔹 SECURITY & BEST PRACTICES
        {
            title: 'OpenAI Safety & Best Practices',
            type: ResourceType.article,
            url: 'https://platform.openai.com/docs/guides/safety-best-practices',
        },
        {
            title: 'Prompt Injection Explained',
            type: ResourceType.article,
            url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
        },
    ]

    // ================= INSERT SUBJECTS + TOPICS =================
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

    // ================= RESOURCES =================
    await db.resource.createMany({
        data: [
            {
                title: 'ICAI CA Intermediate Study Material',
                type: ResourceType.pdf,
                url: 'https://www.icai.org/post/study-material-nset',
                exam_id: exam.id,
            },
            {
                title: 'ICAI BOS Portal',
                type: ResourceType.article,
                url: 'https://boslive.icai.org/',
                exam_id: exam.id,
            },
        ],
    })

    console.log('✅ GenAI for Web Developers exam seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })