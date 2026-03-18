import {db} from '@/app/lib/db';
import { Difficulty, ResourceType } from '../generated/prisma/enums';

async function main() {
    console.log('🌱 Starting seed...');

    // ⚙️ CONFIG
    const userId = 'cl61cLweRaEywTtAvJxpRcSvlgsFUl3g'; // replace with a real user id from your auth system
    const examId = 2; // existing exam ID from your "Exam" table

    // 🧩 1️⃣ Create a UserExam
    const userExam = await db.userExam.create({
        data: {
            user_id: userId,
            exam_id: examId,
            start_date: new Date('2025-11-12'),
            end_date: new Date('2026-03-12'),
            current_stage: 'Not Started',
            progress_percent: 0,
        },
    });

    console.log(`✅ Created UserExam (id: ${userExam.id})`);

    // 🧩 2️⃣ Create a Roadmap linked to that UserExam
    const roadmap = await db.roadmap.create({
        data: {
            user_exam_id: userExam.id,
            title: "Full DSA Preparation Plan",
            description: "A complete 34-week DSA roadmap.",
            start_date: new Date("2025-11-01"),
            end_date: new Date("2026-06-30"),
            progress: 0,
            summary: "Foundations → Advanced DSA → Interview Prep.",

            milestones: {
                create: [
                    {
                        name: "Foundation Mastery",
                        goal: "Complete basics of arrays, strings, recursion.",
                        target_date: new Date("2026-01-10")
                    },
                    {
                        name: "Advanced DSA Expertise",
                        goal: "Finish Graphs, DP, Heaps, Trees, Tries.",
                        target_date: new Date("2026-04-15")
                    }
                ]
            },

            phases: {
                create: [
                    // ======================================================
                    // PHASE 1 — FOUNDATIONS (10 WEEKS)
                    // ======================================================
                    {
                        phase_name: "Phase 1: Foundations",
                        description: "Arrays, strings, recursion, hashing, binary search, patterns.",
                        duration: "10 weeks",
                        order_index: 1,
                        progress: 0,
                        start_date: new Date("2025-11-01"),
                        end_date: new Date("2026-01-09"),

                        weeks: {
                            create: [
                                // WEEK 1 — Nov 1→7
                                {
                                    week_number: 1,
                                    focus: "Arrays Basics",
                                    order_index: 1,
                                    start_date: new Date("2025-11-01"),
                                    end_date: new Date("2025-11-07"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Array Intro Problems",
                                                description: "Solve basics: traversal, insertion, deletion.",
                                                start_date: new Date("2025-11-01"),
                                                end_date: new Date("2025-11-07")
                                            },
                                            {
                                                title: "Pattern Notes",
                                                description: "Understand prefix/suffix ideas.",
                                                start_date: new Date("2025-11-01"),
                                                end_date: new Date("2025-11-07")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 2 — Nov 8→14
                                {
                                    week_number: 2,
                                    focus: "String Manipulation",
                                    order_index: 2,
                                    start_date: new Date("2025-11-08"),
                                    end_date: new Date("2025-11-14"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "String Core Problems",
                                                description: "Palindrome, frequency maps, sliding window basics.",
                                                start_date: new Date("2025-11-08"),
                                                end_date: new Date("2025-11-14")
                                            },
                                            {
                                                title: "String Concepts",
                                                description: "Study common string patterns.",
                                                start_date: new Date("2025-11-08"),
                                                end_date: new Date("2025-11-14")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 3 — Nov 15→21
                                {
                                    week_number: 3,
                                    focus: "Recursion Basics",
                                    order_index: 3,
                                    start_date: new Date("2025-11-15"),
                                    end_date: new Date("2025-11-21"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Recursion Tracing",
                                                description: "Understand recursion tree and call stack.",
                                                start_date: new Date("2025-11-15"),
                                                end_date: new Date("2025-11-21")
                                            },
                                            {
                                                title: "Simple Recursion Problems",
                                                description: "Factorial, subset sum intro, sum of digits.",
                                                start_date: new Date("2025-11-15"),
                                                end_date: new Date("2025-11-21")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 4 — Nov 22→28
                                {
                                    week_number: 4,
                                    focus: "Backtracking Essentials",
                                    order_index: 4,
                                    start_date: new Date("2025-11-22"),
                                    end_date: new Date("2025-11-28"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Backtracking Core",
                                                description: "Subsets, permutations, combinations.",
                                                start_date: new Date("2025-11-22"),
                                                end_date: new Date("2025-11-28")
                                            },
                                            {
                                                title: "Backtracking Patterns",
                                                description: "N-Queens, Sudoku basics.",
                                                start_date: new Date("2025-11-22"),
                                                end_date: new Date("2025-11-28")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 5 — Nov 29→Dec 5
                                {
                                    week_number: 5,
                                    focus: "HashMap + Sets",
                                    order_index: 5,
                                    start_date: new Date("2025-11-29"),
                                    end_date: new Date("2025-12-05"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "HashMap Patterns",
                                                description: "Two sum, anagrams, frequency maps.",
                                                start_date: new Date("2025-11-29"),
                                                end_date: new Date("2025-12-05")
                                            },
                                            {
                                                title: "Set Applications",
                                                description: "Duplicates, unique elements problems.",
                                                start_date: new Date("2025-11-29"),
                                                end_date: new Date("2025-12-05")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 6 — Dec 6→12
                                {
                                    week_number: 6,
                                    focus: "Binary Search",
                                    order_index: 6,
                                    start_date: new Date("2025-12-06"),
                                    end_date: new Date("2025-12-12"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Binary Search Core",
                                                description: "Implement BS variations.",
                                                start_date: new Date("2025-12-06"),
                                                end_date: new Date("2025-12-12")
                                            },
                                            {
                                                title: "BS on Answers",
                                                description: "Problems like allocate pages, min days.",
                                                start_date: new Date("2025-12-06"),
                                                end_date: new Date("2025-12-12")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 7 — Dec 13→19
                                {
                                    week_number: 7,
                                    focus: "Sorting Algorithms",
                                    order_index: 7,
                                    start_date: new Date("2025-12-13"),
                                    end_date: new Date("2025-12-19"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Implement Sorting",
                                                description: "Merge sort, quicksort, heap sort.",
                                                start_date: new Date("2025-12-13"),
                                                end_date: new Date("2025-12-19")
                                            },
                                            {
                                                title: "Sorting Patterns",
                                                description: "Intervals, custom comparator tasks.",
                                                start_date: new Date("2025-12-13"),
                                                end_date: new Date("2025-12-19")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 8 — Dec 20→26
                                {
                                    week_number: 8,
                                    focus: "Sliding Window",
                                    order_index: 8,
                                    start_date: new Date("2025-12-20"),
                                    end_date: new Date("2025-12-26"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Basic Sliding Window",
                                                description: "Fixed window problems.",
                                                start_date: new Date("2025-12-20"),
                                                end_date: new Date("2025-12-26")
                                            },
                                            {
                                                title: "Variable Window",
                                                description: "Longest substring, at most K problems.",
                                                start_date: new Date("2025-12-20"),
                                                end_date: new Date("2025-12-26")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 9 — Dec 27→Jan 2
                                {
                                    week_number: 9,
                                    focus: "Two Pointers",
                                    order_index: 9,
                                    start_date: new Date("2025-12-27"),
                                    end_date: new Date("2026-01-02"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Classic Problems",
                                                description: "3-sum, 4-sum, sorted array tasks.",
                                                start_date: new Date("2025-12-27"),
                                                end_date: new Date("2026-01-02")
                                            },
                                            {
                                                title: "Edge Cases",
                                                description: "Handling duplicates and bounds.",
                                                start_date: new Date("2025-12-27"),
                                                end_date: new Date("2026-01-02")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 10 — Jan 3→9
                                {
                                    week_number: 10,
                                    focus: "Matrix & Grids",
                                    order_index: 10,
                                    start_date: new Date("2026-01-03"),
                                    end_date: new Date("2026-01-09"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Grid Basics",
                                                description: "Traversal, boundaries, BFS grid.",
                                                start_date: new Date("2026-01-03"),
                                                end_date: new Date("2026-01-09")
                                            },
                                            {
                                                title: "Matrix Patterns",
                                                description: "Prefix sums, diagonals, rotations.",
                                                start_date: new Date("2026-01-03"),
                                                end_date: new Date("2026-01-09")
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },

                    // ======================================================
                    // PHASE 2 — ADVANCED DSA (14 WEEKS)
                    // ======================================================
                    {
                        phase_name: "Phase 2: Advanced DSA",
                        description: "Trees, graphs, DP, heaps, tries, segment trees.",
                        duration: "14 weeks",
                        order_index: 2,
                        progress: 0,
                        start_date: new Date("2026-01-10"),
                        end_date: new Date("2026-04-17"),

                        weeks: {
                            create: [
                                // WEEK 11 — Jan 10→16
                                {
                                    week_number: 11,
                                    focus: "Tree Basics",
                                    order_index: 1,
                                    start_date: new Date("2026-01-10"),
                                    end_date: new Date("2026-01-16"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Tree Traversals",
                                                description: "Inorder, preorder, postorder problems.",
                                                start_date: new Date("2026-01-10"),
                                                end_date: new Date("2026-01-16")
                                            },
                                            {
                                                title: "Tree Concepts",
                                                description: "Height, diameter, balance checking.",
                                                start_date: new Date("2026-01-10"),
                                                end_date: new Date("2026-01-16")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 12 — Jan 17→23
                                {
                                    week_number: 12,
                                    focus: "Binary Search Trees",
                                    order_index: 2,
                                    start_date: new Date("2026-01-17"),
                                    end_date: new Date("2026-01-23"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "BST Operations",
                                                description: "Insert, delete, search, validate BST.",
                                                start_date: new Date("2026-01-17"),
                                                end_date: new Date("2026-01-23")
                                            },
                                            {
                                                title: "BST Patterns",
                                                description: "Kth smallest, floor/ceil problems.",
                                                start_date: new Date("2026-01-17"),
                                                end_date: new Date("2026-01-23")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 13 — Jan 24→30
                                {
                                    week_number: 13,
                                    focus: "Heaps & Priority Queues",
                                    order_index: 3,
                                    start_date: new Date("2026-01-24"),
                                    end_date: new Date("2026-01-30"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Heap Problems",
                                                description: "K largest, heap sort, merge lists.",
                                                start_date: new Date("2026-01-24"),
                                                end_date: new Date("2026-01-30")
                                            },
                                            {
                                                title: "PQ Applications",
                                                description: "Scheduling, frequency sorting tasks.",
                                                start_date: new Date("2026-01-24"),
                                                end_date: new Date("2026-01-30")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 14 — Jan 31→Feb 6
                                {
                                    week_number: 14,
                                    focus: "Graph Traversals",
                                    order_index: 4,
                                    start_date: new Date("2026-01-31"),
                                    end_date: new Date("2026-02-06"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "BFS / DFS",
                                                description: "Graph traversal problems.",
                                                start_date: new Date("2026-01-31"),
                                                end_date: new Date("2026-02-06")
                                            },
                                            {
                                                title: "Connected Components",
                                                description: "Count islands, provinces, groups.",
                                                start_date: new Date("2026-01-31"),
                                                end_date: new Date("2026-02-06")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 15 — Feb 7→13
                                {
                                    week_number: 15,
                                    focus: "Shortest Path Algorithms",
                                    order_index: 5,
                                    start_date: new Date("2026-02-07"),
                                    end_date: new Date("2026-02-13"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Dijkstra",
                                                description: "Solve weighted graph problems.",
                                                start_date: new Date("2026-02-07"),
                                                end_date: new Date("2026-02-13")
                                            },
                                            {
                                                title: "Bellman-Ford & Floyd-Warshall",
                                                description: "Handle negative weights.",
                                                start_date: new Date("2026-02-07"),
                                                end_date: new Date("2026-02-13")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 16 — Feb 14→20
                                {
                                    week_number: 16,
                                    focus: "Advanced Graphs",
                                    order_index: 6,
                                    start_date: new Date("2026-02-14"),
                                    end_date: new Date("2026-02-20"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Topological Sort",
                                                description: "Kahn’s algorithm + DFS topo sorting.",
                                                start_date: new Date("2026-02-14"),
                                                end_date: new Date("2026-02-20")
                                            },
                                            {
                                                title: "SCC Algorithms",
                                                description: "Kosaraju / Tarjan intro.",
                                                start_date: new Date("2026-02-14"),
                                                end_date: new Date("2026-02-20")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 17 — Feb 21→27
                                {
                                    week_number: 17,
                                    focus: "DP Basics (1D)",
                                    order_index: 7,
                                    start_date: new Date("2026-02-21"),
                                    end_date: new Date("2026-02-27"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Classic 1D DP",
                                                description: "Climbing stairs, house robber.",
                                                start_date: new Date("2026-02-21"),
                                                end_date: new Date("2026-02-27")
                                            },
                                            {
                                                title: "Tabulation + Memoization",
                                                description: "Implement both approaches.",
                                                start_date: new Date("2026-02-21"),
                                                end_date: new Date("2026-02-27")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 18 — Feb 28→Mar 6
                                {
                                    week_number: 18,
                                    focus: "DP on Grids",
                                    order_index: 8,
                                    start_date: new Date("2026-02-28"),
                                    end_date: new Date("2026-03-06"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Grid DP Problems",
                                                description: "Unique paths, min path sum.",
                                                start_date: new Date("2026-02-28"),
                                                end_date: new Date("2026-03-06")
                                            },
                                            {
                                                title: "Blocked Grid Cases",
                                                description: "Variants with obstacles.",
                                                start_date: new Date("2026-02-28"),
                                                end_date: new Date("2026-03-06")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 19 — Mar 7→13
                                {
                                    week_number: 19,
                                    focus: "DP on Subsequences",
                                    order_index: 9,
                                    start_date: new Date("2026-03-07"),
                                    end_date: new Date("2026-03-13"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "LIS + LCS",
                                                description: "Classic subsequence DP.",
                                                start_date: new Date("2026-03-07"),
                                                end_date: new Date("2026-03-13")
                                            },
                                            {
                                                title: "Edit Distance",
                                                description: "String DP practice.",
                                                start_date: new Date("2026-03-07"),
                                                end_date: new Date("2026-03-13")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 20 — Mar 14→20
                                {
                                    week_number: 20,
                                    focus: "Knapsack Variants",
                                    order_index: 10,
                                    start_date: new Date("2026-03-14"),
                                    end_date: new Date("2026-03-20"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "0/1 Knapsack",
                                                description: "Basic + intermediate problems.",
                                                start_date: new Date("2026-03-14"),
                                                end_date: new Date("2026-03-20")
                                            },
                                            {
                                                title: "Unbounded Knapsack",
                                                description: "Coin change patterns.",
                                                start_date: new Date("2026-03-14"),
                                                end_date: new Date("2026-03-20")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 21 — Mar 21→27
                                {
                                    week_number: 21,
                                    focus: "Greedy Algorithms",
                                    order_index: 11,
                                    start_date: new Date("2026-03-21"),
                                    end_date: new Date("2026-03-27"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Greedy Core Problems",
                                                description: "Intervals, scheduling, activity selection.",
                                                start_date: new Date("2026-03-21"),
                                                end_date: new Date("2026-03-27")
                                            },
                                            {
                                                title: "Greedy vs DP",
                                                description: "When greedy works, when it fails.",
                                                start_date: new Date("2026-03-21"),
                                                end_date: new Date("2026-03-27")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 22 — Mar 28→Apr 3
                                {
                                    week_number: 22,
                                    focus: "Trie + String Algorithms",
                                    order_index: 12,
                                    start_date: new Date("2026-03-28"),
                                    end_date: new Date("2026-04-03"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Trie Problems",
                                                description: "Prefix tree building, search, autocomplete.",
                                                start_date: new Date("2026-03-28"),
                                                end_date: new Date("2026-04-03")
                                            },
                                            {
                                                title: "String Algorithms",
                                                description: "KMP intro + pattern search basics.",
                                                start_date: new Date("2026-03-28"),
                                                end_date: new Date("2026-04-03")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 23 — Apr 4→10
                                {
                                    week_number: 23,
                                    focus: "Segment Trees",
                                    order_index: 13,
                                    start_date: new Date("2026-04-04"),
                                    end_date: new Date("2026-04-10"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Segment Tree Build",
                                                description: "Range queries: sum, min.",
                                                start_date: new Date("2026-04-04"),
                                                end_date: new Date("2026-04-10")
                                            },
                                            {
                                                title: "Segment Tree Updates",
                                                description: "Lazy propagation basics.",
                                                start_date: new Date("2026-04-04"),
                                                end_date: new Date("2026-04-10")
                                            }
                                        ]
                                    }
                                },

                                // WEEK 24 — Apr 11→17
                                {
                                    week_number: 24,
                                    focus: "Fenwick Tree + Mixed Advanced",
                                    order_index: 14,
                                    start_date: new Date("2026-04-11"),
                                    end_date: new Date("2026-04-17"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Fenwick Tree",
                                                description: "Binary indexed tree problems.",
                                                start_date: new Date("2026-04-11"),
                                                end_date: new Date("2026-04-17")
                                            },
                                            {
                                                title: "Advanced Review",
                                                description: "Mixed advanced revision problems.",
                                                start_date: new Date("2026-04-11"),
                                                end_date: new Date("2026-04-17")
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },

                    // ======================================================
                    // PHASE 3 — INTERVIEW PREP (10 WEEKS)
                    // ======================================================
                    {
                        phase_name: "Phase 3: Interview Prep",
                        description: "Mixed problem solving, mocks, revision, company patterns.",
                        duration: "10 weeks",
                        order_index: 3,
                        progress: 0,
                        start_date: new Date("2026-04-18"),
                        end_date: new Date("2026-06-30"),

                        weeks: {
                            create: [
                                // Week 25 — Apr 18→24
                                {
                                    week_number: 25,
                                    focus: "Mixed Medium Problems",
                                    order_index: 1,
                                    start_date: new Date("2026-04-18"),
                                    end_date: new Date("2026-04-24"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Medium Set 1",
                                                description: "Solve mixed medium problems.",
                                                start_date: new Date("2026-04-18"),
                                                end_date: new Date("2026-04-24")
                                            },
                                            {
                                                title: "Topic Review",
                                                description: "Revise the toughest areas so far.",
                                                start_date: new Date("2026-04-18"),
                                                end_date: new Date("2026-04-24")
                                            }
                                        ]
                                    }
                                },

                                // Week 26 — Apr 25→May 1
                                {
                                    week_number: 26,
                                    focus: "Mixed Hard Problems",
                                    order_index: 2,
                                    start_date: new Date("2026-04-25"),
                                    end_date: new Date("2026-05-01"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Hard Set 1",
                                                description: "Tackle difficult DSA questions.",
                                                start_date: new Date("2026-04-25"),
                                                end_date: new Date("2026-05-01")
                                            },
                                            {
                                                title: "Hard Patterns",
                                                description: "Understand complex problem approaches.",
                                                start_date: new Date("2026-04-25"),
                                                end_date: new Date("2026-05-01")
                                            }
                                        ]
                                    }
                                },

                                // Week 27 — May 2→8
                                {
                                    week_number: 27,
                                    focus: "Revision: Arrays & Strings",
                                    order_index: 3,
                                    start_date: new Date("2026-05-02"),
                                    end_date: new Date("2026-05-08"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Revision Set",
                                                description: "Revisit arrays + strings.",
                                                start_date: new Date("2026-05-02"),
                                                end_date: new Date("2026-05-08")
                                            },
                                            {
                                                title: "Notes Cleanup",
                                                description: "Organize notes & patterns.",
                                                start_date: new Date("2026-05-02"),
                                                end_date: new Date("2026-05-08")
                                            }
                                        ]
                                    }
                                },

                                // Week 28 — May 9→15
                                {
                                    week_number: 28,
                                    focus: "Revision: Trees & Graphs",
                                    order_index: 4,
                                    start_date: new Date("2026-05-09"),
                                    end_date: new Date("2026-05-15"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Tree Revision",
                                                description: "Most important tree problems.",
                                                start_date: new Date("2026-05-09"),
                                                end_date: new Date("2026-05-15")
                                            },
                                            {
                                                title: "Graph Revision",
                                                description: "Revisit BFS, DFS, shortest paths.",
                                                start_date: new Date("2026-05-09"),
                                                end_date: new Date("2026-05-15")
                                            }
                                        ]
                                    }
                                },

                                // Week 29 — May 16→22
                                {
                                    week_number: 29,
                                    focus: "Revision: DP",
                                    order_index: 5,
                                    start_date: new Date("2026-05-16"),
                                    end_date: new Date("2026-05-22"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "DP Revision Set",
                                                description: "Key DP problems: LIS, LCS, knapsack.",
                                                start_date: new Date("2026-05-16"),
                                                end_date: new Date("2026-05-22")
                                            },
                                            {
                                                title: "DP Patterns",
                                                description: "Pattern recognition & simplification.",
                                                start_date: new Date("2026-05-16"),
                                                end_date: new Date("2026-05-22")
                                            }
                                        ]
                                    }
                                },

                                // Week 30 — May 23→29
                                {
                                    week_number: 30,
                                    focus: "Company Sets",
                                    order_index: 6,
                                    start_date: new Date("2026-05-23"),
                                    end_date: new Date("2026-05-29"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Top Tech Companies",
                                                description: "Google/Amazon/Meta-style problems.",
                                                start_date: new Date("2026-05-23"),
                                                end_date: new Date("2026-05-29")
                                            },
                                            {
                                                title: "Company Sheets",
                                                description: "Popular interview lists.",
                                                start_date: new Date("2026-05-23"),
                                                end_date: new Date("2026-05-29")
                                            }
                                        ]
                                    }
                                },

                                // Week 31 — May 30→Jun 5
                                {
                                    week_number: 31,
                                    focus: "150 Must-Do LeetCode",
                                    order_index: 7,
                                    start_date: new Date("2026-05-30"),
                                    end_date: new Date("2026-06-05"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Set A",
                                                description: "Top 150 curated coding interview set.",
                                                start_date: new Date("2026-05-30"),
                                                end_date: new Date("2026-06-05")
                                            },
                                            {
                                                title: "Analysis",
                                                description: "Break down patterns & shortcuts.",
                                                start_date: new Date("2026-05-30"),
                                                end_date: new Date("2026-06-05")
                                            }
                                        ]
                                    }
                                },

                                // Week 32 — Jun 6→12
                                {
                                    week_number: 32,
                                    focus: "Mock Interviews Round 1",
                                    order_index: 8,
                                    start_date: new Date("2026-06-06"),
                                    end_date: new Date("2026-06-12"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Mock Round",
                                                description: "Simulated interviews.",
                                                start_date: new Date("2026-06-06"),
                                                end_date: new Date("2026-06-12")
                                            },
                                            {
                                                title: "Feedback Review",
                                                description: "Fix weak areas.",
                                                start_date: new Date("2026-06-06"),
                                                end_date: new Date("2026-06-12")
                                            }
                                        ]
                                    }
                                },

                                // Week 33 — Jun 13→19
                                {
                                    week_number: 33,
                                    focus: "Mock Interviews Round 2",
                                    order_index: 9,
                                    start_date: new Date("2026-06-13"),
                                    end_date: new Date("2026-06-19"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Mock Round 2",
                                                description: "Higher difficulty mock interviews.",
                                                start_date: new Date("2026-06-13"),
                                                end_date: new Date("2026-06-19")
                                            },
                                            {
                                                title: "Performance Tracking",
                                                description: "Analyze improvement.",
                                                start_date: new Date("2026-06-13"),
                                                end_date: new Date("2026-06-19")
                                            }
                                        ]
                                    }
                                },

                                // Week 34 — Jun 20→30
                                {
                                    week_number: 34,
                                    focus: "Final Prep & Light Practice",
                                    order_index: 10,
                                    start_date: new Date("2026-06-20"),
                                    end_date: new Date("2026-06-30"),
                                    tasks: {
                                        create: [
                                            {
                                                title: "Final Practice",
                                                description: "Solve a mix of easy–medium problems.",
                                                start_date: new Date("2026-06-20"),
                                                end_date: new Date("2026-06-30")
                                            },
                                            {
                                                title: "Mental Prep",
                                                description: "Confidence building + revision.",
                                                start_date: new Date("2026-06-20"),
                                                end_date: new Date("2026-06-30")
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        ,
        include: {
            milestones: true,
            phases: {
                include: {
                    weeks: {
                        include: {
                            tasks: true,
                        },
                    },
                },
            },
        },
    });

    console.log(`✅ Created Roadmap (id: ${roadmap.id}) with phases, weeks, and tasks`);

    console.log('🌱 Seeding complete!');
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
