import { PrismaClient, Difficulty, ResourceType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting static data seeding...');

    const exams = [
        {
            name: 'JEE',
            description: 'Joint Entrance Examination for engineering aspirants.',
            default_duration_weeks: 24,
            subjects: [
                {
                    name: 'Physics',
                    topics: [
                        {
                            name: 'Units and Measurements',
                            description: 'Basic physical quantities, dimensional analysis, and error analysis.',
                            difficulty: Difficulty.easy,
                        },
                        {
                            name: 'Kinematics',
                            description: 'Motion in one and two dimensions, graphs, and relative motion.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Laws of Motion',
                            description: 'Newton’s laws, friction, tension, and equilibrium of forces.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Work, Energy and Power',
                            description: 'Work-energy theorem, conservative and non-conservative forces, power relations.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Rotational Motion',
                            description: 'Torque, moment of inertia, angular momentum, rolling motion.',
                            difficulty: Difficulty.hard,
                        },
                        {
                            name: 'Gravitation',
                            description: 'Universal law of gravitation, gravitational potential energy, satellite motion.',
                            difficulty: Difficulty.medium,
                        },

                        // --- Thermodynamics ---
                        {
                            name: 'Thermal Properties of Matter',
                            description: 'Expansion, heat transfer, specific heat capacity, and thermal equilibrium.',
                            difficulty: Difficulty.easy,
                        },
                        {
                            name: 'Thermodynamics',
                            description: 'Laws of thermodynamics, internal energy, heat engines, and entropy.',
                            difficulty: Difficulty.hard,
                        },
                        {
                            name: 'Kinetic Theory of Gases',
                            description: 'Pressure, mean free path, and degrees of freedom of gases.',
                            difficulty: Difficulty.medium,
                        },

                        // --- Waves & Optics ---
                        {
                            name: 'Oscillations',
                            description: 'Simple harmonic motion, damping, resonance, and energy in SHM.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Waves',
                            description: 'Types of waves, superposition, standing waves, Doppler effect.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Ray Optics',
                            description: 'Reflection, refraction, mirrors, lenses, and optical instruments.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Wave Optics',
                            description: 'Interference, diffraction, and polarization of light.',
                            difficulty: Difficulty.hard,
                        },

                        // --- Electromagnetism ---
                        {
                            name: 'Electric Charges and Fields',
                            description: 'Coulomb’s law, electric field, flux, and Gauss’s theorem.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Electrostatic Potential and Capacitance',
                            description: 'Potential energy, capacitors, dielectric materials.',
                            difficulty: Difficulty.hard,
                        },
                        {
                            name: 'Current Electricity',
                            description: 'Ohm’s law, resistors in series/parallel, Kirchhoff’s laws.',
                            difficulty: Difficulty.easy,
                        },
                        {
                            name: 'Moving Charges and Magnetism',
                            description: 'Lorentz force, Biot-Savart law, Ampere’s law.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Magnetism and Matter',
                            description: 'Magnetic properties of materials, earth’s magnetism, hysteresis.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Electromagnetic Induction',
                            description: 'Faraday’s laws, Lenz’s law, eddy currents, and self-induction.',
                            difficulty: Difficulty.hard,
                        },
                        {
                            name: 'Alternating Current',
                            description: 'AC circuits, impedance, resonance, transformers, power factor.',
                            difficulty: Difficulty.hard,
                        },

                        // --- Modern Physics ---
                        {
                            name: 'Electromagnetic Waves',
                            description: 'Displacement current, Maxwell’s equations, spectrum classification.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Dual Nature of Radiation and Matter',
                            description: 'Photoelectric effect, de Broglie hypothesis, electron emission.',
                            difficulty: Difficulty.hard,
                        },
                        {
                            name: 'Atoms and Nuclei',
                            description: 'Atomic models, radioactivity, nuclear reactions, binding energy.',
                            difficulty: Difficulty.medium,
                        },
                        {
                            name: 'Semiconductors and Communication Systems',
                            description: 'PN junctions, diodes, transistors, logic gates, modulation techniques.',
                            difficulty: Difficulty.medium,
                        },
                    ],
                },
                {
                    name: 'Chemistry',
                    topics: [
                        // PHYSICAL CHEMISTRY
                        { name: 'Some Basic Concepts of Chemistry', description: 'Mole concept, chemical equations, and stoichiometry.', difficulty: Difficulty.easy },
                        { name: 'States of Matter', description: 'Gaseous and liquid states, ideal gas law, and intermolecular forces.', difficulty: Difficulty.easy },
                        { name: 'Atomic Structure', description: 'Bohr’s model, quantum numbers, and electronic configuration.', difficulty: Difficulty.easy },
                        { name: 'Chemical Bonding', description: 'Ionic, covalent, and coordinate bonds, VSEPR theory, hybridization.', difficulty: Difficulty.medium },
                        { name: 'Thermodynamics', description: 'First law, enthalpy, internal energy, Hess’s law, and spontaneity.', difficulty: Difficulty.hard },
                        { name: 'Equilibrium', description: 'Chemical and ionic equilibrium, Le Chatelier’s principle, pH, buffers.', difficulty: Difficulty.medium },
                        { name: 'Redox Reactions', description: 'Oxidation-reduction concepts, balancing, and electrochemical cells.', difficulty: Difficulty.easy },
                        { name: 'Electrochemistry', description: 'Nernst equation, galvanic and electrolytic cells, conductivity.', difficulty: Difficulty.medium },
                        { name: 'Chemical Kinetics', description: 'Rate laws, order of reaction, activation energy, and Arrhenius equation.', difficulty: Difficulty.medium },
                        { name: 'Surface Chemistry', description: 'Adsorption, catalysts, colloids, and emulsions.', difficulty: Difficulty.medium },

                        // INORGANIC CHEMISTRY
                        { name: 'Classification of Elements and Periodicity', description: 'Modern periodic law, periodic properties, and trends.', difficulty: Difficulty.easy },
                        { name: 'Hydrogen', description: 'Properties, isotopes, hydrides, and water.', difficulty: Difficulty.easy },
                        { name: 's-Block Elements', description: 'Alkali and alkaline earth metals, trends, and compounds.', difficulty: Difficulty.medium },
                        { name: 'p-Block Elements (Group 13–18)', description: 'Boron, carbon, nitrogen, oxygen, halogens, noble gases, and their compounds.', difficulty: Difficulty.hard },
                        { name: 'd and f Block Elements', description: 'Transition and inner transition elements, oxidation states, and color.', difficulty: Difficulty.medium },
                        { name: 'Coordination Compounds', description: 'Werner’s theory, nomenclature, isomerism, and bonding theories.', difficulty: Difficulty.hard },
                        { name: 'Environmental Chemistry', description: 'Pollution, ozone depletion, greenhouse effect, and water treatment.', difficulty: Difficulty.easy },

                        // ORGANIC CHEMISTRY
                        { name: 'Some Basic Principles of Organic Chemistry', description: 'Nomenclature, resonance, inductive effect, reaction mechanisms.', difficulty: Difficulty.medium },
                        { name: 'Hydrocarbons', description: 'Alkanes, alkenes, alkynes, and aromatic compounds.', difficulty: Difficulty.medium },
                        { name: 'Haloalkanes and Haloarenes', description: 'SN1/SN2 mechanisms, reactivity, and uses.', difficulty: Difficulty.hard },
                        { name: 'Alcohols, Phenols, and Ethers', description: 'Preparation, properties, and reactions.', difficulty: Difficulty.medium },
                        { name: 'Aldehydes, Ketones and Carboxylic Acids', description: 'Carbonyl reactions, nucleophilic addition, and oxidation-reduction.', difficulty: Difficulty.hard },
                        { name: 'Amines', description: 'Classification, basicity, and diazonium salts.', difficulty: Difficulty.medium },
                        { name: 'Biomolecules', description: 'Carbohydrates, proteins, vitamins, and nucleic acids.', difficulty: Difficulty.easy },
                        { name: 'Polymers', description: 'Addition and condensation polymers, natural and synthetic types.', difficulty: Difficulty.easy },
                        { name: 'Chemistry in Everyday Life', description: 'Drugs, soaps, detergents, and food additives.', difficulty: Difficulty.easy },

                    ],
                },
                {
                    name: 'Mathematics',
                    topics: [
                        // ALGEBRA
                        { name: 'Sets, Relations and Functions', description: 'Sets, types of relations, domain and range of functions, composition.', difficulty: Difficulty.easy },
                        { name: 'Complex Numbers and Quadratic Equations', description: 'Argand plane, modulus-argument form, roots of quadratic equations.', difficulty: Difficulty.medium },
                        { name: 'Matrices and Determinants', description: 'Matrix operations, inverse, properties of determinants, and solving linear equations.', difficulty: Difficulty.medium },
                        { name: 'Permutations and Combinations', description: 'Factorials, arrangements, and combinations with/without repetition.', difficulty: Difficulty.easy },
                        { name: 'Binomial Theorem and Its Applications', description: 'General term, middle term, and approximations.', difficulty: Difficulty.medium },
                        { name: 'Sequences and Series', description: 'AP, GP, HP, and sum to n terms, means, and series manipulation.', difficulty: Difficulty.medium },
                        { name: 'Mathematical Induction', description: 'Principle and application of mathematical induction.', difficulty: Difficulty.easy },

                        // COORDINATE GEOMETRY
                        { name: 'Straight Lines', description: 'Slope, intercepts, angle between lines, distance of a point from a line.', difficulty: Difficulty.easy },
                        { name: 'Circles', description: 'Equation of circle, tangent and normal, common chord.', difficulty: Difficulty.medium },
                        { name: 'Conic Sections', description: 'Parabola, ellipse, and hyperbola—standard forms and properties.', difficulty: Difficulty.hard },
                        { name: 'Three Dimensional Geometry', description: 'Direction cosines, equations of lines and planes, angle between them.', difficulty: Difficulty.hard },

                        // CALCULUS
                        { name: 'Limits, Continuity and Differentiability', description: 'Limits, L’Hôpital’s rule, continuity and differentiability.', difficulty: Difficulty.medium },
                        { name: 'Differentiation', description: 'Derivative formulas, chain rule, implicit differentiation, and higher order derivatives.', difficulty: Difficulty.easy },
                        { name: 'Applications of Derivatives', description: 'Tangents, normals, maxima and minima, monotonicity, and approximation.', difficulty: Difficulty.hard },
                        { name: 'Integrals', description: 'Indefinite and definite integrals, substitution, parts, and properties.', difficulty: Difficulty.medium },
                        { name: 'Applications of Integrals', description: 'Area under curves and between curves.', difficulty: Difficulty.medium },
                        { name: 'Differential Equations', description: 'Order, degree, formation, and solutions of differential equations.', difficulty: Difficulty.hard },

                        // TRIGONOMETRY
                        { name: 'Trigonometric Ratios and Identities', description: 'Basic identities, transformations, and formulae.', difficulty: Difficulty.easy },
                        { name: 'Trigonometric Equations', description: 'General solutions and transformations.', difficulty: Difficulty.medium },
                        { name: 'Properties of Triangles', description: 'Sine, cosine, and projection rules; area of triangle.', difficulty: Difficulty.medium },
                        { name: 'Inverse Trigonometric Functions', description: 'Principal values and properties of inverse trig functions.', difficulty: Difficulty.medium },

                        // VECTOR ALGEBRA
                        { name: 'Vectors', description: 'Dot and cross products, scalar triple product, and geometric interpretation.', difficulty: Difficulty.hard },

                        // STATISTICS AND PROBABILITY
                        { name: 'Statistics', description: 'Mean, variance, and standard deviation of grouped data.', difficulty: Difficulty.easy },
                        { name: 'Probability', description: 'Conditional probability, Bayes’ theorem, random variables, and distribution.', difficulty: Difficulty.hard },

                        // MATHEMATICAL REASONING
                        { name: 'Mathematical Reasoning', description: 'Statements, logic, and truth tables.', difficulty: Difficulty.easy },

                    ],
                },
            ],
            resources: [
                { title: 'PW JEE Physics Playlist', type: ResourceType.video, url: 'https://youtube.com/pw-jee-physics' },
                { title: 'NTA JEE Syllabus PDF', type: ResourceType.pdf, url: 'https://nta.ac.in/JEE/Syllabus' },
            ],
        },
        {
            name: 'Placement Prep (CS)',
            description: 'Preparation roadmap for coding interviews and tech placements.',
            default_duration_weeks: 20,
            subjects: [
                {
                    name: 'Data Structures',
                    topics: [
                        // INTRODUCTION & BASICS
                        { name: 'Time and Space Complexity', description: 'Big O, Omega, Theta notations, best/worst/average cases.', difficulty: Difficulty.easy },
                        { name: 'Recursion', description: 'Recursive functions, base cases, stack memory, tail recursion.', difficulty: Difficulty.medium },
                        { name: 'Mathematics for DSA', description: 'Number theory, modular arithmetic, combinatorics basics.', difficulty: Difficulty.medium },

                        // ARRAYS & STRINGS
                        { name: 'Arrays', description: 'Static and dynamic arrays, insertion, deletion, traversal, and prefix sums.', difficulty: Difficulty.easy },
                        { name: 'Strings', description: 'String manipulation, pattern matching, hashing, and sliding window.', difficulty: Difficulty.medium },
                        { name: 'Two Pointer Technique', description: 'Optimized searching and partitioning on arrays and strings.', difficulty: Difficulty.medium },
                        { name: 'Sorting Algorithms', description: 'Bubble, selection, insertion, merge, quick, heap, counting, and radix sort.', difficulty: Difficulty.easy },
                        { name: 'Searching Algorithms', description: 'Linear search, binary search, and applications like lower/upper bounds.', difficulty: Difficulty.easy },

                        // LINKED LISTS
                        { name: 'Singly Linked List', description: 'Creation, traversal, insertion, deletion, and reversal.', difficulty: Difficulty.medium },
                        { name: 'Doubly and Circular Linked List', description: 'Forward-backward traversal and circular implementation.', difficulty: Difficulty.hard },
                        { name: 'Linked List Problems', description: 'Cycle detection, intersection, merge point, and flattening lists.', difficulty: Difficulty.hard },

                        // STACKS & QUEUES
                        { name: 'Stacks', description: 'Implementation using arrays or linked lists, infix-postfix conversion.', difficulty: Difficulty.medium },
                        { name: 'Queues', description: 'Circular queue, deque, priority queue, and applications.', difficulty: Difficulty.medium },
                        { name: 'Monotonic Stack/Queue', description: 'Used for next greater/smaller element problems.', difficulty: Difficulty.hard },

                        // TREES
                        { name: 'Binary Trees', description: 'Tree traversals (inorder, preorder, postorder), height, diameter.', difficulty: Difficulty.medium },
                        { name: 'Binary Search Trees', description: 'Insertion, deletion, search, inorder property.', difficulty: Difficulty.medium },
                        { name: 'Balanced Trees', description: 'AVL, Red-Black, and Segment Trees basics.', difficulty: Difficulty.hard },
                        { name: 'Heaps', description: 'Min and max heaps, heapify, heap sort, and priority queues.', difficulty: Difficulty.medium },
                        { name: 'Tries', description: 'Prefix trees used in string search, autocomplete, and dictionary problems.', difficulty: Difficulty.hard },

                        // GRAPHS
                        { name: 'Graph Representation', description: 'Adjacency list/matrix, BFS, DFS traversal.', difficulty: Difficulty.medium },
                        { name: 'Shortest Path Algorithms', description: 'Dijkstra, Bellman-Ford, and Floyd-Warshall.', difficulty: Difficulty.hard },
                        { name: 'Minimum Spanning Tree', description: 'Prim’s and Kruskal’s algorithms.', difficulty: Difficulty.hard },
                        { name: 'Topological Sorting', description: 'DFS-based and Kahn’s algorithm.', difficulty: Difficulty.hard },
                        { name: 'Union-Find (Disjoint Set Union)', description: 'Union by rank, path compression, and applications.', difficulty: Difficulty.hard },

                        // DYNAMIC PROGRAMMING
                        { name: 'Introduction to DP', description: 'Overlapping subproblems, memoization, tabulation.', difficulty: Difficulty.medium },
                        { name: '1D Dynamic Programming', description: 'Fibonacci, climbing stairs, house robber problems.', difficulty: Difficulty.medium },
                        { name: '2D Dynamic Programming', description: 'Knapsack, subset sum, longest common subsequence, matrix paths.', difficulty: Difficulty.hard },
                        { name: 'String DP', description: 'Edit distance, palindrome partitioning, wildcard matching.', difficulty: Difficulty.hard },
                        { name: 'DP on Subsequences', description: 'LIS, subset sums, count partitions.', difficulty: Difficulty.hard },

                        // GREEDY ALGORITHMS
                        { name: 'Greedy Approach Basics', description: 'Activity selection, coin change, interval problems.', difficulty: Difficulty.medium },
                        { name: 'Huffman Encoding', description: 'Greedy compression algorithm for optimal prefix codes.', difficulty: Difficulty.hard },

                        // BACKTRACKING
                        { name: 'Backtracking Basics', description: 'Exploring all possibilities via recursion.', difficulty: Difficulty.medium },
                        { name: 'Standard Problems', description: 'N-Queens, Sudoku solver, permutations & combinations.', difficulty: Difficulty.hard },

                        // HASHING
                        { name: 'Hash Maps and Sets', description: 'Collision handling, chaining, and open addressing.', difficulty: Difficulty.medium },
                        { name: 'Prefix Hashing', description: 'Used in substring and pattern matching.', difficulty: Difficulty.hard },

                        // MISCELLANEOUS
                        { name: 'Bit Manipulation', description: 'Bitwise operators, subset generation, and optimization.', difficulty: Difficulty.medium },
                        { name: 'Sliding Window', description: 'Variable and fixed window problems on arrays and strings.', difficulty: Difficulty.medium },
                        { name: 'Divide and Conquer', description: 'Merge sort, quick sort, binary search tree construction.', difficulty: Difficulty.medium },
                        { name: 'Mathematical Algorithms', description: 'Sieve of Eratosthenes, GCD, LCM, modular exponentiation.', difficulty: Difficulty.medium },
                        { name: 'Advanced Topics', description: 'Segment trees, Fenwick trees, and range queries.', difficulty: Difficulty.hard },
                    ],
                },
                {
                    name: 'Java',
                    topics: [
                        { name: 'Introduction to Java', description: 'Features of Java, JVM, JRE, and JDK overview.', difficulty: Difficulty.easy },
                        { name: 'Data Types and Variables', description: 'Primitive and non-primitive types, literals, and variable scope.', difficulty: Difficulty.easy },
                        { name: 'Operators and Expressions', description: 'Arithmetic, logical, relational, and bitwise operators.', difficulty: Difficulty.easy },
                        { name: 'Control Statements', description: 'If-else, loops, switch, break, continue statements.', difficulty: Difficulty.easy },
                        { name: 'Methods in Java', description: 'Method definition, parameters, return types, and overloading.', difficulty: Difficulty.easy },
                        { name: 'Arrays', description: 'Single and multidimensional arrays, array methods, and iteration.', difficulty: Difficulty.medium },
                        { name: 'Strings and StringBuffer', description: 'String immutability, methods, and mutable StringBuffer/StringBuilder.', difficulty: Difficulty.medium },
                        { name: 'Object-Oriented Concepts', description: 'Class, object, encapsulation, abstraction, inheritance, polymorphism.', difficulty: Difficulty.medium },
                        { name: 'Constructors', description: 'Default, parameterized, and copy constructors.', difficulty: Difficulty.easy },
                        { name: 'Inheritance', description: 'Super keyword, method overriding, and class hierarchy.', difficulty: Difficulty.medium },
                        { name: 'Polymorphism', description: 'Compile-time (overloading) and runtime (overriding) polymorphism.', difficulty: Difficulty.medium },
                        { name: 'Abstraction', description: 'Abstract classes, interfaces, and design philosophy.', difficulty: Difficulty.medium },
                        { name: 'Encapsulation', description: 'Private fields, getters/setters, and data hiding.', difficulty: Difficulty.easy },
                        { name: 'Packages and Access Modifiers', description: 'Public, private, protected, default access, and package structure.', difficulty: Difficulty.easy },
                        { name: 'Exception Handling', description: 'Try-catch-finally, throw/throws, custom exceptions.', difficulty: Difficulty.medium },
                        { name: 'Wrapper Classes and Autoboxing', description: 'Conversion between primitives and objects.', difficulty: Difficulty.easy },
                        { name: 'Static and Final Keywords', description: 'Static blocks, static variables, and constants.', difficulty: Difficulty.easy },
                        { name: 'Inner Classes', description: 'Member, static, local, and anonymous inner classes.', difficulty: Difficulty.medium },
                        { name: 'Interfaces and Abstract Classes', description: 'Differences, default and static methods in interfaces.', difficulty: Difficulty.medium },
                        { name: 'Enums', description: 'Enumeration types, values(), and switch usage.', difficulty: Difficulty.easy },
                        { name: 'Collections Framework', description: 'List, Set, Map, Queue, and their implementations.', difficulty: Difficulty.hard },
                        { name: 'Generics', description: 'Type safety, generic methods, and bounded type parameters.', difficulty: Difficulty.hard },
                        { name: 'Iterators and Streams', description: 'Iterator, ListIterator, Stream API operations.', difficulty: Difficulty.hard },
                        { name: 'File I/O', description: 'FileReader, FileWriter, BufferedReader, and serialization.', difficulty: Difficulty.medium },
                        { name: 'Multithreading', description: 'Thread class, Runnable, synchronization, and inter-thread communication.', difficulty: Difficulty.hard },
                        { name: 'Synchronization', description: 'Locks, synchronized blocks, and thread safety.', difficulty: Difficulty.hard },
                        { name: 'Lambda Expressions', description: 'Functional interfaces and concise function syntax.', difficulty: Difficulty.medium },
                        { name: 'Functional Interfaces', description: 'Predicate, Function, Consumer, Supplier interfaces.', difficulty: Difficulty.medium },
                        { name: 'Stream API', description: 'map, filter, reduce, and terminal operations.', difficulty: Difficulty.hard },
                        { name: 'JVM and Memory Management', description: 'Class loading, garbage collection, and memory areas.', difficulty: Difficulty.hard },
                        { name: 'Exception vs Error', description: 'Checked, unchecked exceptions, and error handling differences.', difficulty: Difficulty.medium },
                        { name: 'Annotations', description: 'Built-in and custom annotations, reflection API.', difficulty: Difficulty.hard },
                        { name: 'Serialization and Deserialization', description: 'Persisting and restoring objects using Serializable interface.', difficulty: Difficulty.medium },
                        { name: 'Java 8 Features', description: 'Streams, lambdas, Optional, and new Date-Time API.', difficulty: Difficulty.hard },
                        { name: 'Java Memory Model', description: 'Heap, stack, metaspace, and garbage collection algorithms.', difficulty: Difficulty.hard },
                        { name: 'Best Practices', description: 'Naming conventions, immutability, and clean code standards.', difficulty: Difficulty.medium },
                    ]
                },
                {
                    name: 'Networking Basics',
                    topics: [
                        // INTRODUCTION & BASICS
                        { name: 'Introduction to Computer Networks', description: 'Definition, components, and advantages of networking.', difficulty: Difficulty.easy },
                        { name: 'Types of Networks', description: 'LAN, MAN, WAN, PAN, and their characteristics.', difficulty: Difficulty.easy },
                        { name: 'Network Topologies', description: 'Star, bus, ring, mesh, hybrid topologies and their use cases.', difficulty: Difficulty.easy },
                        { name: 'Transmission Modes', description: 'Simplex, half-duplex, and full-duplex communication.', difficulty: Difficulty.easy },
                        { name: 'Network Devices', description: 'Switches, routers, hubs, bridges, gateways, and modems.', difficulty: Difficulty.easy },

                        // NETWORK MODELS
                        { name: 'OSI Model', description: 'Seven-layer architecture, functions of each layer.', difficulty: Difficulty.medium },
                        { name: 'TCP/IP Model', description: 'Layers, protocols, and comparison with OSI model.', difficulty: Difficulty.medium },
                        { name: 'Encapsulation and Decapsulation', description: 'Process of data flow through OSI/TCP-IP layers.', difficulty: Difficulty.medium },

                        // PHYSICAL LAYER
                        { name: 'Transmission Media', description: 'Guided (twisted pair, coaxial, fiber) and unguided media.', difficulty: Difficulty.medium },
                        { name: 'Data Encoding and Modulation', description: 'Digital-to-analog and analog-to-digital conversion techniques.', difficulty: Difficulty.hard },
                        { name: 'Bandwidth and Data Rate', description: 'Nyquist and Shannon capacity theorems.', difficulty: Difficulty.hard },

                        // DATA LINK LAYER
                        { name: 'Framing and Error Control', description: 'Framing methods, parity, CRC, and checksum.', difficulty: Difficulty.medium },
                        { name: 'Flow Control and ARQ Protocols', description: 'Stop-and-wait, sliding window, Go-Back-N, and Selective Repeat.', difficulty: Difficulty.hard },
                        { name: 'MAC and Ethernet', description: 'CSMA/CD, CSMA/CA, and Ethernet standards.', difficulty: Difficulty.medium },
                        { name: 'Switching Techniques', description: 'Circuit, packet, and message switching.', difficulty: Difficulty.medium },

                        // NETWORK LAYER
                        { name: 'IPv4 and IPv6 Addressing', description: 'Address classes, subnetting, supernetting, and IPv6 features.', difficulty: Difficulty.hard },
                        { name: 'Routing Algorithms', description: 'Distance vector, link state, and hierarchical routing.', difficulty: Difficulty.hard },
                        { name: 'IP Routing Protocols', description: 'RIP, OSPF, BGP, and ICMP overview.', difficulty: Difficulty.hard },
                        { name: 'NAT and DHCP', description: 'Address translation and dynamic IP assignment.', difficulty: Difficulty.medium },

                        // TRANSPORT LAYER
                        { name: 'UDP and TCP', description: 'Connectionless vs connection-oriented communication.', difficulty: Difficulty.medium },
                        { name: 'TCP Segment Structure', description: 'Header fields, sequence numbers, and flags.', difficulty: Difficulty.hard },
                        { name: 'Flow and Error Control', description: 'TCP sliding window, congestion control, and retransmission.', difficulty: Difficulty.hard },
                        { name: 'Three-Way Handshake', description: 'Connection establishment and termination in TCP.', difficulty: Difficulty.medium },

                        // APPLICATION LAYER
                        { name: 'DNS (Domain Name System)', description: 'Name resolution, hierarchy, and resource records.', difficulty: Difficulty.medium },
                        { name: 'HTTP and HTTPS', description: 'Request/response model, methods, and secure communication.', difficulty: Difficulty.easy },
                        { name: 'FTP and SMTP', description: 'File transfer and mail protocols.', difficulty: Difficulty.medium },
                        { name: 'DHCP and SNMP', description: 'Dynamic IP configuration and network management.', difficulty: Difficulty.medium },

                        // NETWORK SECURITY & MISC
                        { name: 'Firewalls and VPNs', description: 'Network security layers, tunneling, and encryption.', difficulty: Difficulty.hard },
                        { name: 'Cryptography Basics', description: 'Symmetric and asymmetric key encryption concepts.', difficulty: Difficulty.hard },
                        { name: 'Network Troubleshooting', description: 'Ping, traceroute, and basic diagnostic tools.', difficulty: Difficulty.easy },
                        { name: 'Wireless Networks', description: 'Wi-Fi standards, access points, and signal propagation.', difficulty: Difficulty.medium },
                        { name: 'Mobile and Sensor Networks', description: 'Ad-hoc networks and IoT communication basics.', difficulty: Difficulty.hard },
                    ]
                },
                {
                    name: 'Databse Management System',
                    topics: [
                        { name: 'Introduction to DBMS', description: 'Overview of databases, data models, and DBMS architecture.', difficulty: Difficulty.easy },
                        { name: 'Entity-Relationship Model', description: 'ER diagrams, entities, relationships, attributes, and cardinality.', difficulty: Difficulty.easy },
                        { name: 'Relational Model', description: 'Relational algebra, keys, constraints, and schemas.', difficulty: Difficulty.medium },
                        { name: 'SQL Basics', description: 'DDL, DML, DCL commands, queries, and joins.', difficulty: Difficulty.easy },
                        { name: 'Advanced SQL', description: 'Nested queries, views, triggers, stored procedures, and indexing.', difficulty: Difficulty.medium },
                        { name: 'Normalization', description: 'Functional dependencies, anomalies, and normal forms (1NF to BCNF).', difficulty: Difficulty.medium },
                        { name: 'Transaction Management', description: 'ACID properties, commit, rollback, and concurrency control.', difficulty: Difficulty.hard },
                        { name: 'Concurrency Control', description: 'Locking mechanisms, deadlocks, and timestamp ordering.', difficulty: Difficulty.hard },
                        { name: 'Recovery System', description: 'Failure classification, log-based recovery, checkpoints.', difficulty: Difficulty.hard },
                        { name: 'Database Storage & Indexing', description: 'File organization, B and B+ trees, hashing.', difficulty: Difficulty.medium },
                        { name: 'Query Processing & Optimization', description: 'Query evaluation plan, cost estimation, optimization techniques.', difficulty: Difficulty.hard },
                        { name: 'Distributed Databases', description: 'Fragmentation, replication, and distributed transactions.', difficulty: Difficulty.hard },
                        { name: 'NoSQL Databases', description: 'Key-value, document, column, and graph databases.', difficulty: Difficulty.medium },
                        { name: 'Database Security', description: 'Authorization, authentication, and encryption in DBMS.', difficulty: Difficulty.medium },
                        { name: 'Database Design Case Study', description: 'Practical ER to relational mapping for a real-world system.', difficulty: Difficulty.medium }
                    ]
                }
            ],
            resources: [
                { title: 'Striver’s DSA Sheet', type: ResourceType.link, url: 'https://takeuforward.org/strivers-sheet' },
                { title: 'NeetCode Roadmap', type: ResourceType.link, url: 'https://neetcode.io/roadmap' },
            ],
        },
        {
            name: 'UPSC',
            description: 'Comprehensive preparation roadmap for the UPSC Civil Services Examination.',
            default_duration_weeks: 52,
            subjects: [
                {
                    name: 'History',
                    topics: [
                        // ANCIENT INDIA
                        { name: 'Prehistoric Cultures', description: 'Stone Age, Chalcolithic cultures, and early settlements.', difficulty: Difficulty.easy },
                        { name: 'Indus Valley Civilization', description: 'Urban planning, art, economy, religion, and decline theories.', difficulty: Difficulty.medium },
                        { name: 'Vedic Period', description: 'Early and later Vedic society, polity, economy, and religious practices.', difficulty: Difficulty.medium },
                        { name: 'Mahajanapadas & Buddhism/Jainism', description: '16 Mahajanapadas, teachings of Buddha and Mahavira.', difficulty: Difficulty.hard },

                        // MEDIEVAL INDIA
                        { name: 'Delhi Sultanate', description: 'Slave, Khalji, Tughlaq, Sayyid, and Lodi dynasties and administration.', difficulty: Difficulty.medium },
                        { name: 'Mughal Empire', description: 'Akbar’s policies, mansabdari system, administration, decline of Mughals.', difficulty: Difficulty.hard },
                        { name: 'Bhakti and Sufi Movements', description: 'Philosophy, saints, and cultural influence in medieval India.', difficulty: Difficulty.medium },

                        // MODERN INDIA
                        { name: 'Advent of Europeans', description: 'Portuguese, Dutch, French, British and their expansion.', difficulty: Difficulty.easy },
                        { name: 'Revolt of 1857', description: 'Causes, course, leaders, and impact of the first war of independence.', difficulty: Difficulty.medium },
                        { name: 'Indian National Movement', description: 'Moderates, Extremists, Gandhi era, revolutionaries, and INA.', difficulty: Difficulty.hard },
                        { name: 'Post-independence Consolidation', description: 'Reorganisation of states, integration of princely states.', difficulty: Difficulty.hard }
                    ]
                },

                {
                    name: 'Polity & Governance',
                    topics: [
                        // POLITICAL SYSTEM
                        { name: 'Constitutional Framework', description: 'Preamble, features, philosophy, and making of the Constitution.', difficulty: Difficulty.easy },
                        { name: 'Fundamental Rights', description: 'Rights, restrictions, remedies, and landmark judgments.', difficulty: Difficulty.medium },
                        { name: 'Directive Principles & Fundamental Duties', description: 'Classification and implementation of DPSPs.', difficulty: Difficulty.medium },
                        { name: 'Union Government', description: 'President, Prime Minister, Parliament, Cabinet system.', difficulty: Difficulty.hard },
                        { name: 'State Government', description: 'Governor, CM, Council of Ministers, State Legislature.', difficulty: Difficulty.medium },

                        // GOVERNANCE
                        { name: 'Local Governance', description: '73rd & 74th Amendments, Panchayati Raj, Municipalities.', difficulty: Difficulty.medium },
                        { name: 'Judiciary', description: 'Supreme Court, High Courts, judicial review, PIL.', difficulty: Difficulty.hard },
                        { name: 'Election System', description: 'Election Commission, electoral reforms, anti-defection law.', difficulty: Difficulty.medium },
                        { name: 'Constitutional & Statutory Bodies', description: 'CAG, UPSC, EC, NITI Aayog, NHRC.', difficulty: Difficulty.medium },
                        { name: 'Social Justice', description: 'Welfare schemes, vulnerable sections, rights issues.', difficulty: Difficulty.hard }
                    ]
                },

                {
                    name: 'Geography',
                    topics: [
                        // PHYSICAL GEOGRAPHY
                        { name: 'Earth’s Structure & Landforms', description: 'Plate tectonics, volcanoes, earthquakes, mountain building.', difficulty: Difficulty.hard },
                        { name: 'Climatology', description: 'Atmospheric circulation, monsoon, climate change.', difficulty: Difficulty.medium },
                        { name: 'Oceanography', description: 'Currents, tides, ocean floors, marine resources.', difficulty: Difficulty.hard },

                        // INDIAN GEOGRAPHY
                        { name: 'Physiography of India', description: 'Himalayas, Plains, Plateaus, Coastal areas, Islands.', difficulty: Difficulty.medium },
                        { name: 'Indian Climate', description: 'Monsoon mechanism, climatic regions, climatic hazards.', difficulty: Difficulty.medium },
                        { name: 'Resources of India', description: 'Minerals, agriculture, water, industries.', difficulty: Difficulty.medium },
                        { name: 'Population & Settlement Geography', description: 'Demography, migration, urbanization patterns.', difficulty: Difficulty.medium }
                    ]
                },

                {
                    name: 'Economy',
                    topics: [
                        { name: 'Basic Economic Concepts', description: 'GDP, inflation, fiscal policy, monetary policy.', difficulty: Difficulty.easy },
                        { name: 'Indian Economic Planning', description: 'Five-year plans, NITI Aayog, poverty & unemployment.', difficulty: Difficulty.medium },
                        { name: 'Agriculture Sector', description: 'Green revolution, MSP, PDS, crop insurance.', difficulty: Difficulty.medium },
                        { name: 'Banking & Financial System', description: 'RBI, NPAs, monetary tools, financial markets.', difficulty: Difficulty.hard },
                        { name: 'External Sector', description: 'Balance of payments, forex, WTO, trade policies.', difficulty: Difficulty.hard },
                        { name: 'Infrastructure & Inclusive Growth', description: 'Transport, energy, health, education sectors.', difficulty: Difficulty.medium }
                    ]
                },

                {
                    name: 'Environment & Ecology',
                    topics: [
                        { name: 'Ecosystem & Biodiversity', description: 'Food chains, ecological pyramids, flora & fauna diversity.', difficulty: Difficulty.medium },
                        { name: 'Environmental Pollution', description: 'Air, water, soil pollution, climate change, ozone depletion.', difficulty: Difficulty.medium },
                        { name: 'Conservation Efforts', description: 'Protected areas, IUCN categories, environmental treaties.', difficulty: Difficulty.hard },
                        { name: 'Environmental Impact Assessment', description: 'EIA process, mitigation strategies.', difficulty: Difficulty.medium },
                        { name: 'Disaster Management', description: 'Natural disasters, NDMA guidelines, risk reduction.', difficulty: Difficulty.medium }
                    ]
                },

                {
                    name: 'Science & Technology',
                    topics: [
                        { name: 'Basic Science Concepts', description: 'Physics, Chemistry, Biology fundamentals for UPSC.', difficulty: Difficulty.easy },
                        { name: 'Space Technology', description: 'ISRO missions, satellites, launch vehicles.', difficulty: Difficulty.medium },
                        { name: 'Biotechnology', description: 'Genetic engineering, GM crops, DNA technologies.', difficulty: Difficulty.hard },
                        { name: 'ICT & Cyber Security', description: 'Digital tech, cybersecurity frameworks, internet governance.', difficulty: Difficulty.hard },
                        { name: 'Nanotechnology & New Age Tech', description: 'Applications in industry, medicine, materials.', difficulty: Difficulty.hard }
                    ]
                },

                {
                    name: 'Current Affairs',
                    topics: [
                        { name: 'National Issues', description: 'Government schemes, policies, major national events.', difficulty: Difficulty.medium },
                        { name: 'International Relations', description: 'India’s foreign policy, global groupings, major conflicts.', difficulty: Difficulty.hard },
                        { name: 'Science & Tech News', description: 'Recent developments in S&T, awards, achievements.', difficulty: Difficulty.medium },
                        { name: 'Economic Survey & Budget', description: 'Key trends, policy changes, recommendations.', difficulty: Difficulty.hard }
                    ]
                }
            ],
            resources: [
                { title: 'Laxmikanth Polity Book', type: ResourceType.pdf, url: 'https://example.com/laxmikanth' },
                { title: 'Spectrum Modern History', type: ResourceType.pdf, url: 'https://example.com/spectrum' },
                { title: 'NCERT Geography PDFs', type: ResourceType.link, url: 'https://ncert.nic.in' },
                { title: 'PIB Daily Updates', type: ResourceType.link, url: 'https://pib.gov.in' }
            ]
        },
        {
            name: 'NEET',
            description: 'Preparation roadmap for the National Eligibility cum Entrance Test (NEET) for medical aspirants.',
            default_duration_weeks: 40,
            subjects: [
                {
                    name: 'Physics',
                    topics: [
                        // MECHANICS
                        { name: 'Units and Measurements', description: 'Physical quantities, dimensional analysis, error analysis.', difficulty: Difficulty.easy },
                        { name: 'Motion in a Straight Line', description: 'Kinematics, position-time, velocity-time graphs.', difficulty: Difficulty.easy },
                        { name: 'Motion in a Plane', description: 'Projectile motion, relative motion, vectors.', difficulty: Difficulty.medium },
                        { name: 'Laws of Motion', description: 'Newton’s laws, friction, circular motion.', difficulty: Difficulty.medium },
                        { name: 'Work, Energy and Power', description: 'Work-energy theorem, conservative forces.', difficulty: Difficulty.medium },
                        { name: 'System of Particles', description: 'Center of mass, torque, angular momentum.', difficulty: Difficulty.hard },
                        { name: 'Rotational Motion', description: 'Moment of inertia, rotational dynamics.', difficulty: Difficulty.hard },
                        { name: 'Gravitation', description: 'Kepler’s laws, gravitational potential, satellites.', difficulty: Difficulty.medium },

                        // PROPERTIES OF MATTER
                        { name: 'Mechanical Properties of Solids', description: 'Stress-strain curve, Young’s modulus.', difficulty: Difficulty.medium },
                        { name: 'Mechanical Properties of Fluids', description: 'Viscosity, Pascal’s law, Bernoulli’s principle.', difficulty: Difficulty.medium },
                        { name: 'Thermal Properties of Matter', description: 'Expansion, calorimetry, thermal conduction.', difficulty: Difficulty.easy },

                        // THERMODYNAMICS & KTG
                        { name: 'Thermodynamics', description: 'First and second laws, heat engines, refrigerators.', difficulty: Difficulty.hard },
                        { name: 'Kinetic Theory of Gases', description: 'Pressure, mean free path, degrees of freedom.', difficulty: Difficulty.medium },

                        // OSCILLATIONS & WAVES
                        { name: 'Oscillations', description: 'SHM, energy, damped & forced oscillations.', difficulty: Difficulty.medium },
                        { name: 'Waves', description: 'Longitudinal and transverse waves, Doppler effect.', difficulty: Difficulty.medium },

                        // ELECTROSTATICS & CURRENT ELECTRICITY
                        { name: 'Electric Charges and Fields', description: 'Coulomb’s law, electric flux.', difficulty: Difficulty.medium },
                        { name: 'Electrostatic Potential and Capacitance', description: 'Capacitors, potential energy.', difficulty: Difficulty.hard },
                        { name: 'Current Electricity', description: 'Ohm’s law, resistors, Kirchhoff’s laws.', difficulty: Difficulty.easy },

                        // MAGNETISM & EM WAVES
                        { name: 'Magnetic Effects of Current', description: 'Biot-Savart law, Ampere’s law.', difficulty: Difficulty.medium },
                        { name: 'Magnetism and Matter', description: 'Magnetic materials and properties.', difficulty: Difficulty.medium },
                        { name: 'Electromagnetic Induction', description: 'Faraday’s law, Lenz’s law.', difficulty: Difficulty.hard },
                        { name: 'Alternating Current', description: 'AC circuits, resonance, transformers.', difficulty: Difficulty.hard },
                        { name: 'Electromagnetic Waves', description: 'Spectrum, properties, Maxwell’s contribution.', difficulty: Difficulty.easy },

                        // OPTICS & MODERN PHYSICS
                        { name: 'Ray Optics', description: 'Reflection, refraction, lenses, optical instruments.', difficulty: Difficulty.medium },
                        { name: 'Wave Optics', description: 'Interference, diffraction, polarization.', difficulty: Difficulty.hard },
                        { name: 'Dual Nature of Radiation and Matter', description: 'Photoelectric effect, de Broglie wavelength.', difficulty: Difficulty.hard },
                        { name: 'Atoms and Nuclei', description: 'Radioactivity, nuclear models.', difficulty: Difficulty.medium },
                        { name: 'Semiconductors', description: 'Diodes, transistors, logic gates.', difficulty: Difficulty.medium }
                    ]
                },

                {
                    name: 'Chemistry',
                    topics: [
                        // PHYSICAL CHEMISTRY
                        { name: 'Some Basic Concepts of Chemistry', description: 'Mole concept, stoichiometry.', difficulty: Difficulty.easy },
                        { name: 'Structure of Atom', description: 'Quantum numbers, orbitals, Bohr model.', difficulty: Difficulty.easy },
                        { name: 'Classification of Elements', description: 'Periodic trends, properties.', difficulty: Difficulty.easy },
                        { name: 'Chemical Bonding', description: 'Hybridization, VSEPR, molecular orbital theory.', difficulty: Difficulty.medium },
                        { name: 'States of Matter', description: 'Gas laws, kinetic theory.', difficulty: Difficulty.easy },
                        { name: 'Thermodynamics', description: 'Enthalpy, entropy, spontaneity.', difficulty: Difficulty.hard },
                        { name: 'Equilibrium', description: 'Chemical & ionic equilibrium.', difficulty: Difficulty.medium },
                        { name: 'Redox Reactions', description: 'Oxidation, reduction, balancing.', difficulty: Difficulty.easy },
                        { name: 'Solutions', description: 'Colligative properties, solubility.', difficulty: Difficulty.medium },
                        { name: 'Chemical Kinetics', description: 'Rate laws, activation energy.', difficulty: Difficulty.medium },
                        { name: 'Electrochemistry', description: 'Nernst equation, cells.', difficulty: Difficulty.hard },
                        { name: 'Surface Chemistry', description: 'Adsorption, colloids.', difficulty: Difficulty.medium },

                        // INORGANIC CHEMISTRY
                        { name: 'Hydrogen', description: 'Properties, compounds.', difficulty: Difficulty.easy },
                        { name: 's-Block Elements', description: 'Alkali & alkaline earth metals.', difficulty: Difficulty.medium },
                        { name: 'p-Block Elements', description: 'Group 13–18 elements & compounds.', difficulty: Difficulty.hard },
                        { name: 'd and f-Block Elements', description: 'Transition metals, lanthanides.', difficulty: Difficulty.medium },
                        { name: 'Coordination Compounds', description: 'Werner theory, isomerism.', difficulty: Difficulty.hard },
                        { name: 'Environmental Chemistry', description: 'Pollution, atmosphere.', difficulty: Difficulty.easy },

                        // ORGANIC CHEMISTRY
                        { name: 'Basic Principles of Organic Chemistry', description: 'Nomenclature, mechanisms, effects.', difficulty: Difficulty.medium },
                        { name: 'Hydrocarbons', description: 'Alkanes, alkenes, alkynes, aromatics.', difficulty: Difficulty.medium },
                        { name: 'Haloalkanes and Haloarenes', description: 'Reactivity, SN1/SN2.', difficulty: Difficulty.hard },
                        { name: 'Alcohols, Phenols, Ethers', description: 'Preparation, reactions.', difficulty: Difficulty.medium },
                        { name: 'Aldehydes, Ketones and Carboxylic Acids', description: 'Carbonyl chemistry.', difficulty: Difficulty.hard },
                        { name: 'Amines', description: 'Basicity, diazonium salts.', difficulty: Difficulty.medium },
                        { name: 'Biomolecules', description: 'Carbohydrates, proteins, nucleic acids.', difficulty: Difficulty.easy },
                        { name: 'Polymers', description: 'Types & preparation.', difficulty: Difficulty.easy },
                        { name: 'Chemistry in Everyday Life', description: 'Drugs, soaps, food additives.', difficulty: Difficulty.easy }
                    ]
                },

                {
                    name: 'Biology',
                    topics: [
                        // BOTANY – MOLECULAR BASIS
                        { name: 'Cell Structure and Function', description: 'Cell theory, organelles, membranes.', difficulty: Difficulty.easy },
                        { name: 'Biomolecules', description: 'Proteins, carbs, lipids, enzymes.', difficulty: Difficulty.easy },
                        { name: 'Plant Kingdom', description: 'Algae to angiosperms classification.', difficulty: Difficulty.medium },
                        { name: 'Morphology of Flowering Plants', description: 'Root, stem, leaf, flower structures.', difficulty: Difficulty.easy },
                        { name: 'Anatomy of Flowering Plants', description: 'Tissues, stomatal mechanisms.', difficulty: Difficulty.medium },
                        { name: 'Plant Physiology', description: 'Photosynthesis, respiration, plant hormones.', difficulty: Difficulty.hard },

                        // ZOOLOGY – HUMAN BIOLOGY
                        { name: 'Structural Organization in Animals', description: 'Animal tissues & examples.', difficulty: Difficulty.easy },
                        { name: 'Human Physiology – Digestion', description: 'Digestive enzymes and processes.', difficulty: Difficulty.medium },
                        { name: 'Human Physiology – Respiration', description: 'Gas exchange, transport.', difficulty: Difficulty.medium },
                        { name: 'Human Physiology – Circulation', description: 'Blood, heart, ECG.', difficulty: Difficulty.hard },
                        { name: 'Human Physiology – Neural Control', description: 'Neurons, synapses, brain.', difficulty: Difficulty.hard },
                        { name: 'Human Physiology – Hormonal Control', description: 'Endocrine glands and pathways.', difficulty: Difficulty.hard },

                        // GENETICS, EVOLUTION, BIOTECH
                        { name: 'Genetics', description: 'Mendelian genetics, linkage, mutations.', difficulty: Difficulty.hard },
                        { name: 'Evolution', description: 'Darwinism, speciation, evidence.', difficulty: Difficulty.medium },
                        { name: 'Biotechnology', description: 'Recombinant DNA, cloning, PCR.', difficulty: Difficulty.hard },

                        // ECOLOGY
                        { name: 'Ecosystems', description: 'Energy flow, nutrient cycles.', difficulty: Difficulty.medium },
                        { name: 'Biodiversity & Conservation', description: 'Threats, conservation strategies.', difficulty: Difficulty.medium },
                        { name: 'Environmental Issues', description: 'Pollution, climate change.', difficulty: Difficulty.easy }
                    ]
                }
            ],
            resources: [
                { title: 'NCERT Biology Class 11 & 12', type: ResourceType.link, url: 'https://ncert.nic.in' },
                { title: 'Physics Wallah NEET Playlist', type: ResourceType.video, url: 'https://youtube.com/pw-neet' },
                { title: 'NTA NEET Syllabus PDF', type: ResourceType.pdf, url: 'https://nta.ac.in' }
            ]
        }


    ];

    for (const exam of exams) {
        const createdExam = await prisma.exam.upsert({
            where: { name: exam.name },
            update: {},
            create: {
                name: exam.name,
                description: exam.description,
                default_duration_weeks: exam.default_duration_weeks,
            },
        });
        console.log(`✅ Exam: ${exam.name}`);

        // Create subjects + topics
        for (const subject of exam.subjects) {
            const createdSubject = await prisma.subject.upsert({
                where: {
                    exam_id_name: { exam_id: createdExam.id, name: subject.name },
                },
                update: {},
                create: {
                    exam_id: createdExam.id,
                    name: subject.name,
                },
            });

            for (const topic of subject.topics) {
                await prisma.topic.upsert({
                    where: {
                        subject_id_name: { subject_id: createdSubject.id, name: topic.name },
                    },
                    update: {},
                    create: {
                        subject_id: createdSubject.id,
                        name: topic.name,
                        description: topic.description,
                        difficulty: topic.difficulty,
                    },
                });
            }
        }

        // Add resources
        for (const resource of exam.resources) {
            await prisma.resource.create({
                data: {
                    exam_id: createdExam.id,
                    title: resource.title,
                    type: resource.type,
                    url: resource.url,
                },
            });
        }
    }

    console.log('🌟 Seeding completed successfully!');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        prisma.$disconnect();
        process.exit(1);
    });
