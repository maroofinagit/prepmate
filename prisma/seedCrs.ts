import { Difficulty, ResourceType } from '../generated/prisma/enums'
import { db } from '@/app/lib/db'

async function main() {
  // ================= CREATE EXAM =================
  const exam = await db.exam.create({
    data: {
      name: 'CA Intermediate',
      description:
        'Second level of Chartered Accountancy course conducted by ICAI.',
      default_duration_weeks: 36,
    },
  })

  // ================= SUBJECTS DATA =================
 const subjects: any[] = [
        {
            name: 'Group 1 - Advanced Accounting',
            topics: [
                {
                    name: 'Accounting Standards',
                    description: 'Comprehensive coverage of AS including AS 1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 26 with emphasis on recognition, measurement, and disclosure.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Framework for Preparation and Presentation of Financial Statements',
                    description: 'Concepts of true and fair view, qualitative characteristics, elements of financial statements.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Company Accounts',
                    description: 'Issue of shares (at par, premium, discount), forfeiture and reissue, employee stock options, issue and redemption of debentures.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Amalgamation of Companies',
                    description: 'Accounting for amalgamation in nature of merger and purchase, pooling of interest and purchase method.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Internal Reconstruction',
                    description: 'Reduction of share capital, reorganization of capital structure, journal entries and balance sheet preparation.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Branch Accounts',
                    description: 'Dependent and independent branches, stock and debtors system, foreign branch accounting.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Consignment Accounts',
                    description: 'Normal and abnormal loss, valuation of stock, commission calculation.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Hire Purchase & Installment System',
                    description: 'Interest calculation, repossession, accounting in books of hire purchaser and vendor.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Departmental Accounts',
                    description: 'Allocation and apportionment of expenses, inter-departmental transfers.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Financial Statements of Companies',
                    description: 'Preparation of financial statements as per Schedule III including notes to accounts.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Group 1 - Corporate and Other Laws',
            topics: [
                {
                    name: 'Preliminary & Incorporation of Company',
                    description: 'Types of companies, memorandum and articles of association, incorporation process.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Share Capital and Debentures',
                    description: 'Issue, allotment, transfer, transmission, buyback of shares and debentures.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Acceptance of Deposits',
                    description: 'Provisions related to acceptance, repayment, and compliance requirements.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Management and Administration',
                    description: 'Meetings, quorum, resolutions, minutes, registers and records.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Directors',
                    description: 'Appointment, qualification, duties, powers, and removal of directors.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Audit and Auditors',
                    description: 'Appointment, rotation, powers, duties, and auditor’s report.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Indian Contract Act, 1872',
                    description: 'Offer, acceptance, consideration, capacity, free consent, breach of contract.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Sale of Goods Act, 1930',
                    description: 'Conditions and warranties, transfer of property, unpaid seller rights.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'LLP Act',
                    description: 'Formation, partners, rights, duties, and dissolution of LLP.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Negotiable Instruments Act, 1881',
                    description: 'Negotiation, endorsement, dishonour, crossing of cheques.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Group 1 - Taxation',
            topics: [
                {
                    name: 'Basic Concepts of Income Tax',
                    description: 'Previous year, assessment year, residential status, scope of total income.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Income from Salary',
                    description: 'Allowances, perquisites, retirement benefits, deductions.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Income from House Property',
                    description: 'Annual value, deductions, unrealized rent.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Profits and Gains from Business or Profession',
                    description: 'Allowable and disallowable expenses, depreciation, presumptive taxation.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Capital Gains',
                    description: 'Short-term and long-term gains, exemptions under section 54 series.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Income from Other Sources',
                    description: 'Residual income, dividend, interest, gifts.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Clubbing & Set-off and Carry Forward',
                    description: 'Clubbing provisions, inter-head and intra-head adjustments.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Deductions under Chapter VI-A',
                    description: 'Sections 80C to 80U deductions.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'GST Concepts',
                    description: 'Supply, levy, place of supply, composite and mixed supply.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Input Tax Credit',
                    description: 'Eligibility, conditions, blocked credits.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'GST Procedures',
                    description: 'Registration, returns, payment of tax.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Group 2 - Cost and Management Accounting',
            topics: [
                {
                    name: 'Introduction to Costing',
                    description: 'Cost concepts, classification, cost sheet.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Material Cost',
                    description: 'EOQ, stock levels, pricing methods like FIFO, LIFO.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Labour Cost',
                    description: 'Time and piece rate systems, incentives, labour turnover.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Overheads',
                    description: 'Allocation, apportionment, absorption, machine hour rate.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Activity Based Costing',
                    description: 'Cost drivers, allocation based on activities.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Costing Methods',
                    description: 'Job, batch, contract, process costing including joint and by-products.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Marginal Costing',
                    description: 'P/V ratio, break-even analysis, decision making.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Budgeting',
                    description: 'Functional budgets, flexible budgets, zero-based budgeting.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Group 2 - Auditing and Ethics',
            topics: [
                {
                    name: 'Nature and Scope of Audit',
                    description: 'Objectives, inherent limitations, types of audit.',
                    difficulty: Difficulty.easy,
                },
                {
                    name: 'Audit Strategy and Planning',
                    description: 'Audit plan, risk assessment, internal control evaluation.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Audit Documentation',
                    description: 'Working papers, audit evidence.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Audit of Items',
                    description: 'Vouching and verification of assets and liabilities.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Company Audit',
                    description: 'Audit provisions under Companies Act.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Audit Report',
                    description: 'Types of audit reports, qualifications, CARO.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Ethics',
                    description: 'ICAI Code of Ethics, independence, professional misconduct.',
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: 'Group 2 - Financial Management and Strategic Management',
            topics: [
                {
                    name: 'Financial Management Functions',
                    description: 'Scope, objectives, and role of finance manager.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Time Value of Money',
                    description: 'Compounding, discounting, annuities.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Capital Budgeting',
                    description: 'NPV, IRR, profitability index, decision making.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Cost of Capital',
                    description: 'Cost of debt, equity, preference, WACC.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Leverage Analysis',
                    description: 'Operating, financial, combined leverage.',
                    difficulty: Difficulty.hard,
                },
                {
                    name: 'Working Capital Management',
                    description: 'Cash, receivables, inventory management.',
                    difficulty: Difficulty.medium,
                },
                {
                    name: 'Strategic Management',
                    description: 'Vision, mission, SWOT, Porter’s Five Forces, strategy implementation.',
                    difficulty: Difficulty.medium,
                },
            ],
        },
    ]

    resources: [
        {
            title: 'ICAI CA Intermediate Study Material',
            type: ResourceType.pdf,
            url: 'https://www.icai.org/post/study-material-nset',
        },
        {
            title: 'ICAI BOS Portal',
            type: ResourceType.article,
            url: 'https://boslive.icai.org/',
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
        exam_id : exam.id,
      },
      {
        title: 'ICAI BOS Portal',
        type: ResourceType.article,
        url: 'https://boslive.icai.org/',
        exam_id: exam.id,
      },
    ],
  })

  console.log('✅ CA Intermediate seeded successfully')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })