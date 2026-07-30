"use client";
import { Bug, Clock3, Lightbulb, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { contactFormSubmission } from "../actions/action";

export default function ContactPage() {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const schema = z.object({
        name: z
            .string()
            .trim()
            .min(2, "Please enter your name.")
            .max(100),

        email: z.email("Please enter a valid email address.").trim().max(150),

        subject: z
            .string()
            .trim()
            .min(5, "Subject is too short.")
            .max(150),

        message: z
            .string()
            .trim()
            .min(20, "Please provide a little more detail.")
            .max(1000),
    });

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Handle form submission logic here
        const validation = schema.safeParse(form);
        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0] || "",
                email: fieldErrors.email?.[0] || "",
                subject: fieldErrors.subject?.[0] || "",
                message: fieldErrors.message?.[0] || "",
            });
            setIsSubmitting(false);
            return;
        }

        const res = await contactFormSubmission(form);

        if (!res.success) {
            toast.error(res.message);
            setIsSubmitting(false);
            return;
        }

        toast.success("Your message has been sent successfully!");
        setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
        setErrors({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
        setIsSubmitting(false);

    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Handle form input changes here
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    };


    return (
        <main className="relative overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50 px-8 py-24 shadow-sm md:px-10 pt-32 lg:px-16">

            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <section className="relative text-center">

                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-xs md:text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        Contact PrepMate
                    </span>

                    <h1 className="mt-8 md:text-5xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                        We'd Love to
                        <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {" "}Hear From You
                        </span>
                    </h1>

                    <p className="mx-auto mt-8 max-w-3xl text-sm md:text-base tracking-wide leading-relaxed md:leading-loose text-slate-600">
                        Have a question, found a bug, or have an idea that could make
                        PrepMate even better? We'd love to hear your feedback and are here
                        to help whenever you need us.
                    </p>

                </section>

                {/* Contact Information */}
                <section className="mt-8 md:mt-16">

                    <div className="grid gap-8 lg:grid-cols-2">

                        {/* Contact Card */}

                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50 p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 opacity-60 blur-3xl" />

                            <div className="relative">

                                <div className="flex h-12 aspect-square items-center justify-center rounded-2xl bg-blue-100">
                                    <Mail className=" size-6 md:size-8 text-blue-600" />
                                </div>

                                <h3 className="md:mt-8 mt-6 text-lg md:text-3xl font-bold text-slate-900">
                                    Contact Email
                                </h3>

                                <p className=" mt-2 md:mt-4 leading-relaxed md:leading-loose text-sm md:text-base text-slate-600">
                                    Whether you have a question, want to report a bug, suggest
                                    a new feature, or simply say hello, feel free to reach out.
                                    Every message is personally reviewed.
                                </p>

                                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                                    <p className="text-sm md:text-base text-slate-500">
                                        Email Address
                                    </p>

                                    <a
                                        href={`mailto:${process.env.NEXT_PUBLIC_GMAIL_USER}`}
                                        className="mt-2 inline-block text-sm md:text-lg font-semibold text-blue-600 hover:underline"
                                    >
                                        {process.env.NEXT_PUBLIC_GMAIL_USER}
                                    </a>

                                </div>

                            </div>

                        </div>

                        {/* Response Card */}

                        <div className="relative overflow-hidden rounded-3xl p-10 bg-linear-to-br from-white to-blue-50 border border-slate-200 shadow-xl">

                            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

                            <div className="relative">

                                <div className="flex h-12 aspect-square items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                                    <Clock3 className=" size-6 md:size-8 text-blue-600" />
                                </div>

                                <h3 className="mt-8 text-lg md:text-3xl font-bold">
                                    What to Expect
                                </h3>

                                <div className="md:mt-8 mt-4 space-y-6">

                                    <div>
                                        <p className="text-3xl md:text-5xl font-black">
                                            2–3
                                        </p>

                                        <p className="mt-2 text-slate-600 text-sm md:text-base">
                                            Business Days Response Time
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            Every email matters.
                                        </p>

                                        <p className="mt-2 leading-relaxed md:leading-loose text-sm md:text-base text-slate-600">
                                            We carefully read every message and do our best to
                                            respond as quickly as possible. Your feedback helps
                                            us make PrepMate better for everyone.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                </section>

                {/* Contact Form */}
                <section className="mt-8 md:mt-16 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">

                    <div className="grid lg:grid-cols-5">

                        {/* Left - Form */}

                        <div className="lg:col-span-3 p-8 md:p-10 lg:p-12">

                            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs md:text-sm font-medium text-blue-700">
                                Contact Form
                            </span>

                            <h2 className="mt-5 text-xl md:text-4xl font-bold tracking-tight text-slate-900">
                                Send us a Message
                            </h2>

                            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed md:leading-loose text-slate-600">
                                We'd love to hear from you. Whether it's a question, feedback,
                                bug report, or feature request, simply fill out the form below
                                and we'll get back to you as soon as possible.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="mt-10 space-y-6"
                            >

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* Name */}

                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Full Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            maxLength={100}
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 placeholder:text-sm placeholder:md:text-base"
                                        />

                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Email Address <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            maxLength={150}
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 placeholder:text-sm placeholder:md:text-base"
                                        />

                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Subject */}

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Subject <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        maxLength={150}
                                        placeholder="How can we help?"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 placeholder:text-sm placeholder:md:text-base"
                                    />

                                    {errors.subject && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* Message */}

                                <div>
                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="message"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Message <span className="text-red-500">*</span>
                                        </label>

                                        <span className="text-xs text-slate-400">
                                            {form.message.length}/1000
                                        </span>

                                    </div>

                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={7}
                                        required
                                        maxLength={1000}
                                        placeholder="Tell us a little more..."
                                        value={form.message}
                                        onChange={handleChange}
                                        className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 placeholder:text-sm placeholder:md:text-base"
                                    />

                                    <p className="mt-2 text-sm text-slate-500">
                                        Please avoid sharing passwords or other sensitive personal information.
                                    </p>

                                    {errors.message && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-transparent hover:bg-black px-4 m:px-8 md:py-4 py-2 text-sm md:text-base font-semibold border-black border cursor-pointer hover:text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 "
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>

                            </form>

                        </div>

                        {/* Right Panel */}

                        <div className="relative hidden md:block overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white lg:col-span-2">

                            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
                            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

                            <div className="relative">

                                <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm backdrop-blur">
                                    We're Listening
                                </span>

                                <h3 className="mt-6 text-3xl font-bold leading-tight">
                                    Every Message Helps Us Improve
                                </h3>

                                <p className="mt-5 leading-8 text-slate-300">
                                    We genuinely appreciate every question, bug report, and
                                    suggestion. Your feedback helps us build a better learning
                                    experience for the entire PrepMate community.
                                </p>

                                <div className="mt-10 space-y-6">

                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">
                                                Your Privacy Matters
                                            </h4>

                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Your information is used only to respond to
                                                your inquiry.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                            <Clock3 className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">
                                                Fast Responses
                                            </h4>

                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Most emails receive a reply within
                                                2–3 business days.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                            <Sparkles className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">
                                                Feedback Welcome
                                            </h4>

                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                New ideas and feature requests are always
                                                encouraged.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Separator */}
                <div className="my-12 h-px bg-slate-200" />

                <section>

                    <div className="text-center">
                        <span className=" text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                            FAQs
                        </span>

                        <h2 className="mt-3 text-2xl md:text-4xl font-bold text-slate-900">
                            Frequently Asked Questions
                        </h2>

                        <p className="mx-auto mt-4 px-4 max-w-2xl text-sm md:text-lg text-slate-600">
                            Here are answers to some of the questions we receive most often.
                            If you don't find what you're looking for, feel free to contact us.
                        </p>
                    </div>

                    <div className="mt-6 md:mt-8 grid gap-6">

                        {/* FAQ Item */}

                        <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Bug className="size-6" />
                                </div>

                                <div>
                                    <h3 className="text-base md:text-xl font-semibold text-slate-900">
                                        I found a bug. What should I do?
                                    </h3>

                                    <p className="mt-3 leading-relaxed md:leading-loose text-xs md:text-base text-slate-600">
                                        Please send us an email describing the issue in as much
                                        detail as possible. If you can include screenshots,
                                        error messages, or steps to reproduce the problem, it
                                        will help us investigate and resolve it more quickly.
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* FAQ Item */}

                        <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Lightbulb className="size-6" />
                                </div>

                                <div>
                                    <h3 className="text-base md:text-xl font-semibold text-slate-900">
                                        Can I suggest new features?
                                    </h3>

                                    <p className="mt-3 leading-relaxed md:leading-loose text-xs md:text-base text-slate-600">
                                        Absolutely. We love hearing ideas from our users.
                                        Feature suggestions play an important role in shaping
                                        PrepMate, and every submission is carefully reviewed.
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* FAQ Item */}

                        <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Clock3 className="size-6" />
                                </div>

                                <div>
                                    <h3 className="text-base md:text-xl font-semibold text-slate-900">
                                        How long does support take?
                                    </h3>

                                    <p className="mt-3 leading-relaxed md:leading-loose text-xs md:text-base text-slate-600">
                                        We typically respond within <strong>2–3 business days</strong>.
                                        During periods of high demand, responses may take a
                                        little longer, but every message is answered as soon as
                                        possible.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="mt-12 rounded-3xl bg-slate-900 px-10 py-16 text-center text-white">

                    <h2 className=" text-2xl md:text-4xl font-bold">
                        We're Always Improving PrepMate
                    </h2>

                    <p className="mx-auto mt-6 text-sm md:text-base max-w-2xl text-slate-300">
                        Every question, bug report, and feature suggestion helps us build a
                        better learning platform for everyone.
                    </p>

                </section>

            </div>

        </main>
    );
}