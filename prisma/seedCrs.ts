import { db } from '@/app/lib/db'

import { Difficulty, ResourceType } from '@/generated/prisma/enums';

async function main() {

    const subjects = [
        {
            name: 'Computer Networking Fundamentals',
            topics: [
                {
                    name: 'Client-Server Architecture',
                    description: 'Understand how clients and servers communicate over a network.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'OSI Model & TCP/IP',
                    description: 'Learn the networking layers and how internet communication works.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'HTTP, HTTPS & TLS',
                    description: 'Understand web communication, encryption, and secure data transfer.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'DNS & Domain Resolution',
                    description: 'Learn how domain names are translated into IP addresses.',
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: 'API Design & Communication',
            topics: [
                {
                    name: 'REST APIs',
                    description: 'Design scalable RESTful APIs using HTTP principles.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'GraphQL',
                    description: 'Build flexible APIs that return exactly the requested data.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'gRPC',
                    description: 'Learn high-performance communication between distributed services.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'API Security',
                    description: 'Secure APIs using authentication and authorization techniques.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Backend Architecture Fundamentals',
            topics: [
                {
                    name: 'Monolith vs Microservices',
                    description: 'Compare monolithic and microservice architectures and their trade-offs.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Reverse Proxies',
                    description: 'Understand how reverse proxies manage and route incoming traffic.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Load Balancers',
                    description: 'Distribute traffic efficiently across multiple application servers.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Content Delivery Networks (CDNs)',
                    description: 'Deliver static content faster using globally distributed edge servers.',
                    difficulty: Difficulty.medium,
                },
            ],
        },
        {
            name: 'Databases & Data Storage',
            topics: [
                {
                    name: 'Relational Databases (SQL)',
                    description: 'Learn relational database design, normalization, and SQL fundamentals.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'NoSQL Databases',
                    description: 'Understand document, key-value, graph, and column-oriented databases.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Database Indexing',
                    description: 'Optimize query performance using appropriate indexing strategies.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Transactions & ACID',
                    description: 'Ensure data consistency with transactions and ACID properties.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Database Replication',
                    description: 'Improve availability and read scalability through replication.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Database Sharding',
                    description: 'Scale databases horizontally by partitioning data across servers.',
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: 'Caching & Performance',
            topics: [
                {
                    name: 'Caching Fundamentals',
                    description: 'Reduce latency by serving frequently accessed data from cache.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Redis',
                    description: 'Use Redis for caching, sessions, counters, and real-time features.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Cache Invalidation',
                    description: 'Maintain data consistency with effective cache invalidation strategies.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Read Replicas',
                    description: 'Scale read-heavy workloads using replicated database instances.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Performance Optimization',
                    description: 'Improve system performance by eliminating common bottlenecks.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Asynchronous Communication',
            topics: [
                {
                    name: 'Synchronous vs Asynchronous Systems',
                    description: 'Compare blocking and background processing approaches.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Message Queues',
                    description: 'Process background jobs reliably using messaging systems.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Event-Driven Architecture',
                    description: 'Build loosely coupled systems using event-based communication.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Kafka',
                    description: 'Handle high-throughput event streaming with Apache Kafka.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'RabbitMQ & BullMQ',
                    description: 'Implement reliable task queues and background job processing.',
                    difficulty: Difficulty.medium,
                },
            ],
        },
        {
            name: 'Distributed Systems',
            topics: [
                {
                    name: 'CAP Theorem',
                    description: 'Understand the trade-offs between consistency, availability, and partition tolerance.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Consistency Models',
                    description: 'Learn strong, eventual, and causal consistency in distributed systems.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Fault Tolerance',
                    description: 'Design systems that continue operating despite failures.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'High Availability',
                    description: 'Build systems that remain accessible with minimal downtime.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Scalability',
                    description: 'Scale applications efficiently using vertical and horizontal scaling.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Distributed Locks',
                    description: 'Coordinate concurrent operations safely across multiple servers.',
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: 'Cloud Infrastructure & DevOps',
            topics: [
                {
                    name: 'Virtual Machines & Cloud Computing',
                    description: 'Understand cloud infrastructure and virtualized computing environments.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Docker',
                    description: 'Package applications into portable and reproducible containers.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Kubernetes',
                    description: 'Deploy, scale, and manage containerized applications automatically.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'CI/CD Pipelines',
                    description: 'Automate building, testing, and deploying software changes.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Monitoring & Logging',
                    description: 'Monitor application health and analyze logs for troubleshooting.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Observability',
                    description: 'Gain deep insights into system behavior using metrics, logs, and traces.',
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: 'System Design Patterns',
            topics: [
                {
                    name: 'Rate Limiting',
                    description: 'Protect services by controlling request rates.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Circuit Breaker',
                    description: 'Prevent cascading failures between dependent services.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'API Gateway',
                    description: 'Centralize routing, authentication, and request handling.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Service Discovery',
                    description: 'Enable services to locate and communicate with each other dynamically.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Leader Election',
                    description: 'Coordinate distributed systems by selecting a single coordinator.',
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: 'System Design Case Studies',
            topics: [
                {
                    name: 'URL Shortener',
                    description: 'Design a scalable URL shortening service like Bitly.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Pastebin',
                    description: 'Design a service for storing and sharing text snippets.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Chat Application',
                    description: 'Design a real-time messaging platform like WhatsApp.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Social Media Feed',
                    description: 'Design a scalable news feed like Instagram or X.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Video Streaming Platform',
                    description: 'Design a large-scale video platform like YouTube or Netflix.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Ride Sharing System',
                    description: 'Design a real-time ride matching system like Uber.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Food Delivery Platform',
                    description: 'Design a scalable food ordering and delivery system.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Cloud File Storage',
                    description: 'Design a distributed file storage system like Google Drive.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Notification Service',
                    description: 'Design a reliable service for email, SMS, and push notifications.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Search Autocomplete',
                    description: 'Design a fast and scalable search suggestion system.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Distributed Cache',
                    description: 'Design a highly available distributed caching system.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Payment System',
                    description: 'Design a secure and fault-tolerant payment processing platform.',
                    difficulty: Difficulty.hard,
                },
            ],
        },
    ]

    const resources = [
        {
            title: 'System Design Primer',
            type: ResourceType.article,
            url: 'https://github.com/donnemartin/system-design-primer',
        },
        {
            title: 'MDN HTTP Guide',
            type: ResourceType.article,
            url: 'https://developer.mozilla.org/docs/Web/HTTP',
        },
        {
            title: 'Redis Documentation',
            type: ResourceType.article,
            url: 'https://redis.io/docs/',
        },
        {
            title: 'Docker Documentation',
            type: ResourceType.article,
            url: 'https://docs.docker.com/',
        },
        {
            title: 'Kubernetes Documentation',
            type: ResourceType.article,
            url: 'https://kubernetes.io/docs/',
        },
        {
            title: 'AWS Architecture Center',
            type: ResourceType.article,
            url: 'https://aws.amazon.com/architecture/',
        },
        {
            title: 'System Design Interview (freeCodeCamp)',
            type: ResourceType.video,
            url: 'https://www.youtube.com/watch?v=bUHFg8CZFws',
        },
        {
            title: 'ByteByteGo',
            type: ResourceType.video,
            url: 'https://www.youtube.com/@ByteByteGo',
        },
        {
            title: 'Gaurav Sen System Design',
            type: ResourceType.video,
            url: 'https://www.youtube.com/@gkcs',
        },
    ]

    const exam = await db.exam.create({
        data: {
            name: 'System Design',
            description:
                'Master High-Level Design (HLD) and Low-Level Design (LLD) by learning scalable architectures, distributed systems, databases, networking, caching, cloud infrastructure, and real-world system design.',

            default_duration_weeks: 14,

            aiContext: `This roadmap is designed for software engineers who want to master System Design for both technical interviews and real-world software development. The learning path should emphasize conceptual clarity, practical thinking, and understanding the trade-offs behind architectural decisions rather than memorizing technologies. Every concept should explain why it exists, what problem it solves, when it should be used, and what alternatives exist. Learners should develop the ability to design scalable, reliable, highly available, fault-tolerant, secure, and maintainable systems while considering performance, latency, throughput, consistency, and cost. The roadmap should prepare students to confidently tackle High-Level Design (HLD) interviews at top technology companies, make informed architecture decisions in production environments, and build modern internet-scale applications by applying industry best practices and sound engineering principles.`,

            imageUrl:
                'https://images.pexels.com/photos/27141314/pexels-photo-27141314.jpeg',
        },
    })

    // ================= CREATE SUBJECTS & TOPICS =================

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

    // ================= CREATE RESOURCES =================

    for (const resource of resources) {
        await db.resource.create({
            data: {
                title: resource.title,
                type: resource.type,
                url: resource.url,
                exam_id: exam.id,
            },
        })
    }

    console.log(`✅ ${exam.name} exam created / updated successfully!`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })