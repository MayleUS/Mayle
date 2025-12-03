// src/paginas/about/pagina/About.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function About() {
  // 👇 Hace que al cargar la página siempre empiece desde arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <motion.h1
        className="text-3xl font-semibold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Maylé
      </motion.h1>

      <motion.div
        className="space-y-6 text-justify leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p>
          At <strong>Maylé</strong>, we believe that fashion is an expression of{" "}
          <strong>elegance, confidence, and individuality</strong>.
        </p>
        <p>
          Our brand was born from the vision of offering{" "}
          <strong>women’s clothing</strong> that accompanies every woman through
          each stage of her life and every season of the year.
        </p>
        <p>
          Each piece is designed to <strong>highlight your unique style</strong>,
          with careful attention to detail, quality, and the latest trends — 
          always with a <strong>sophisticated touch inspired by Italian
          fashion</strong>.
        </p>
        <p>
          At Maylé, we don’t just sell clothes —{" "}
          <strong>we create experiences that celebrate your authenticity and
          feminine essence</strong>.
        </p>
      </motion.div>
    </div>
  );
}
