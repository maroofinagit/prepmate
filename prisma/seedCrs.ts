import { db } from '@/app/lib/db'

import { Difficulty, ResourceType } from '@/generated/prisma/enums';

async function main() {

    const subjects = [
        {
            name: "Data Analysis Fundamentals",
            description:
                "Build a strong foundation in data analytics by understanding the analytics lifecycle, business problems, and the role of data in decision-making.",

            topics: [
                {
                    name: "Introduction to Data Analytics",
                    description: "Understand what data analytics is and its importance in modern businesses.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Role of a Data Analyst",
                    description: "Learn the responsibilities, skills, and daily workflow of a data analyst.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Analytics Lifecycle",
                    description: "Explore the complete process from data collection to business insights.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Types of Data",
                    description: "Differentiate between structured, semi-structured, and unstructured data.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Types of Analytics",
                    description: "Understand descriptive, diagnostic, predictive, and prescriptive analytics.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Collection Methods",
                    description: "Learn how organizations gather data from multiple sources.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Quality & Cleaning",
                    description: "Identify and resolve missing, duplicate, and inconsistent data.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Business Problem Solving",
                    description: "Translate business questions into measurable data analysis tasks.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Ethics & Privacy",
                    description: "Understand responsible data handling, privacy, and ethical practices.",
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: "SQL for Data Analysis",
            description:
                "Master SQL for querying, analyzing, and manipulating data to solve real-world business problems.",

            topics: [
                {
                    name: "Database Fundamentals",
                    description: "Understand databases, tables, rows, columns, and relationships.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "SQL Basics",
                    description: "Retrieve and filter data using fundamental SQL statements.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Filtering & Sorting Data",
                    description: "Use filtering, ordering, and limiting techniques to refine query results.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Aggregate Functions",
                    description: "Summarize data using COUNT, SUM, AVG, MIN, and MAX.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "GROUP BY & HAVING",
                    description: "Group records and filter aggregated results effectively.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "SQL Joins",
                    description: "Combine data from multiple tables using different join types.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Subqueries",
                    description: "Write nested queries to solve complex analytical problems.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Common Table Expressions (CTEs)",
                    description: "Organize complex SQL queries using reusable query blocks.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Window Functions",
                    description: "Perform advanced analytical calculations across rows of data.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Views & Stored Procedures",
                    description: "Simplify data access and automate common database operations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Query Optimization",
                    description: "Write efficient SQL queries for faster data retrieval.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "SQL Interview Patterns",
                    description: "Practice common SQL problems frequently asked in data analyst interviews.",
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: "Statistics & Mathematics for Data Analysis",
            description:
                "Learn the essential statistical concepts required to analyze data, identify trends, and make data-driven business decisions.",

            topics: [
                {
                    name: "Descriptive Statistics",
                    description: "Summarize datasets using measures of central tendency and dispersion.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Probability Fundamentals",
                    description: "Understand probability concepts used in data analysis.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Distributions",
                    description: "Explore common data distributions and their characteristics.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Sampling Techniques",
                    description: "Learn how representative samples are collected from large datasets.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Central Limit Theorem",
                    description: "Understand why sampling distributions become approximately normal.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Correlation Analysis",
                    description: "Measure relationships between variables using correlation techniques.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Regression Basics",
                    description: "Use regression to identify trends and predict relationships between variables.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Hypothesis Testing",
                    description: "Validate assumptions using statistical significance testing.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Confidence Intervals",
                    description: "Estimate population values using sample statistics.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "A/B Testing",
                    description: "Compare different business strategies using controlled experiments.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Excel for Data Analysis",
            description:
                "Master Microsoft Excel for cleaning, analyzing, and presenting business data efficiently.",

            topics: [
                {
                    name: "Excel Fundamentals",
                    description: "Navigate worksheets, formulas, and essential Excel features.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Cleaning in Excel",
                    description: "Prepare datasets by removing duplicates and fixing inconsistencies.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Formulas & Functions",
                    description: "Perform calculations using common Excel functions.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Lookup Functions",
                    description: "Retrieve related data using XLOOKUP, VLOOKUP, and INDEX-MATCH.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Pivot Tables",
                    description: "Summarize and analyze large datasets efficiently.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Charts & Visualizations",
                    description: "Create charts to communicate insights effectively.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Conditional Formatting",
                    description: "Highlight trends and anomalies using formatting rules.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Power Query",
                    description: "Import, clean, and transform data from multiple sources.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Power Pivot",
                    description: "Build data models and perform advanced analytical calculations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Excel Dashboards",
                    description: "Design interactive dashboards for business reporting.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Excel Automation",
                    description: "Automate repetitive tasks using advanced Excel features.",
                    difficulty: Difficulty.medium,
                },
            ],
        },
        {
            name: "Python for Data Analysis",
            description:
                "Learn Python to clean, analyze, transform, and visualize datasets efficiently for real-world business analytics.",

            topics: [
                {
                    name: "Python Fundamentals",
                    description: "Learn Python syntax, variables, data types, loops, and functions.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "NumPy",
                    description: "Perform efficient numerical computations using NumPy arrays.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Pandas Fundamentals",
                    description: "Load, inspect, and manipulate structured datasets using Pandas.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Cleaning with Pandas",
                    description: "Handle missing values, duplicates, and inconsistent data efficiently.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Transformation",
                    description: "Filter, merge, reshape, and aggregate datasets for analysis.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Exploratory Data Analysis (EDA)",
                    description: "Discover trends, patterns, and anomalies through exploratory analysis.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Visualization with Matplotlib",
                    description: "Create basic charts and plots to visualize analytical insights.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Visualization with Seaborn",
                    description: "Build attractive statistical visualizations using Seaborn.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Working with CSV, Excel & JSON",
                    description: "Read, write, and process data from common file formats.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Working with APIs",
                    description: "Fetch and analyze data from REST APIs using Python.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Python Data Analysis Project",
                    description: "Apply Python skills to clean, analyze, and visualize a real-world dataset.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Data Visualization & Business Intelligence",
            description:
                "Learn to communicate insights through dashboards, reports, and visualizations using modern BI tools.",

            topics: [
                {
                    name: "Data Visualization Principles",
                    description: "Understand best practices for presenting data effectively.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Choosing the Right Chart",
                    description: "Select appropriate visualizations based on data and business goals.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Tableau Fundamentals",
                    description: "Build interactive dashboards and reports using Tableau.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Power BI Fundamentals",
                    description: "Create business intelligence reports using Microsoft Power BI.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Interactive Dashboards",
                    description: "Design dashboards with filters, drill-downs, and user interactions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Key Performance Indicators (KPIs)",
                    description: "Track and visualize business performance using meaningful metrics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Business Storytelling",
                    description: "Present analytical insights through clear and compelling narratives.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Dashboard Optimization",
                    description: "Improve dashboard usability, performance, and readability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Business Reporting",
                    description: "Create professional reports that support data-driven decision making.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "BI Dashboard Project",
                    description: "Build an end-to-end interactive business dashboard using real-world data.",
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: "Data Processing & Analytics Workflow",
            description:
                "Learn how organizations collect, transform, store, and manage data for reliable analysis and reporting.",

            topics: [
                {
                    name: "ETL Fundamentals",
                    description: "Understand the process of extracting, transforming, and loading data.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Warehousing",
                    description: "Learn how centralized data warehouses support business analytics.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Data Lakes",
                    description: "Understand how raw and structured data are stored for analysis.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Modeling",
                    description: "Design efficient data models for reporting and analytical queries.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Pipelines",
                    description: "Build workflows that move and process data between systems.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Validation",
                    description: "Verify data accuracy, consistency, and completeness before analysis.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Data Automation",
                    description: "Automate repetitive data processing and reporting tasks.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Workflow Scheduling",
                    description: "Schedule recurring data processing and reporting jobs.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Working with Large Datasets",
                    description: "Handle and optimize analysis of large-scale datasets efficiently.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Business Analytics & Case Studies",
            description:
                "Apply analytical techniques to solve real-world business problems across different domains using data-driven decision making.",

            topics: [
                {
                    name: "Sales Analytics",
                    description: "Analyze sales performance, revenue trends, and business growth.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Marketing Analytics",
                    description: "Measure campaign performance and customer acquisition metrics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Customer Analytics",
                    description: "Understand customer behavior, segmentation, and lifetime value.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Financial Analytics",
                    description: "Analyze financial data to support budgeting and profitability decisions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Product Analytics",
                    description: "Measure product usage, engagement, and feature performance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "HR Analytics",
                    description: "Use employee data to support recruitment and workforce decisions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Cohort Analysis",
                    description: "Track user groups over time to measure retention and behavior.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Funnel Analysis",
                    description: "Identify conversion bottlenecks across customer journeys.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Retention Analysis",
                    description: "Measure customer retention and identify churn patterns.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Business Case Studies",
                    description: "Solve practical business problems using analytical techniques and real datasets.",
                    difficulty: Difficulty.hard,
                },
            ],
        },
        {
            name: "Interview Preparation & Real-World Projects",
            description:
                "Prepare for Data Analyst interviews by solving practical problems, building portfolio projects, and mastering technical and business interview questions.",

            topics: [
                {
                    name: "SQL Interview Questions",
                    description: "Practice common SQL interview problems involving joins, window functions, and data analysis.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Excel Interview Questions",
                    description: "Solve business scenarios using formulas, pivot tables, and data analysis techniques.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Statistics Interview Questions",
                    description: "Review frequently asked statistical concepts used in data analyst interviews.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Python Interview Questions",
                    description: "Practice Python coding and data manipulation problems for analytics roles.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Power BI & Tableau Interview Questions",
                    description: "Prepare dashboard, visualization, and reporting interview scenarios.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Business Case Interview",
                    description: "Solve real business problems using structured analytical thinking and data.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Sales Performance Dashboard",
                    description: "Build an interactive dashboard to analyze sales, revenue, and growth metrics.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Customer Churn Analysis",
                    description: "Analyze customer behavior to identify churn patterns and retention opportunities.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "E-Commerce Data Analysis",
                    description: "Analyze orders, customers, and product performance using real-world datasets.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "HR Analytics Dashboard",
                    description: "Create dashboards to visualize employee performance, hiring, and workforce trends.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "End-to-End Data Analytics Project",
                    description: "Complete a production-style analytics project from data collection to business recommendations.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Portfolio & Resume Preparation",
                    description: "Build a professional portfolio and optimize your resume for data analyst roles.",
                    difficulty: Difficulty.easy,
                },
            ],
        },
    ]

    const resources = [
        {
            title: "Alex The Analyst",
            type: ResourceType.video,
            url: "https://www.youtube.com/@AlexTheAnalyst",
        },
        {
            title: "SQLBolt",
            type: ResourceType.article,
            url: "https://sqlbolt.com/",
        },
        {
            title: "Mode SQL Tutorial",
            type: ResourceType.article,
            url: "https://mode.com/sql-tutorial/",
        },
        {
            title: "Microsoft Excel Training",
            type: ResourceType.article,
            url: "https://support.microsoft.com/en-us/excel",
        },
        {
            title: "Pandas Documentation",
            type: ResourceType.article,
            url: "https://pandas.pydata.org/docs/",
        },
        {
            title: "NumPy Documentation",
            type: ResourceType.article,
            url: "https://numpy.org/doc/",
        },
        {
            title: "Power BI Learning",
            type: ResourceType.article,
            url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/",
        },
        {
            title: "Tableau Learning",
            type: ResourceType.article,
            url: "https://www.tableau.com/learn/training",
        },
        {
            title: "Kaggle Learn",
            type: ResourceType.article,
            url: "https://www.kaggle.com/learn",
        },
        {
            title: "Google Data Analytics Professional Certificate",
            type: ResourceType.link,
            url: "https://www.coursera.org/professional-certificates/google-data-analytics",
        },
        {
            title: "Python for Data Analysis (Book)",
            type: ResourceType.pdf,
            url: "https://wesmckinney.com/book/",
        },
    ];

    const exam = await db.exam.create({
        data: {
            name: 'Data Analyst Roadmap',
            description:
                "Prepare for Data Analyst roles by mastering SQL, Excel, Python, statistics, business intelligence, and real-world analytics through practical projects and interview-focused learning.",

            default_duration_weeks: 14,

            aiContext: `This roadmap is designed for learners preparing for Data Analyst roles in the industry, focusing on the practical skills and business knowledge expected in technical interviews and day-to-day analytics work. The learning path should emphasize solving real business problems using data rather than advanced machine learning or data science concepts. Every topic should explain why it is important, when it should be applied, and how it helps transform raw data into actionable business insights. Students should develop proficiency in SQL, Excel, Python, statistics, data visualization, and business intelligence tools while learning to clean, analyze, interpret, and communicate data effectively. The roadmap should prepare learners to confidently solve analytical case studies, build professional dashboards and portfolio projects, answer interview questions, and make data-driven decisions in real-world business environments across domains such as sales, marketing, finance, product, and operations.`,

            imageUrl:
                'https://images.pexels.com/photos/7651734/pexels-photo-7651734.jpeg',
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