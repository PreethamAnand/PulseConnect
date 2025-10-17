import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Who can donate blood or plasma?",
      answer:
        "Generally, anyone between 18-65 years old, weighing above 50kg (blood) or 55kg (plasma), in good health, and meeting specific criteria can donate. You should be free from infections, not on antibiotics, and have recovered from any illness for at least 28 days for plasma donation.",
    },
    {
      question: "How do I request blood or plasma?",
      answer:
        "Simply create an account on PulseConnect, navigate to the 'Request Help' section, fill in the required details including blood type, location, and urgency. Our AI system will immediately match you with available donors and blood banks in your area.",
    },
    {
      question: "Is my data secure on PulseConnect?",
      answer:
        "Absolutely. We use military-grade encryption and blockchain technology to ensure all your personal and medical data is completely secure. Your information is never shared without your explicit consent, and all transactions are tamper-proof and verifiable.",
    },
    {
      question: "How does PulseConnect ensure donor authenticity?",
      answer:
        "We use a multi-layer verification system including government ID verification, medical screening reports, and blockchain-based donation history tracking. Every donation is recorded on an immutable ledger, preventing fraud and ensuring transparency.",
    },
    {
      question: "Can I track my donation's impact?",
      answer:
        "Yes! PulseConnect provides a complete donation history and impact dashboard. You can see (while respecting patient privacy) how many lives you've helped save, track your donation frequency, and receive certificates of appreciation for your contributions.",
    },
    {
      question: "What happens in case of emergency requests?",
      answer:
        "Our emergency alert system immediately notifies all eligible donors within a specified radius via push notifications, SMS, and email. Hospitals can mark requests as 'Critical', which triggers priority matching and real-time coordination with nearby blood banks.",
    },
    {
      question: "How often can I donate?",
      answer:
        "For blood donation, you must wait at least 12 weeks (3 months) between donations. For plasma donation, you can donate every 14 days as plasma regenerates much faster. Our system automatically tracks your donation history and will only show you as available when you're eligible.",
    },
    {
      question: "Are there any side effects of donating?",
      answer:
        "Most donors experience no side effects. Some may feel light-headed or tired for a few hours post-donation. It's important to stay hydrated, eat iron-rich foods, and rest adequately. Serious complications are extremely rare when proper protocols are followed.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-3 rounded-full mb-6">
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#7F8C8D]">
            Everything you need to know about PulseConnect
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-bold text-[#2C3E50] pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-[#FF6B6B] rotate-180"
                      : "bg-gray-100"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#2C3E50]" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-[#7F8C8D] leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FFD166]/10 rounded-2xl border border-[#FF6B6B]/20"
        >
          <p className="text-lg text-[#2C3E50] mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:support@pulseconnect.com"
            className="text-[#FF6B6B] font-semibold hover:text-[#ff5252] transition-colors duration-200"
          >
            Contact Support →
          </a>
        </motion.div>
      </div>
    </section>
  );
}