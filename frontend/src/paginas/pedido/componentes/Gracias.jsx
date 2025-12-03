import React from "react";
import { Link } from "react-router-dom";

export default function Gracias() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Ícono de check */}
      <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        ¡Tu pedido ha sido confirmado!
      </h1>

      {/* Descripción */}
      <p className="text-gray-600 text-center max-w-md mb-6">
        Gracias por tu compra. Hemos recibido tu orden y estamos preparando todo para enviártelo lo antes posible.
        Recibirás un mensaje por whatsapp de confirmación con los detalles del pedido.
      </p>

      {/* Botón de volver */}
      <Link
        to="/"
        onClick={() => {
          setTimeout(() => {
            window.location.reload();
          }, 50);
        }}
        className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-all"
      >
        Volver a la tienda
      </Link>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">
        Maylé © {new Date().getFullYear()}
      </p>
    </div>
  );
}
