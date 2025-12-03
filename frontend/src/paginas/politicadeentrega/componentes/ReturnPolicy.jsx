import { useEffect } from "react";
import { motion } from "framer-motion";
import ShinyText from "../../../componentes/ShinyText";
import Typewriter from "../../../componentes/Typewriter";

export default function ReturnPolicy() {
  // 👇 Esto fuerza la página a abrirse desde arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
        <ShinyText text="Return Policy" />
      </h1>

      <p className="mb-6 text-gray-600 text-sm text-center max-w-2xl mx-auto leading-relaxed">
        <Typewriter
          text={[
            "At Maylé, your satisfaction is our priority.",
            "If you’re not completely happy with your purchase, we make returns simple and stress-free.",
          ]}
          speed={40}
          pauseTime={2000}
        />
      </p>

      {/* Sección: Plazos */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          Return Timeframe
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Items can be returned within{" "}
          <span className="font-medium">30 days</span> of delivery for a full
          refund or store credit. Items must be in their original condition,
          unworn, and with all tags attached.
        </p>
      </motion.div>

      {/* Sección: Proceso */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          How to Return
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            Log into your account and navigate to{" "}
            <span className="font-medium">Order History</span>.
          </li>
          <li>
            Select the item(s) you’d like to return and complete the return
            request form.
          </li>
          <li>
            Print the prepaid return label and attach it securely to your
            package.
          </li>
          <li>Drop off the package at any authorized carrier location.</li>
        </ol>
      </motion.div>

      {/* Sección: Excepciones */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          Non-Returnable Items
        </h2>
        <p className="text-gray-700 leading-relaxed">
          For hygiene and safety reasons, certain items such as{" "}
          <span className="font-medium">
            swimwear bottoms, final sale products
          </span>{" "}
          and <span className="font-medium">gift cards</span> are not eligible
          for return.
        </p>
      </motion.div>

      {/* Sección: Cambios */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-900">Exchanges</h2>
        <p className="text-gray-700 leading-relaxed">
          If you wish to exchange an item for a different size or color,
          please follow the return process and place a new order for the
          desired item.
        </p>
      </motion.div>

      {/* Contacto */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <p className="text-gray-600 text-sm">
          Still have questions? Our{" "}
          <a
            href="/contact"
            className="text-black font-medium underline hover:text-gray-700 transition"
          >
            Customer Care Team
          </a>{" "}
          is here to help.
        </p>
      </motion.div>
    </div>
  );
}
