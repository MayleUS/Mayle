import { useEffect } from "react";
import ShinyText from "../../../componentes/ShinyText";
import Typewriter from "../../../componentes/Typewriter";

export default function ShippingDelivery() {
  // 👇 Esto asegura que la página siempre inicie arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto text-gray-800">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-4">
            <ShinyText text="Shipping & Delivery" />
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At <span className="font-semibold">Maylé</span>, we are committed to
            providing you with a seamless shopping experience. Here’s everything
            you need to know about our shipping process.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-3">
              <Typewriter text="Processing Time" speed={60} loop={false} />
            </h2>
            <p className="text-gray-600">
              Orders are processed within <strong>1-2 business days</strong>.
              You’ll receive a tracking number as soon as your package ships.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-3">
              <Typewriter text="Shipping Options" speed={60} loop={false} />
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-[#C4A484] text-lg">•</span> Standard
                Shipping (5-7 business days)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4A484] text-lg">•</span> Express
                Shipping (2-3 business days)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#C4A484] text-lg">•</span> Overnight
                Shipping (1 business day)
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-3">
              <Typewriter text="International Orders" speed={60} loop={false} />
            </h2>
            <p className="text-gray-600">
              We also ship internationally. Delivery times and costs vary
              depending on the destination country. Duties and taxes may apply
              upon arrival.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          Have more questions? Visit our{" "}
          <a href="/faqs" className="underline hover:text-gray-700 transition">
            FAQs page
          </a>{" "}
          or contact our support team.
        </div>
      </div>
    </section>
  );
}
