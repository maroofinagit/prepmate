import { db } from '@/app/lib/db'

import { Difficulty, ResourceType } from '@/generated/prisma/enums';

async function main() {

    const subjects = [
        {
            name: "Political Theory",
            description:
                "Study fundamental political concepts and major political traditions that shape the understanding of politics, society, and the state.",

            topics: [
                {
                    name: "Liberty",
                    description: "Study the concept, dimensions, and political significance of liberty.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Equality",
                    description: "Understand different conceptions and dimensions of political and social equality.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Justice",
                    description: "Examine major ideas and debates surrounding political and social justice.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Rights",
                    description: "Understand the nature, foundations, and significance of rights in political theory.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Democracy",
                    description: "Study the meaning, principles, forms, and political significance of democracy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Power",
                    description: "Understand major approaches to the concept and exercise of political power.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Citizenship",
                    description: "Study the concept of citizenship and its political and social dimensions.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Liberalism",
                    description: "Study the core principles and political development of liberalism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conservatism",
                    description: "Understand the political principles and traditions associated with conservatism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Socialism",
                    description: "Study the principles, development, and political arguments of socialism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Marxism",
                    description: "Understand Marxist approaches to society, politics, class, and the state.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Feminism",
                    description: "Study feminist approaches to politics, power, equality, and society.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Ecologism",
                    description: "Understand political approaches centered on ecology, environment, and sustainability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Multiculturalism",
                    description: "Study political theories concerning cultural diversity, identity, and coexistence.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Postmodernism",
                    description: "Understand postmodern approaches to politics, power, knowledge, and society.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Political Thought",
            description:
                "Study major Western political thinkers and their influential ideas concerning the state, politics, society, freedom, power, and justice.",

            topics: [
                {
                    name: "Confucius",
                    description: "Study Confucian political thought and its ideas concerning society, morality, and governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Plato",
                    description: "Examine Plato's political philosophy, ideal state, justice, and philosopher-king.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Aristotle",
                    description: "Study Aristotle's ideas on the state, citizenship, constitutions, and political life.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Machiavelli",
                    description: "Understand Machiavelli's approach to political power, statecraft, and political realism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Hobbes",
                    description: "Study Hobbes's social contract, state of nature, sovereignty, and absolute authority.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Locke",
                    description: "Examine Locke's ideas on natural rights, consent, limited government, and property.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Rousseau",
                    description: "Study Rousseau's social contract, general will, freedom, and popular sovereignty.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Hegel",
                    description: "Understand Hegel's ideas concerning history, state, freedom, and civil society.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Mary Wollstonecraft",
                    description: "Study Wollstonecraft's arguments concerning women's rights, education, and equality.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "John Stuart Mill",
                    description: "Examine Mill's ideas on liberty, individuality, representative government, and women's rights.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Karl Marx",
                    description: "Study Marx's political thought concerning class, capitalism, state, and revolution.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Gramsci",
                    description: "Understand Gramsci's concepts of hegemony, civil society, intellectuals, and political struggle.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Hannah Arendt",
                    description: "Study Arendt's ideas concerning power, authority, totalitarianism, action, and political life.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Frantz Fanon",
                    description: "Examine Fanon's political thought on colonialism, decolonization, violence, and liberation.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Mao Zedong",
                    description: "Study Mao's political thought, revolutionary strategy, and approach to class and revolution.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "John Rawls",
                    description: "Understand Rawls's theory of justice, fairness, original position, and principles of justice.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Indian Political Thought",
            description:
                "Study major Indian political traditions and thinkers from ancient, medieval, colonial, nationalist, and contemporary India.",

            topics: [
                {
                    name: "Dharamshastra",
                    description: "Study political and social ideas contained within the Dharamshastra tradition.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Kautilya",
                    description: "Examine Kautilya's ideas on statecraft, governance, diplomacy, and political power.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Aggannasutta",
                    description: "Study political and social ideas associated with the Aggannasutta.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Barani",
                    description: "Understand Barani's political thought and ideas concerning governance and political authority.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Kabir",
                    description: "Study Kabir's ideas concerning society, religion, equality, and social criticism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Pandita Ramabai",
                    description: "Examine Pandita Ramabai's ideas on women's rights, education, and social reform.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Bal Gangadhar Tilak",
                    description: "Study Tilak's political ideas, nationalism, and role in the Indian freedom movement.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Swami Vivekanand",
                    description: "Understand Vivekanand's ideas on society, nationalism, culture, and human development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Rabindranath Tagore",
                    description: "Study Tagore's views on nationalism, freedom, humanism, and civilization.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "M.K. Gandhi",
                    description: "Examine Gandhi's ideas on non-violence, truth, Swaraj, politics, society, and ethics.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Sri Aurobindo",
                    description: "Study Sri Aurobindo's ideas on nationalism, spirituality, freedom, and political transformation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Periyar E. V. Ramasamy",
                    description: "Understand Periyar's ideas on caste, social justice, rationalism, and self-respect.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Muhammad Iqbal",
                    description: "Study Iqbal's political thought concerning community, identity, religion, and political order.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "M.N. Roy",
                    description: "Examine M.N. Roy's ideas on Marxism, radical humanism, freedom, and political thought.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "V.D. Savarkar",
                    description: "Study Savarkar's political thought concerning nationalism, Hindutva, and political identity.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Dr. B.R. Ambedkar",
                    description: "Understand Ambedkar's ideas on caste, social justice, democracy, rights, and constitutionalism.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "J.L. Nehru",
                    description: "Study Nehru's ideas on nationalism, democracy, secularism, socialism, and modern India.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Ram Manohar Lohia",
                    description: "Examine Lohia's ideas on socialism, caste, equality, democracy, and social transformation.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Jaya Prakash Narayan",
                    description: "Study Jaya Prakash Narayan's political ideas concerning democracy, socialism, and social change.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Deendayal Upadhyaya",
                    description: "Understand Upadhyaya's political thought and the concept of Integral Humanism.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "Comparative Political Analysis",
            description:
                "Study comparative approaches, political systems, regimes, constitutions, democratization, development, power structures, and political actors.",

            topics: [
                {
                    name: "Institutional Approach",
                    description: "Study institutions as a framework for comparing political systems.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Culture Approach",
                    description: "Understand how political culture is used to compare political systems and behavior.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Economy Approach",
                    description: "Examine political systems through relationships between politics and economic structures.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "New Institutionalism",
                    description: "Study contemporary institutional approaches to comparative political analysis.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Comparative Methods",
                    description: "Understand methods and approaches used to compare political systems and institutions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Colonialism & Decolonization",
                    description: "Study forms of colonialism, anti-colonial struggles, and processes of decolonization.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Nationalism",
                    description: "Examine European and non-European forms and theories of nationalism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "State Theory",
                    description: "Study debates on the state in capitalist and socialist societies, post-colonial states, welfare states, and globalization.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Political Regimes",
                    description: "Compare democratic and non-democratic political regimes and their characteristics.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Constitutions & Constitutionalism",
                    description: "Study forms of constitutions, rule of law, judicial independence, liberal constitutionalism, and constitutional crises.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Democratisation",
                    description: "Understand democratic transition, consolidation, and processes of democratization.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Development",
                    description: "Study underdevelopment, dependency, modernization, world systems theory, development, and democracy.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Structures of Power",
                    description: "Examine ruling classes, power elites, and democratic elitism.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Electoral Systems",
                    description: "Study electoral systems and their influence on political representation and outcomes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Parties & Party Systems",
                    description: "Understand political parties, party systems, and their role in political processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Interest Groups",
                    description: "Study the role and functioning of organized interest groups in political systems.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Social Movements",
                    description: "Understand social movements, new social movements, NGOs, and civil society campaigns.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Revolutions",
                    description: "Study the political nature, causes, processes, and consequences of revolutions.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "International Relations",
            description:
                "Study major approaches, concepts, institutions, conflicts, global political economy, regional organizations, and contemporary international challenges.",

            topics: [
                {
                    name: "Idealism",
                    description: "Understand idealist approaches to international relations and international cooperation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Realism",
                    description: "Study realist approaches to power, state interests, security, and international politics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Structural Marxism",
                    description: "Examine structural Marxist approaches to international relations and global political economy.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Neoliberalism",
                    description: "Study neoliberal approaches to cooperation, institutions, and international relations.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Neorealism",
                    description: "Understand structural realist explanations of international politics and the international system.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Social Constructivism",
                    description: "Study how identities, norms, and social structures shape international relations.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Critical International Theory",
                    description: "Examine critical approaches to power, emancipation, and international order.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Feminism in International Relations",
                    description: "Understand feminist critiques and approaches to international politics and security.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Postmodernism in International Relations",
                    description: "Study postmodern approaches to discourse, power, identity, and international politics.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "State, State System & Non-State Actors",
                    description: "Understand states, the international state system, and the growing role of non-state actors.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Power & Sovereignty",
                    description: "Study the concepts of power and sovereignty in international relations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Traditional & Non-Traditional Security",
                    description: "Compare conventional security concerns with emerging non-traditional security challenges.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conflict & Peace",
                    description: "Study changing warfare, weapons of mass destruction, deterrence, conflict resolution, and transformation.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "United Nations",
                    description: "Study the aims, objectives, structure, functioning, peace and development role, and humanitarian intervention of the UN.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "International Law & International Criminal Court",
                    description: "Understand international law and the role of the International Criminal Court.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Economy of International Relations",
                    description: "Study globalization, global governance, Bretton Woods institutions, North-South dialogue, WTO, G-20, and BRICS.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Regional Organisations",
                    description: "Study the European Union, African Union, Shanghai Cooperation Organisation, and ASEAN.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "International Terrorism",
                    description: "Understand terrorism as a contemporary challenge in international relations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Climate Change & Environmental Concerns",
                    description: "Study international political responses to climate change and environmental challenges.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Human Rights",
                    description: "Examine human rights as a major concern in international relations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Migration & Refugees",
                    description: "Study international political issues surrounding migration and refugees.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Poverty & Development",
                    description: "Understand international dimensions of poverty and development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Religion, Culture & Identity Politics",
                    description: "Study the role of religion, culture, and identity in contemporary international politics.",
                    difficulty: Difficulty.hard,
                },
            ],
        },

        {
            name: "India's Foreign Policy",
            description:
                "Study the foundations, evolution, strategic relationships, international engagements, negotiation strategies, and contemporary challenges of India's foreign policy.",

            topics: [
                {
                    name: "India as a Postcolonial State",
                    description: "Understand India's foreign policy through its postcolonial identity.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India as a Developmental State",
                    description: "Study the development perspective shaping India's foreign policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India as a Rising Power",
                    description: "Examine India's evolving role and position as a rising power.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India as an Emerging Political Economy",
                    description: "Understand India's foreign policy in relation to its emerging economic position.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Principles & Determinants of Foreign Policy",
                    description: "Study the major principles and domestic and international determinants of India's foreign policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Non-Alignment Movement",
                    description: "Study the historical background and contemporary relevance of the Non-Aligned Movement.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India's Nuclear Policy",
                    description: "Understand the foundations and major dimensions of India's nuclear policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India-USA Relations",
                    description: "Study the evolution and major dimensions of India's relationship with the United States.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India-USSR/Russia Relations",
                    description: "Examine India's historical and contemporary relations with the USSR and Russia.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India-China Relations",
                    description: "Study the major dimensions and developments in India's relationship with China.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & European Union",
                    description: "Understand India's engagement with the European Union.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & BRICS",
                    description: "Study India's engagement with BRICS and its role in multipolar international politics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & ASEAN",
                    description: "Examine India's relations and strategic engagement with ASEAN.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & Shanghai Cooperation Organisation",
                    description: "Study India's engagement with the Shanghai Cooperation Organisation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & African Union",
                    description: "Understand India's relations and engagement with the African Union.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & Southern African Development Community",
                    description: "Study India's engagement with the Southern African Development Community.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & Gulf Cooperation Council",
                    description: "Examine India's relations and engagement with the Gulf Cooperation Council.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & SAARC",
                    description: "Study India's relations with South Asian neighbours through SAARC.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Gujaral Doctrine",
                    description: "Understand the principles and significance of the Gujaral Doctrine in India's neighbourhood policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Look East & Act East Policy",
                    description: "Study the evolution of India's Look East and Act East policies.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Look West Policy",
                    description: "Understand India's approach and engagement toward West Asia and the western region.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & United Nations",
                    description: "Study India's negotiation strategies and engagement within the United Nations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & World Trade Organisation",
                    description: "Understand India's negotiation strategies and interests within the WTO.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & International Monetary Fund",
                    description: "Study India's engagement and negotiation strategies within the IMF.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "India & Intergovernmental Panel on Climate Change",
                    description: "Examine India's engagement with international climate governance through the IPCC.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Maritime Security",
                    description: "Study maritime security as a contemporary challenge for India's foreign policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Energy Security",
                    description: "Understand India's foreign policy concerns related to energy security.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Environmental Security",
                    description: "Study environmental security challenges affecting India's international relations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Migrants & Refugees",
                    description: "Examine migration and refugee issues as contemporary foreign policy challenges.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Water Resources",
                    description: "Understand international and regional political challenges related to water resources.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "International Terrorism",
                    description: "Study international terrorism as a contemporary challenge to India's foreign policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Cyber Security",
                    description: "Understand cyber security as an emerging challenge in India's international relations.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Political Institutions in India",
            description:
                "Study the making and philosophy of the Indian Constitution, constitutional institutions, Union and State governments, federalism, elections, and constitutional bodies.",

            topics: [
                {
                    name: "Making of the Indian Constitution",
                    description: "Study the colonial heritage and contribution of the Indian National Movement to the making of the Constitution.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Constituent Assembly",
                    description: "Understand the composition, ideological foundations, and constitutional debates of the Constituent Assembly.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Preamble",
                    description: "Study the philosophy, values, and constitutional significance of the Preamble.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Fundamental Rights",
                    description: "Understand the constitutional framework and significance of Fundamental Rights.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Directive Principles",
                    description: "Study the objectives and constitutional significance of the Directive Principles of State Policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Constitutionalism in India",
                    description: "Examine democracy, social change, national unity, checks and balances, and constitutionalism in India.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Basic Structure Debate",
                    description: "Understand the basic structure doctrine and its constitutional significance.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Constitutional Amendments",
                    description: "Study the amendment process and major constitutional amendments.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "President",
                    description: "Understand the constitutional position, powers, and functions of the President of India.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Prime Minister & Council of Ministers",
                    description: "Study the role, powers, and functioning of the Prime Minister and Council of Ministers.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Union Parliament",
                    description: "Understand the structure, role, and functioning of Parliament.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Parliamentary Committees",
                    description: "Study the role and functioning of parliamentary committees.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Supreme Court",
                    description: "Understand the structure, powers, and constitutional role of the Supreme Court.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "High Courts",
                    description: "Study the constitutional position, powers, and functions of High Courts.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Judicial Review",
                    description: "Understand judicial review and its role in constitutional governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Judicial Activism",
                    description: "Study judicial activism and its implications for Indian democracy and governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Judicial Reform",
                    description: "Examine issues and debates concerning reform of the Indian judiciary.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Governor",
                    description: "Study the constitutional position, powers, and role of the Governor in Indian states.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Chief Minister & State Legislature",
                    description: "Understand the executive and legislative institutions at the state level.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Federalism in India",
                    description: "Study India's strong Centre framework, asymmetrical provisions, adaptation, and intergovernmental coordination.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "Inter-State Council",
                    description: "Understand the role of the Inter-State Council and mechanisms of intergovernmental coordination.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Electoral Process",
                    description: "Study the conduct of elections, electoral rules, and electoral processes in India.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Election Commission of India",
                    description: "Understand the constitutional role and functions of the Election Commission of India.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Electoral Reforms",
                    description: "Study major issues, debates, and reforms concerning India's electoral system.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Local Government Institutions",
                    description: "Understand the functioning and reforms of local government institutions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Constitutional & Statutory Bodies",
                    description: "Study major constitutional and statutory institutions and their roles in Indian governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Comptroller & Auditor General",
                    description: "Understand the role and functions of the Comptroller and Auditor General of India.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "National Commission for Scheduled Castes",
                    description: "Study the constitutional role and functions of the National Commission for Scheduled Castes.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "National Commission for Scheduled Tribes",
                    description: "Study the constitutional role and functions of the National Commission for Scheduled Tribes.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "National Human Rights Commission",
                    description: "Understand the role and functions of the National Human Rights Commission.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "National Commission for Women",
                    description: "Study the role and functions of the National Commission for Women.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "National Commission for Minorities",
                    description: "Understand the role and functions of the National Commission for Minorities.",
                    difficulty: Difficulty.easy,
                },
            ],
        },

        {
            name: "Political Processes in India",
            description:
                "Study the relationship between the Indian state, economy, development, identity, social movements, regional politics, gender, political parties, and electoral politics.",

            topics: [
                {
                    name: "Nature of Indian State",
                    description: "Examine debates concerning the nature and character of the Indian state.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Development Planning Model",
                    description: "Study India's development planning model and its political and economic dimensions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "New Economic Policy",
                    description: "Understand the political and economic implications of India's New Economic Policy.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Growth & Human Development",
                    description: "Study the relationship between economic growth and human development in India.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Globalisation",
                    description: "Examine the social and economic implications of globalization in India.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Religion & Identity Politics",
                    description: "Study religion as a basis of identity politics in India.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Tribe & Identity Politics",
                    description: "Understand tribal identity and its role in Indian political processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Caste & Identity Politics",
                    description: "Examine caste-based identities and their political significance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Region & Identity Politics",
                    description: "Study regional identities and their influence on Indian politics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Language & Identity Politics",
                    description: "Understand linguistic identities and their role in Indian political processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Dalit Movements",
                    description: "Study the nature, demands, and political significance of Dalit movements.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Tribal Movements",
                    description: "Examine tribal movements and their political and social demands.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Women's Movements",
                    description: "Study women's movements and their role in social and political transformation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Farmers' Movements",
                    description: "Understand farmers' movements and their political and socio-economic demands.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Labour Movements",
                    description: "Study labour movements and their role in Indian political processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Non-Party Social Formations",
                    description: "Understand social and political formations operating outside formal party structures.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Non-Governmental Organisations",
                    description: "Study the role and political significance of NGOs in Indian society.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Social Action Groups",
                    description: "Understand the role of social action groups in political and social change.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Reorganisation of Indian States",
                    description: "Study the political process and consequences of the reorganisation of Indian states.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "States as Political & Economic Units",
                    description: "Understand states as political and economic units within the Indian federation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Sub-State Regions",
                    description: "Study political processes and identities at the sub-state regional level.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Regional Disparities",
                    description: "Examine regional inequalities and their political implications.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Demand for New States",
                    description: "Understand political movements and demands for the creation of new states.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Gender & Politics in India",
                    description: "Study issues of gender equality and political representation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Parties in India",
                    description: "Study the ideology, organization, and social bases of political parties.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "National Parties",
                    description: "Understand national political parties and their role in Indian politics.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "State Parties",
                    description: "Study state-level political parties and their role in regional politics.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Electoral Participation",
                    description: "Examine participation in electoral politics and factors influencing political participation.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Electoral Contestation",
                    description: "Study competition and contestation among political actors during elections.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Political Representation",
                    description: "Understand representation and its role in Indian electoral politics.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Emerging Trends in Electoral Politics",
                    description: "Study contemporary changes and emerging patterns in Indian electoral politics.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Public Administration",
            description:
                "Study the evolution, theories, approaches, organizational principles, leadership, motivation, communication, conflict management, and contemporary transformation of public administration.",

            topics: [
                {
                    name: "Meaning & Evolution of Public Administration",
                    description: "Understand the meaning, nature, evolution, and development of public administration.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Public & Private Administration",
                    description: "Compare public administration with private administration.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Systems Theory",
                    description: "Understand the systems approach to the study of public administration.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Decision Making Approach",
                    description: "Study decision-making approaches and their application to public administration.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Ecological Approach",
                    description: "Understand the relationship between administrative systems and their social environment.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Scientific Management Theory",
                    description: "Study scientific management and its principles of organizational efficiency.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Rational Choice Theory",
                    description: "Understand rational choice approaches to administrative and political decision-making.",
                    difficulty: Difficulty.hard,
                },
                {
                    name: "New Public Administration",
                    description: "Study the principles, objectives, and development of New Public Administration.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Development Administration",
                    description: "Understand the role of administration in development processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Comparative Public Administration",
                    description: "Study comparative approaches to administrative systems and institutions.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "New Public Management",
                    description: "Understand the principles and practices associated with New Public Management.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Public Administration in Liberalisation & Globalisation",
                    description: "Examine how liberalisation and globalization have changed the nature of public administration.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Bureaucratic Theory",
                    description: "Study bureaucratic organization and its major theoretical principles.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Human Relations Theory",
                    description: "Understand the human relations approach to organizational management.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Leadership",
                    description: "Study major theories and approaches to leadership in organizations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Motivation",
                    description: "Understand major theories of motivation and their application in organizations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Organisational Communication",
                    description: "Study theories and principles of communication within organizations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Chester Barnard's Principles of Communication",
                    description: "Understand Chester Barnard's contribution to organizational communication.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Information Management",
                    description: "Study information management and its role within organizations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Conflict Management",
                    description: "Understand approaches to managing conflict within organizations.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Mary Parker Follett",
                    description: "Study Mary Parker Follett's contribution to organizational conflict management.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Management by Objectives",
                    description: "Understand Management by Objectives and its principles.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Peter Drucker",
                    description: "Study Peter Drucker's contribution to management and Management by Objectives.",
                    difficulty: Difficulty.medium,
                },
            ],
        },

        {
            name: "Governance & Public Policy in India",
            description:
                "Study governance, accountability, institutional control, good governance, grassroots institutions, development planning, e-governance, and public policy in India.",

            topics: [
                {
                    name: "Governance",
                    description: "Understand the meaning, dimensions, and major approaches to governance.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Good Governance",
                    description: "Study the principles and institutional requirements of good governance.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Democratic Governance",
                    description: "Understand governance from the perspective of democracy, participation, and accountability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Role of State, Civil Society & Individuals",
                    description: "Examine the roles of the state, civil society, and individuals in governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Accountability & Control",
                    description: "Study institutional mechanisms for checks, balances, accountability, and administrative control.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Legislative Control over Executive",
                    description: "Understand legislative mechanisms for controlling and supervising the executive.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Administrative & Budgetary Control",
                    description: "Study administrative and budgetary mechanisms used to ensure accountability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Parliamentary Committees",
                    description: "Understand parliamentary committee mechanisms for controlling and scrutinizing government.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Judicial Control",
                    description: "Study judicial control over the legislature and executive.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Administrative Culture",
                    description: "Understand administrative culture and its influence on governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Corruption & Administrative Reforms",
                    description: "Study corruption, its administrative implications, and major reform approaches.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Right to Information",
                    description: "Understand the Right to Information as an institutional mechanism for transparency and good governance.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Consumer Protection Act",
                    description: "Study consumer protection as a mechanism supporting accountability and citizen rights.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Citizen Charter",
                    description: "Understand Citizen Charters and their role in improving public service delivery.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Grievance Redressal",
                    description: "Study mechanisms for addressing citizen grievances in public administration.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Ombudsman",
                    description: "Understand the ombudsman institution as a mechanism of administrative accountability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Lokpal & Lokayukta",
                    description: "Study the role of Lokpal and Lokayukta in controlling corruption and ensuring accountability.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Panchayati Raj Institutions",
                    description: "Understand grassroots governance through Panchayati Raj institutions and their functioning.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Decentralised Planning",
                    description: "Study decentralized approaches to planning and development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Planning for Development",
                    description: "Understand planning approaches used to achieve socio-economic development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Sustainable Development",
                    description: "Study sustainable approaches to development and governance.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Participatory Development",
                    description: "Understand participation of citizens and communities in development processes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "E-Governance",
                    description: "Study the use of information and communication technologies to improve governance and public services.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "NITI Aayog",
                    description: "Understand the role of NITI Aayog in planning, policy, and development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Public Policy & Socio-Economic Development",
                    description: "Study public policy as an instrument for achieving socio-economic development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Housing Policy",
                    description: "Understand public policy approaches concerning housing and shelter.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Health Policy",
                    description: "Study public policy approaches concerning health and healthcare.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Drinking Water Policy",
                    description: "Understand policy approaches concerning access to drinking water.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Food Security",
                    description: "Study public policy concerning food security and access to food.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "MNREGA",
                    description: "Understand MNREGA as a public policy instrument for employment and rural development.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "NHRM",
                    description: "Study NHRM as a public policy initiative in the health sector.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Right to Education",
                    description: "Understand the Right to Education as a public policy instrument for socio-economic development.",
                    difficulty: Difficulty.easy,
                },
                {
                    name: "Monitoring & Evaluation of Public Policy",
                    description: "Study mechanisms used to monitor and evaluate public policy outcomes.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Jansunwai",
                    description: "Understand public hearings as a mechanism for making governance processes accountable.",
                    difficulty: Difficulty.medium,
                },
                {
                    name: "Social Audit",
                    description: "Study social audit as a mechanism for transparency, participation, and accountability.",
                    difficulty: Difficulty.medium,
                },
            ],
        },
    ];

    const resources = [
        {
            title: "UGC NET Official Website",
            type: ResourceType.link,
            url: "https://ugcnet.nta.ac.in/",
        },
        {
            title: "UGC NET Political Science Official Syllabus",
            type: ResourceType.link,
            url: "https://www.ugcnetonline.in/syllabus-new.php",
        },
        {
            title: "UGC NET Political Science Paper 2 — Pradyumn Tripathi",
            type: ResourceType.link,
            url: "https://pearsoned.co.in/web/books/9789367130445_UGC-NET-Paper-2-Political-Science_Pradyumn-Tripathi.aspx",
        },
        {
            title: "NTA UGC NET Political Science — Previous Years' Papers",
            type: ResourceType.link,
            url: "https://www.netugc.com/ugc-net-in-political-science",
        },
        {
            title: "UGC NET Political Science — Solved Question Papers",
            type: ResourceType.link,
            url: "https://www.netugc.com/ugc-net-solved-question-papers-in-political-science",
        },
        {
            title: "UGC NET Political Science Paper 2 — EduSeeker",
            type: ResourceType.video,
            url: "https://www.youtube.com/@EduSeeker",
        },
        {
            title: "Political Science Paper 2 — UGC NET Adda247",
            type: ResourceType.video,
            url: "https://www.youtube.com/@UGCNETAdda247",
        },
        {
            title: "Political Science Paper 2 — Introduction & Strategy",
            type: ResourceType.video,
            url: "https://www.youtube.com/watch?v=WjvGU4975Ck",
        },
        {
            title: "Political Science Paper 2 — Unit-wise PYQ Analysis",
            type: ResourceType.video,
            url: "https://www.youtube.com/watch?v=OIRdhYS_mbU",
        },
        {
            title: "Political Science Paper 2 — Western Political Thought PYQs",
            type: ResourceType.video,
            url: "https://www.youtube.com/watch?v=XSRCtUnWGxg",
        },
        {
            title: "UGC NET Political Science — Rapid Fire Revision",
            type: ResourceType.link,
            url: "https://www.eduseeker.in/",
        },
    ];

    const exam = await db.exam.create({
        data: {
            name: 'UGC NET Paper 2 - Political Science',
            description:
                "Prepare for the UGC NET Paper 2 exam by mastering the latest syllabus, previous year questions, and effective study strategies.",

            default_duration_weeks: 14,

            aiContext: `This roadmap is designed for learners preparing for the UGC NET Paper 2 exam, focusing on the practical skills and knowledge expected in the test. The learning path should emphasize understanding the syllabus, practicing previous year questions, and developing effective study strategies. Every topic should explain why it is important, when it should be applied, and how it helps in cracking the exam. Students should develop proficiency in all sections of the exam while learning to manage time effectively and answer questions accurately. The roadmap should prepare learners to confidently tackle the UGC NET Paper 2 exam with a strong foundation in all key areas.`,

            imageUrl:
                'https://images.pexels.com/photos/8850837/pexels-photo-8850837.jpeg',
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