import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { validarCupon } from "../../../servicios/cuponService";

export default function ResumenPedido({
  products = [],
  subtotal,
  shippingCost = 10.95, // 👈 viene desde Pedido.jsx
  setDescuento: setDescuentoPadre,
}) {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [cargando, setCargando] = useState(false);

  const taxRate = 6.5; // %

  useEffect(() => {
    // Sincronizar el descuento local con el componente padre (Pedido.jsx)
    if (setDescuentoPadre) {
      setDescuentoPadre(descuento);
    }
  }, [descuento]);

  const aplicarCupon = async () => {
    if (!codigoCupon.trim()) {
      toast.error("Por favor ingresa un código de cupón.");
      return;
    }

    try {
      setCargando(true);

      const token = localStorage.getItem("token");

      const res = await validarCupon(codigoCupon.trim(), token);

      if (res?.descuento) {
        setDescuento(res.descuento);
        toast.success(`Cupón aplicado: ${res.descuento}% de descuento.`);
      }
    } catch (err) {
      console.error("Error al aplicar cupón:", err);
      setDescuento(0);

      if (err.response?.status === 401) {
        toast.warning("Debes iniciar sesión para usar cupones.");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.error || "Cupón no válido o expirado.");
      } else {
        toast.error("Ocurrió un error al validar el cupón. Inténtalo más tarde.");
      }
    } finally {
      setCargando(false);
    }
  };

  // Descuento solo sobre el subtotal
  const descuentoAplicado = descuento ? (subtotal * descuento) / 100 : 0;

  // Tax (6.5%) sobre subtotal con descuento
  const taxAplicado = ((subtotal - descuentoAplicado) * taxRate) / 100;

  // Total final = subtotal - descuento + envío + tax
  const totalConDescuento =
    subtotal - descuentoAplicado + shippingCost + taxAplicado;

  return (
    <aside className="lg:col-span-4">
      <Toaster richColors position="top-right" />

      {/* 🧾 Lista de productos */}
      <div className="border border-gray-200 rounded-md p-4 mb-4">
        {products.map((product, index) => (
          <div
            key={product.id + product.color + product.talla + index}
            className={`flex items-start gap-3 pb-4 ${
              index < products.length - 1
                ? "border-b border-gray-200 mb-4"
                : ""
            }`}
          >
            <img
              src={product.img}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-md shadow-sm"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{product.title}</h4>
                  <div className="text-xs text-gray-500">
                    Size: {product.subtitle}
                  </div>
                </div>

                <div className="text-sm font-medium flex items-baseline gap-1">
                  ${product.price.toFixed(2)}
                  <span className="text-[10px] text-gray-400 font-normal">
                    USD
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                <span className="font-medium text-gray-500">Color:</span>{" "}
                {product.color || "—"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                <span className="font-medium text-gray-500">Cantidad:</span>{" "}
                {product.quantity || product.cantidad || 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🎟️ Cupón */}
      <div className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
            placeholder="Código de descuento o cupón"
            value={codigoCupon}
            onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
          />
          <button
            onClick={aplicarCupon}
            disabled={cargando}
            className={`px-4 py-2 border rounded-md text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all ${
              cargando ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {cargando ? "Aplicando..." : "Aplicar"}
          </button>
        </div>
      </div>

      {/* 💰 Totales */}
      <div className="border border-gray-200 rounded-md p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm">${subtotal.toFixed(2)}</span>
        </div>

        {descuento > 0 && (
          <div className="flex justify-between mb-2 text-green-600 text-sm">
            <span>Descuento ({descuento}%)</span>
            <span>- ${descuentoAplicado.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between mb-2">
          <span className="text-sm">Envío</span>
          <span className="text-sm">
            {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-sm">Tax (6.5%)</span>
          <span className="text-sm">${taxAplicado.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totalConDescuento.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
