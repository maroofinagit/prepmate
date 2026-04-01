import { ResourceType } from '../generated/prisma/enums'
import { db } from '@/app/lib/db'

async function main() {
  const examId = 9 // 👈 your GenAI exam id

  // ================= CLEAN OLD RESOURCES =================
  await db.resource.deleteMany({
    where: {
      exam_id: examId,
    },
  })

  // ================= INSERT UPDATED RESOURCES =================
  await db.resource.createMany({
    data: [
      // ================= FUNDAMENTALS =================
      {
        title: 'OpenAI API Documentation (Core LLM Concepts)',
        type: ResourceType.article,
        url: 'https://platform.openai.com/docs',
        exam_id: examId,
      },
      {
        title: 'Prompt Engineering Guide (DeepLearning.AI)',
        type: ResourceType.article,
        url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
        exam_id: examId,
      },

      // ================= LLM INTEGRATION =================
      {
        title: 'Vercel AI SDK (Streaming + Chat Integration)',
        type: ResourceType.article,
        url: 'https://sdk.vercel.ai/',
        exam_id: examId,
      },
      {
        title: 'Build AI Chat App (Next.js + OpenAI)',
        type: ResourceType.video,
        url: 'https://www.youtube.com/watch?v=...',
        exam_id: examId,
      },

      // ================= LANGCHAIN / ADVANCED =================
      {
        title: 'LangChain Documentation (LLM Workflows)',
        type: ResourceType.article,
        url: 'https://docs.langchain.com/',
        exam_id: examId,
      },

      // ================= RAG & VECTOR DATABASE =================
      {
        title: 'Pinecone Vector Database Guide',
        type: ResourceType.article,
        url: 'https://docs.pinecone.io/',
        exam_id: examId,
      },
      {
        title: 'Supabase AI & Embeddings Guide',
        type: ResourceType.article,
        url: 'https://supabase.com/docs/guides/ai',
        exam_id: examId,
      },
      {
        title: 'RAG (Retrieval Augmented Generation) Explained',
        type: ResourceType.article,
        url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
        exam_id: examId,
      },

      // ================= REAL PROJECTS =================
      {
        title: 'Build Full Stack AI SaaS (End-to-End Project)',
        type: ResourceType.video,
        url: 'https://www.youtube.com/watch?v=...',
        exam_id: examId,
      },
      {
        title: 'AI SaaS Architecture (Vercel Blog)',
        type: ResourceType.article,
        url: 'https://vercel.com/blog/ai',
        exam_id: examId,
      },

      // ================= BACKEND & SCALING =================
      {
        title: 'BullMQ Queue System (Async AI Jobs)',
        type: ResourceType.article,
        url: 'https://docs.bullmq.io/',
        exam_id: examId,
      },
      {
        title: 'Redis Caching Strategies',
        type: ResourceType.article,
        url: 'https://redis.io/docs/',
        exam_id: examId,
      },

      // ================= SECURITY =================
      {
        title: 'OpenAI Safety & Best Practices',
        type: ResourceType.article,
        url: 'https://platform.openai.com/docs/guides/safety-best-practices',
        exam_id: examId,
      },
      {
        title: 'OWASP Top 10 for LLM Applications (Security)',
        type: ResourceType.article,
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
        exam_id: examId,
      },
    ],
  })

  console.log('✅ GenAI Full Stack resources updated successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })