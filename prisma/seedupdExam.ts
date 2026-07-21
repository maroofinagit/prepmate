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
            default_duration_weeks: 12,
        },
    })

    // ================= CLEAN OLD DATA (IMPORTANT) =================
    await db.subject.deleteMany({
        where: { exam_id: exam.id },
    })

    // ================= SUBJECTS (UPDATED FLOW) =================
    const subjects = [
        {
            name: 'AI Fundamentals for Developers',
            topics: [
                {
                    name: 'What is Generative AI?',
                    description: 'Understand how Generative AI is transforming modern software development.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'How Large Language Models (LLMs) Work',
                    description: 'Learn how LLMs process, understand, and generate natural language.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Prompt Engineering',
                    description: 'Write effective prompts to produce accurate and reliable AI outputs.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Tokens & Context Windows',
                    description: 'Understand token limits, context management, and API pricing.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Structured Outputs',
                    description: 'Generate predictable JSON and schema-based AI responses.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Integrating AI into Applications',
            topics: [
                {
                    name: 'Integrating LLM APIs',
                    description: 'Connect AI models to web applications using modern APIs.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Chat Completions & Responses API',
                    description: 'Build conversational experiences using chat-based APIs.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Streaming AI Responses',
                    description: 'Deliver AI responses progressively for better user experience.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Rate Limits & Error Handling',
                    description: 'Handle failures, retries, and API limitations effectively.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Cost Optimization',
                    description: 'Reduce AI costs through efficient token and request management.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Building AI Features',
            topics: [
                {
                    name: 'AI Chat Applications',
                    description: 'Build production-ready conversational interfaces.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'AI Content Generation',
                    description: 'Generate text, emails, summaries, and other dynamic content.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'AI Search & Recommendations',
                    description: 'Create intelligent search and recommendation experiences.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'AI Assistants & Copilots',
                    description: 'Develop AI assistants that improve user productivity.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'AI Features for SaaS',
                    description: 'Integrate AI capabilities into real-world software products.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Context & Knowledge Retrieval',
            topics: [
                {
                    name: 'Embeddings',
                    description: 'Represent text semantically for intelligent retrieval.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Semantic Search',
                    description: 'Search based on meaning rather than keyword matching.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Vector Databases',
                    description: 'Store and retrieve embeddings efficiently.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Chunking & Retrieval',
                    description: 'Prepare and retrieve documents for AI applications.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Retrieval-Augmented Generation (RAG)',
                    description: 'Enhance AI responses with external knowledge sources.',
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: 'AI Workflows & Agents',
            topics: [
                {
                    name: 'Function Calling',
                    description: 'Allow AI models to invoke application functions.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Tool Calling',
                    description: 'Connect AI with external APIs and services.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Workflow Automation',
                    description: 'Automate business workflows using AI.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'AI Agents',
                    description: 'Build autonomous AI systems capable of planning and execution.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Model Context Protocol (MCP)',
                    description: 'Enable standardized communication between AI models and tools.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Multi-Agent Systems',
                    description: 'Coordinate multiple AI agents to solve complex tasks.',
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: 'Production AI Architecture',
            topics: [
                {
                    name: 'Designing AI Services',
                    description: 'Architect scalable backend services for AI workloads.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Queues & Background Jobs',
                    description: 'Process AI tasks asynchronously for better scalability.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Conversation Memory',
                    description: 'Maintain context across multiple user interactions.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Caching AI Responses',
                    description: 'Reduce latency and API costs using caching strategies.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Session Management',
                    description: 'Manage conversations and user-specific AI state.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'AI Cost Optimization',
                    description: 'Optimize infrastructure and API usage for production.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Frontend AI Experience',
            topics: [
                {
                    name: 'AI Chat Interfaces',
                    description: 'Design intuitive conversational user interfaces.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Streaming UI',
                    description: 'Display streamed AI responses with smooth interactions.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Markdown & Rich Responses',
                    description: 'Render AI-generated rich content effectively.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Voice & Image Interfaces',
                    description: 'Integrate speech, vision, and multimodal AI experiences.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Loading States & Error Handling',
                    description: 'Provide responsive feedback during AI interactions.',
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: 'Production, Security & Deployment',
            topics: [
                {
                    name: 'Prompt Injection & AI Security',
                    description: 'Protect AI applications against prompt-based attacks.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Content Moderation',
                    description: 'Ensure safe and compliant AI-generated content.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Model Selection',
                    description: 'Choose the right AI model for different use cases.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Testing AI Applications',
                    description: 'Evaluate AI quality, reliability, and correctness.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Monitoring & Observability',
                    description: 'Track AI performance and production health.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Deploying & Scaling AI',
                    description: 'Deploy AI-powered applications for production environments.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Cloud AI Platforms',
                    description: 'Build and deploy AI solutions using leading cloud providers.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Real-World AI Projects',
            topics: [
                {
                    name: 'AI Chatbot',
                    description: 'Build a production-ready conversational assistant.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Document Q&A System',
                    description: 'Create a RAG-powered document question-answering application.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'AI PDF Chat',
                    description: 'Build an AI assistant capable of chatting with PDF documents.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'AI Coding Assistant',
                    description: 'Develop an AI-powered coding companion for developers.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'AI SaaS Application',
                    description: 'Build and deploy a complete AI-powered SaaS product.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'AI Agent with MCP',
                    description: 'Develop an intelligent agent using the Model Context Protocol.',
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

    console.log(`${exam.name} updated successfully!`)
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })