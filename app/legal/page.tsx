import { ChevronUp } from "lucide-react";

export default function LegalPage() {

    const lastUpdatedDate = new Date("2026-07-30");

    return (
        <main className="bg-slate-50 min-h-screen relative scroll-smooth">

            <div className="fixed bottom-6 right-6 z-50">
                <a
                    href="#"
                    className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
                >
                    <ChevronUp className="h-4 w-4" />
                </a>
            </div>

            <div className="max-w-6xl mx-auto px-8 pt-32 pb-12">
                <span className="inline-flex text-xs items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 md:text-sm font-medium text-blue-700">
                    Legal Information
                </span>

                <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                    Schemae Legal Documentation :
                </h1>

                <p className="mt-4 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">
                    Welcome to <span className="font-semibold">Schemae</span>. Your privacy,
                    security, and trust are important to us. This page outlines how we collect
                    and use your information, the terms governing the use of our platform, and
                    how cookies help provide a secure and personalized experience.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>
                        <strong>Last Updated:</strong> {lastUpdatedDate.toDateString()}
                    </span>

                    <span className="hidden sm:block">•</span>

                    <span>
                        <strong>Version:</strong> 1.0
                    </span>
                </div>

                {/* Divider */}
                <div className="my-12 h-px w-full bg-slate-200" />

                {/* Table of Contents */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Table of Contents
                    </h2>

                    <p className="mt-2 text-sm md:text-base text-slate-600">
                        Quickly navigate to any section of our legal documentation.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <a
                            href="#privacy-policy"
                            className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                Privacy Policy
                            </h3>

                            <p className="mt-2 md:text-base text-sm text-slate-600">
                                Learn what information we collect, how it is used, and how we protect
                                your data.
                            </p>
                        </a>

                        <a
                            href="#terms-of-service"
                            className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                Terms of Service
                            </h3>

                            <p className="mt-2 md:text-base text-sm text-slate-600">
                                Review the rules, responsibilities, and conditions for using
                                Schemae.
                            </p>
                        </a>

                        <a
                            href="#cookie-policy"
                            className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                Cookie Policy
                            </h3>

                            <p className="mt-2 md:text-base text-sm text-slate-600">
                                Understand how cookies are used to enhance functionality, security,
                                and your overall experience.
                            </p>
                        </a>
                    </div>
                </section>

                {/* Divider */}
                <div className="my-12 h-px w-full bg-slate-200" />

                <section
                    id="privacy-policy"
                    className="mt-12 scroll-mt-28"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 rounded-full bg-blue-600" />
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Privacy
                            </p>
                            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
                                Privacy Policy
                            </h2>
                        </div>
                    </div>

                    <p className="mt-6 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">
                        At <span className="font-semibold">Schemae</span>, we respect your
                        privacy and are committed to protecting your personal information.
                        This Privacy Policy explains what information we collect, how we use
                        it, and the choices you have regarding your data when using our
                        platform.
                    </p>

                    <div className="mt-10 space-y-10">

                        {/* Information We Collect */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                1. Information We Collect
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                To provide and improve our services, we may collect the
                                following information:
                            </p>

                            <ul className="mt-5 text-xs md:text-base list-disc space-y-2 pl-6 text-slate-600">
                                <li>Name and email address.</li>
                                <li>Profile picture provided by authentication providers.</li>
                                <li>Authentication and account information.</li>
                                <li>Learning progress and completed roadmaps.</li>
                                <li>Quiz attempts and performance statistics.</li>
                                <li>Study preferences and account settings.</li>
                                <li>Device, browser, and usage information.</li>
                            </ul>
                        </div>

                        {/* How We Use */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                2. How We Use Your Information
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                We use your information to operate and improve Schemae,
                                including to:
                            </p>

                            <ul className="mt-5 text-xs md:text-base list-disc space-y-2 pl-6 text-slate-600">
                                <li>Authenticate and secure your account.</li>
                                <li>Save your learning progress.</li>
                                <li>Generate personalized AI-powered study roadmaps.</li>
                                <li>Recommend quizzes and learning resources.</li>
                                <li>Respond to support requests.</li>
                                <li>Monitor platform performance and security.</li>
                                <li>Improve the overall user experience.</li>
                            </ul>
                        </div>

                        {/* Third Parties */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                3. Third-Party Services
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                Schemae relies on trusted third-party providers for certain
                                services, such as authentication, database hosting, AI
                                features, and email delivery. These providers may process
                                information as necessary to provide their services and are
                                governed by their own privacy policies.
                            </p>
                        </div>

                        {/* Security */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                4. Data Security
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                We implement reasonable administrative, technical, and
                                organizational measures to safeguard your information from
                                unauthorized access, disclosure, alteration, or destruction.
                                While we strive to protect your data, no internet-based
                                service can guarantee absolute security.
                            </p>
                        </div>

                        {/* Retention */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                5. Data Retention
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                We retain your information only for as long as necessary to
                                provide our services, comply with legal obligations, resolve
                                disputes, and enforce our agreements. You may request account
                                deletion at any time.
                            </p>
                        </div>

                        {/* Children's Privacy */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                6. Children's Privacy
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                Schemae is not intended for children under the age of 13. We
                                do not knowingly collect personal information from children.
                                If such information is identified, we will take reasonable
                                steps to remove it.
                            </p>
                        </div>

                        {/* Changes */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                7. Changes to This Policy
                            </h3>

                            <p className="mt-3 text-xs md:text-base text-slate-600 leading-relaxed md:leading-loose">
                                We may update this Privacy Policy from time to time. Any
                                changes will be posted on this page with an updated revision
                                date. Continued use of Schemae after changes become effective
                                constitutes acceptance of the updated policy.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Divider */}
                <div className="my-12 h-px w-full bg-slate-200" />

                <section
                    id="terms-of-service"
                    className="mt-12 scroll-mt-28"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 rounded-full bg-blue-600" />
                        <div>
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Terms
                            </p>
                            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
                                Terms of Service
                            </h2>
                        </div>
                    </div>

                    <p className="mt-6 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">
                        These Terms of Service govern your access to and use of
                        <span className="font-semibold"> Schemae</span>. By creating an
                        account or using our platform, you agree to comply with these terms.
                        If you do not agree with any part of these Terms, please discontinue
                        use of the platform.
                    </p>

                    <div className="mt-10 space-y-10">

                        {/* Acceptance */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                1. Acceptance of Terms
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                By accessing or using Schemae, you acknowledge that you have
                                read, understood, and agreed to these Terms of Service and our
                                Privacy Policy.
                            </p>
                        </div>

                        {/* Eligibility */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                2. Eligibility
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                You must be legally permitted to use our services under the
                                laws applicable in your country. If you are under the required
                                age, you should use Schemae only with parental or guardian
                                consent.
                            </p>
                        </div>

                        {/* User Accounts */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                3. User Accounts
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                You are responsible for maintaining the confidentiality of
                                your account credentials and for all activities performed
                                through your account.
                            </p>

                            <ul className="mt-5 text-xs md:text-base list-disc space-y-2 pl-6 text-slate-600">
                                <li>Provide accurate account information.</li>
                                <li>Protect your login credentials.</li>
                                <li>Notify us of any unauthorized account access.</li>
                                <li>You remain responsible for activity under your account.</li>
                            </ul>
                        </div>

                        {/* Acceptable Use */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                4. Acceptable Use
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                While using Schemae, you agree not to:
                            </p>

                            <ul className="mt-5 text-xs md:text-base list-disc space-y-2 pl-6 text-slate-600">
                                <li>Attempt unauthorized access to our systems.</li>
                                <li>Upload malicious software or harmful content.</li>
                                <li>Disrupt or interfere with platform operations.</li>
                                <li>Use bots or automated tools that abuse our services.</li>
                                <li>Violate applicable laws or regulations.</li>
                                <li>Copy, redistribute, or misuse proprietary content.</li>
                            </ul>
                        </div>

                        {/* AI */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                5. AI Features
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Schemae provides AI-powered recommendations, learning
                                roadmaps, quizzes, and educational assistance. While we strive
                                for accuracy, AI-generated responses may occasionally contain
                                inaccuracies or outdated information. Users should verify
                                important academic, professional, or technical information
                                independently.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                6. Intellectual Property
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                All software, branding, logos, designs, text, graphics,
                                educational materials, and platform content are the property
                                of Schemae or their respective owners and are protected by
                                applicable intellectual property laws.
                            </p>
                        </div>

                        {/* Suspension */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                7. Account Suspension or Termination
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                We reserve the right to suspend or terminate accounts that
                                violate these Terms, misuse the platform, or engage in
                                activities that compromise the security, integrity, or
                                availability of Schemae.
                            </p>
                        </div>

                        {/* Liability */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                8. Limitation of Liability
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Schemae is provided on an "as is" and "as available" basis.
                                To the fullest extent permitted by law, we disclaim all
                                warranties and shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages
                                resulting from the use of our platform.
                            </p>
                        </div>

                        {/* Changes */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                9. Changes to These Terms
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                We may revise these Terms from time to time. Updated versions
                                will be published on this page with a revised "Last Updated"
                                date. Continued use of Schemae after changes become effective
                                constitutes acceptance of the revised Terms.
                            </p>
                        </div>

                        {/* Governing Law */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                10. Governing Law
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                These Terms shall be governed and interpreted in accordance
                                with the laws of India, without regard to conflict of law
                                principles.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Divider */}
                <div className="my-12 h-px w-full bg-slate-200" />

                <section
                    id="cookie-policy"
                    className="mt-12 scroll-mt-28"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 rounded-full bg-blue-600" />
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Cookies
                            </p>
                            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
                                Cookie Policy
                            </h2>
                        </div>
                    </div>

                    <p className="mt-6 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">
                        This Cookie Policy explains how <span className="font-semibold">Schemae</span>
                        uses cookies and similar technologies to provide a secure, reliable,
                        and personalized experience while you use our platform.
                    </p>

                    <div className="mt-10 space-y-10">

                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                1. What Are Cookies?
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Cookies are small text files stored on your device by your web
                                browser. They help websites remember information such as your
                                login session, preferences, and settings, making your
                                experience faster and more convenient.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                2. How We Use Cookies
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Schemae uses cookies and similar technologies for purposes
                                including:
                            </p>

                            <ul className="mt-5 text-xs md:text-base list-disc space-y-2 pl-6 text-slate-600">
                                <li>Maintaining secure user sessions.</li>
                                <li>Authenticating user accounts.</li>
                                <li>Remembering user preferences.</li>
                                <li>Improving platform performance.</li>
                                <li>Enhancing security and preventing abuse.</li>
                                <li>Providing a smoother user experience.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                3. Third-Party Cookies
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Some third-party services integrated with Schemae, such as
                                authentication providers or analytics services, may place their
                                own cookies. These cookies are governed by the respective
                                providers' privacy policies.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                4. Managing Cookies
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                Most web browsers allow you to control or disable cookies
                                through their settings. Please note that disabling cookies may
                                affect the functionality of certain features within Schemae,
                                including authentication and personalized experiences.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-semibold text-slate-900">
                                5. Changes to This Cookie Policy
                            </h3>

                            <p className="mt-3 text-xs md:text-base leading-relaxed md:leading-loose text-slate-600">
                                We may update this Cookie Policy periodically to reflect
                                changes in technology, legal requirements, or our services. The
                                latest version will always be available on this page.
                            </p>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}