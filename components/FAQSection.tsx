import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does ProConnect's per-minute billing work?",
    answer: "When you connect with an expert, billing starts only after the consultation begins. You're charged per minute at the expert's listed rate — no retainers, no hidden fees, no minimum commitments. You can end the session at any time, and you'll only be billed for the exact minutes used. A detailed receipt is generated after every session."
  },
  {
    question: "How are experts verified on the platform?",
    answer: "Every expert on ProConnect goes through a rigorous multi-step verification process. We validate professional credentials, cross-reference employment history, verify certifications with issuing bodies, and conduct a live interview assessment. Only the top 8% of applicants are accepted onto the platform, ensuring you always connect with genuinely qualified professionals."
  },
  {
    question: "What's the difference between Individual and Enterprise accounts?",
    answer: "Individual accounts are designed for solo professionals — whether you're a freelancer seeking advice or an independent expert offering services. Enterprise accounts unlock team management features, consolidated billing, usage analytics dashboards, priority expert matching, and dedicated account support for organizations with multiple users."
  },
  {
    question: "Can I try ProConnect before committing to a paid session?",
    answer: "Absolutely. You can browse expert profiles, read reviews, and use our AI Smart Match to find the perfect expert — all for free. Many experts also offer a complimentary first 2 minutes so you can confirm they're the right fit before the meter starts running."
  },
  {
    question: "How does the AI Smart Match feature work?",
    answer: "Our AI analyzes your query in natural language, cross-references it against expert specializations, past consultation ratings, availability, and domain expertise to surface the top 1–3 experts best suited to solve your specific problem. It learns from successful matches over time to continuously improve recommendation accuracy."
  },
  {
    question: "Is my consultation data private and secure?",
    answer: "Yes. All consultations are end-to-end encrypted. We never record or store the content of your sessions. Your personal data is protected under SOC 2 compliance standards, and experts are bound by strict NDAs as part of their onboarding agreement. You own your data — always."
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void; key?: number }) {
  return (
    <div className="border-t border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer group"
      >
        <span className={`text-lg font-semibold leading-snug transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <div className="relative flex-shrink-0 w-6 h-6 mt-1">
          {/* Horizontal bar (always visible) */}
          <motion.span
            className="absolute top-1/2 left-0 w-6 h-[2px] bg-blue-500 rounded-full"
            style={{ translateY: '-50%' }}
          />
          {/* Vertical bar (rotates to 0 when open, forming a minus) */}
          <motion.span
            className="absolute top-1/2 left-0 w-6 h-[2px] bg-blue-500 rounded-full"
            animate={{ rotate: isOpen ? 0 : 90 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ translateY: '-50%' }}
          />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="relative bg-[#050505] text-white py-24 sm:py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          
          {/* Left - Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Frequently<br />
              asked questions
            </h2>
            <p className="mt-6 text-zinc-500 text-lg max-w-sm">
              Can't find what you're looking for? Reach out to our support team.
            </p>
          </motion.div>

          {/* Right - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {FAQ_DATA.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
            {/* Bottom border for last item */}
            <div className="border-t border-white/10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
