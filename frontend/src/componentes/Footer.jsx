import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F4EDDD] text-gray-800">
      {/* Sección superior */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="font-semibold mb-3">CUSTOMER CARE</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/shipping-delivery"
                className="hover:text-gray-500 transition-colors"
              >
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link
                to="/return-policy"
                className="hover:text-gray-500 transition-colors"
              >
                Return Policy
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                className="hover:text-gray-500 transition-colors"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">COMPANY</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="hover:text-gray-500 transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h4 className="font-semibold mb-3">FOLLOW US</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.instagram.com/mayleusa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-500 transition-colors"
              >
                <FaInstagram size={18} /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/19298327601"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-500 transition-colors"
              >
                <FaWhatsapp size={18} /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Frase inspiracional */}
      <div className="text-center text-sm italic text-gray-600 py-6 px-4 border-t border-gray-300">
        “Elegance begins with simplicity.”
      </div>

      {/* Logo */}
      <div className="text-center py-8">
        <img
          src="https://res.cloudinary.com/dvgpq1ezx/image/upload/v1757571936/Logo_lb2nfx.png"
          alt="Maylé Logo"
          className="mx-auto max-h-28 md:max-h-40 object-contain"
        />
      </div>

      {/* Footer inferior */}
      <div className="text-center text-xs py-4 border-t border-gray-300">
        © Maylé New 2025 &nbsp; | &nbsp; Terms of Service &nbsp; | &nbsp;
        Privacy Policy
      </div>

      {/* Sello Cordillera Tech */}
      <div className="text-center text-[11px] text-gray-500 pb-4">
        Powered by{" "}
        <a
          href="https://cordilleratech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-700 hover:text-gray-900 transition"
        >
          Cordillera Tech
        </a>
      </div>
    </footer>
  );
}
