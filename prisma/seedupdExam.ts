import { Difficulty, ResourceType } from '../generated/prisma/enums'
import { db } from '@/app/lib/db'

async function main() {
    // ================= FIND EXISTING EXAM =================
    const exam = await db.exam.findFirst({
        where: {
            id: 9, // 👈 your GenAI exam id
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
            name: "AI Fundamentals for Developers",
            description:
                "Build a strong foundation in Generative AI by understanding how modern AI models work and how developers can leverage them in software applications.",

            topics: [
                {
                    name: "Introduction to Generative AI",
                    description: "Understand what Generative AI is and how it is transforming modern software development.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "How Large Language Models (LLMs) Work",
                    description: "Learn how LLMs process prompts and generate human-like responses.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "AI Models & Providers",
                    description: "Explore popular AI models and providers such as OpenAI, Anthropic, Gemini, and open-source alternatives.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Tokens & Context Windows",
                    description: "Understand tokens, context limits, and their impact on AI performance and cost.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Prompt Engineering",
                    description: "Write clear and effective prompts to achieve reliable AI outputs.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Prompting Techniques",
                    description: "Learn zero-shot, few-shot, chain-of-thought, and other prompting strategies.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Structured Outputs",
                    description: "Generate predictable JSON and schema-based AI responses for applications.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Model Selection",
                    description: "Choose the right AI model based on capability, latency, and cost.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Limitations & Best Practices",
                    description: "Recognize hallucinations, biases, and practical limitations when building AI features.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Working with LLM APIs",
            description:
                "Learn how to integrate AI models into web applications using modern APIs, SDKs, and developer tools.",

            topics: [
                {
                    name: "Getting Started with AI APIs",
                    description: "Understand API keys, authentication, and basic AI API workflows.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Chat Completions & Responses API",
                    description: "Build conversational experiences using modern LLM APIs.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Streaming AI Responses",
                    description: "Stream AI responses in real time to improve user experience.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Function & Tool Calling",
                    description: "Enable AI models to interact with application functions and external tools.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Multimodal Inputs & Outputs",
                    description: "Process text, images, audio, and other supported input formats with AI models.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conversation Management",
                    description: "Maintain chat history and context across multiple AI interactions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Error Handling & Rate Limits",
                    description: "Handle API failures, retries, and provider rate limits effectively.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Token Usage & Cost Optimization",
                    description: "Reduce AI costs through efficient prompt design and token management.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI SDKs & Developer Libraries",
                    description: "Use official SDKs and frameworks to integrate AI into applications efficiently.",
                    difficulty: Difficulty.medium,
                },
            ],
        },
        {
            name: "Building AI-Powered Applications",
            description:
                "Learn how to build practical AI features that enhance user experience and add intelligent capabilities to modern web applications.",

            topics: [
                {
                    name: "AI Chat Applications",
                    description: "Build conversational interfaces powered by Large Language Models.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "AI Content Generation",
                    description: "Generate articles, emails, marketing content, and other dynamic text.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Text Summarization",
                    description: "Create concise summaries from long-form content using AI.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "AI Search & Recommendations",
                    description: "Build intelligent search and recommendation experiences using AI.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Document Processing",
                    description: "Extract, analyze, and understand information from uploaded documents.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Multimodal AI Applications",
                    description: "Build applications that work with text, images, audio, and vision models.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conversation Memory",
                    description: "Maintain meaningful conversations across multiple user interactions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Features for SaaS Applications",
                    description: "Integrate AI capabilities into real-world software products.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Building AI Assistants",
                    description: "Create AI assistants that help users perform everyday tasks.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Knowledge Retrieval & Retrieval-Augmented Generation (RAG)",
            description:
                "Enable AI applications to retrieve, understand, and respond using your own data instead of relying only on model knowledge.",

            topics: [
                {
                    name: "Introduction to Embeddings",
                    description: "Understand how text is converted into vector representations.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Semantic Search",
                    description: "Search documents using meaning instead of keyword matching.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Vector Databases",
                    description: "Store and retrieve embeddings efficiently for AI applications.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Document Chunking",
                    description: "Split large documents into meaningful chunks for retrieval.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Retrieval Strategies",
                    description: "Retrieve the most relevant context before generating responses.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Retrieval-Augmented Generation (RAG)",
                    description: "Combine external knowledge with LLMs to produce accurate responses.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Hybrid Search",
                    description: "Combine semantic and keyword search for improved retrieval accuracy.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "RAG Evaluation & Optimization",
                    description: "Improve retrieval quality and response accuracy in production systems.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Building AI Knowledge Bases",
                    description: "Create searchable knowledge systems powered by embeddings and RAG.",
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: "AI Agents & Workflow Automation",
            description:
                "Learn how AI models interact with tools, automate workflows, and perform complex tasks through intelligent agents.",

            topics: [
                {
                    name: "Introduction to AI Agents",
                    description: "Understand how AI agents plan, reason, and perform multi-step tasks.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Tool Calling",
                    description: "Enable AI models to use external APIs, databases, and services.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Workflow Automation",
                    description: "Automate business processes using AI-powered workflows.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Agent Memory",
                    description: "Maintain context and state across multiple agent interactions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Planning & Multi-Step Reasoning",
                    description: "Break complex problems into smaller executable tasks.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Multi-Agent Systems",
                    description: "Coordinate multiple AI agents to solve complex workflows collaboratively.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Model Context Protocol (MCP)",
                    description: "Connect AI models with external tools through a standardized protocol.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Building Autonomous AI Workflows",
                    description: "Create AI systems capable of completing end-to-end business tasks.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Agent Design Best Practices",
                    description: "Design reliable, maintainable, and production-ready AI agents.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Production AI Architecture",
            description:
                "Learn how to architect scalable, reliable, and cost-efficient AI-powered applications for production environments.",

            topics: [
                {
                    name: "Designing AI Applications",
                    description: "Design scalable architectures for AI-powered software systems.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "AI Backend Architecture",
                    description: "Integrate AI services into backend applications using clean architectural patterns.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Asynchronous AI Processing",
                    description: "Handle long-running AI tasks using queues and background workers.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Caching AI Responses",
                    description: "Reduce latency and API costs by caching frequently requested outputs.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conversation & Session Management",
                    description: "Manage user conversations and AI context across sessions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "File Upload & Document Processing",
                    description: "Process PDFs, images, and other files before passing them to AI models.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Token & Cost Optimization",
                    description: "Optimize prompts, context, and requests to reduce operational costs.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Monitoring AI Applications",
                    description: "Track usage, latency, errors, and model performance in production.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Scaling AI Systems",
                    description: "Build AI applications that remain reliable under increasing traffic and workload.",
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: "AI Security, Deployment & Best Practices",
            description:
                "Learn how to secure, evaluate, deploy, and maintain reliable AI-powered applications in production environments.",

            topics: [
                {
                    name: "Prompt Injection Attacks",
                    description: "Protect AI applications from malicious prompts and instruction manipulation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Security Best Practices",
                    description: "Implement secure patterns when integrating AI into applications.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Content Moderation",
                    description: "Filter unsafe or inappropriate AI inputs and outputs.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Guardrails & Response Validation",
                    description: "Ensure AI responses follow business rules and expected formats.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Testing AI Applications",
                    description: "Evaluate AI quality, reliability, and consistency before deployment.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Monitoring & Observability",
                    description: "Track AI performance, latency, usage, and production issues.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Deploying AI Applications",
                    description: "Deploy AI-powered applications using modern cloud platforms.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Cloud AI Services",
                    description: "Integrate managed AI services from leading cloud providers.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Choosing the Right AI Model",
                    description: "Select models based on quality, speed, context size, and cost.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Real-World AI Applications & Projects",
            description:
                "Apply Generative AI concepts by building practical, production-ready AI applications used in modern software products.",

            topics: [
                {
                    name: "AI Chatbot",
                    description: "Build a conversational AI assistant with streaming responses.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "AI Document Chat",
                    description: "Create a RAG-powered application that answers questions from documents.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI PDF Assistant",
                    description: "Build an AI application capable of understanding PDF documents.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Customer Support Agent",
                    description: "Develop an intelligent customer support assistant using AI.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Content Generation Platform",
                    description: "Build an application for generating blogs, emails, and marketing content.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "AI Coding Assistant",
                    description: "Develop an AI-powered coding companion for developers.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "AI Image Generation App",
                    description: "Integrate image generation models into a web application.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "AI Voice Assistant",
                    description: "Build a voice-enabled AI application using speech models.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Production AI SaaS Application",
                    description: "Build and deploy a complete AI-powered SaaS product from scratch.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

    ];

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