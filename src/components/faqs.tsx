"use client";

import { motion } from "framer-motion";

export default function FAQs() {
    const faqList = [
        {
            question: "What databases are supported?",
            answer: "Postgres, Supabase, MySQL, and additional integrations are expanding over time."
        },
        {
            question: "Does Tambo generate SQL automatically?",
            answer: "Yes. Tambo handles query generation and analysis automatically behind the scenes."
        },
        {
            question: "Is my data used for training?",
            answer: "No. Your database content is never used for AI model training."
        },
        {
            question: "Can I ask follow-up questions?",
            answer: "Yes. Tambo keeps conversational context across your analysis sessions."
        },
        {
            question: "Do I need to create dashboards?",
            answer: "No. Tambo generates analysis dynamically through conversation."
        },
        {
            question: "Is Tambo free?",
            answer: "Yes. Early access is currently free while the platform evolves."
        }
    ];

    return (
        <section className="py-20 lg:py-28 bg-white border-t border-zinc-100">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center lg:text-left lg:sticky lg:top-24"
                    >
                        <span className="text-sm font-semibold text-emerald-600 tracking-wider uppercase">FAQ</span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Frequently Asked Questions
                        </h2>
                        <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto lg:mx-0">
                            Everything you need to know about Tambo. Can't find what you're looking for? Reach out to our support team.
                        </p>
                    </motion.div>

                    <div className="divide-y divide-zinc-200/80">
                        {faqList.map((item, index) => (
                            <div key={index} className="py-6 first:pt-0 last:pb-0 group transition-all duration-300">
                                <h3 className="text-lg font-semibold text-gray-950 group-hover:text-emerald-600 transition-colors duration-200">
                                    {item.question}
                                </h3>
                                <p className="text-gray-600 mt-3 leading-relaxed text-sm md:text-base">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

