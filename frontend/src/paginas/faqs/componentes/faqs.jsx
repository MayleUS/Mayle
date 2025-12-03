import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShinyText from "../../../componentes/ShinyText";
import Typewriter from "../../../componentes/Typewriter";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  // 👇 Esto asegura que la página se abra desde arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "You can return items within 30 days of delivery as long as they are unworn, unwashed, and with original tags attached. Certain items like final sale products and swimwear bottoms are non-returnable.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5–7 business days, express shipping 2–3 business days, and overnight shipping 1 business day. International delivery times vary depending on destination.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide! Costs and delivery times depend on the destination country. Taxes and duties may apply upon delivery.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Absolutely. Once your order has shipped, you’ll receive a tracking number via email to monitor your delivery in real-time.",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "You can reach our Customer Care team via the Contact page on our website or by emailing support@mayle.com. We’re happy to help!",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
        <ShinyText text="Frequently Asked Questions" />
      </h1>

      <p className="mb-10 text-gray-600 text-sm text-center leading-relaxed max-w-xl mx-auto">
        <Typewriter
          text={[
            "Find quick answers to the most common questions.",
            "Learn more about our products, shipping, and policies.",
          ]}
          speed={40}
          pauseTime={2000}
        />
      </p>

      {/* Acordeón */}
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(i)}
              className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800">
                {faq.question}
              </span>
              <span className="text-lg text-gray-500">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4 bg-gray-50 text-sm text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
