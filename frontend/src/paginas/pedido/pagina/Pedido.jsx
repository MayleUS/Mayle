import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Contacto from "../componentes/Contacto";
import InfoEnvio from "../componentes/InfoEnvio";
import ResumenPedido from "../componentes/ResumenPedido";
import { CarritoContexto } from "../../../contexto/CarritoContexto";
import { confirmarPedido } from "../../../servicios/pedidoService";
import { toast } from "sonner";

export default function Pedido() {
  const { productosCarrito, calcularTotal } = useContext(CarritoContexto);

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    first: "",
    last: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    province: "",
    postal: "",
  });

  // Estado del descuento recibido desde ResumenPedido
  const [descuento, setDescuento] = useState(0);

  // Constantes
  const taxRate = 6.5; // %

  // Shipping dinámico (gratis en Georgia)
  const shipping =
    shippingAddress.province &&
    shippingAddress.province.toLowerCase() === "georgia"
      ? 0
      : 10.95;

  // Cálculos
  const subtotal = calcularTotal();

  // Descuento solo sobre el subtotal
  const descuentoAplicado = descuento
    ? (subtotal * descuento) / 100
    : 0;

  // Tax sobre subtotal con descuento
  const taxAplicado =
    ((subtotal - descuentoAplicado) * taxRate) / 100;

  // Total final (EL MISMO QUE PAYPAL)
  const totalConDescuento =
    subtotal - descuentoAplicado + shipping + taxAplicado;

  // Confirmar pedido
  const handleConfirmarPedido = async () => {
    try {
      if (!productosCarrito.length) {
        toast.error("Tu carrito está vacío");
        return;
      }

      if (!email || !shippingAddress.first || !shippingAddress.address) {
        toast.warning("Por favor completa los campos requeridos");
        return;
      }

      //Datos EXACTOS para backend y PayPal
      const pedidoData = {
        first_name: shippingAddress.first,
        last_name: shippingAddress.last,
        correo_cliente: email,
        celular_cliente: shippingAddress.phone || "N/A",

        pais_envio: country,
        direccion_envio: `${shippingAddress.address}${
          shippingAddress.apt ? `, ${shippingAddress.apt}` : ""
        }, ${shippingAddress.city}, ${shippingAddress.province}`,

        subtotal: subtotal,
        valor_envio: shipping,

        descuento_aplicado: descuento,
        valor_descuento: descuentoAplicado,

        tax_porcentaje: taxRate,
        valor_tax: taxAplicado,

        total_pedido: totalConDescuento,

        productos: productosCarrito.map((item) => ({
          producto_id: item.id,
          nombre: item.nombre,
          color: Array.isArray(item.color) ? item.color : [item.color],
          talla: item.talla,
          imagen: item.imagen,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          precio_total: item.precio * item.cantidad,
        })),
      };

      console.log("Enviando pedido al backend:", pedidoData);

      // Guardar pedido para PayPalSuccess.jsx
      localStorage.setItem("pedidoData", JSON.stringify(pedidoData));

      toast.loading("Creando orden de PayPal…");

      const data = await confirmarPedido(pedidoData);
      console.log("💰 Orden PayPal creada:", data);

      if (data?.approvalUrl) {
        toast.success("Redirigiendo a PayPal");
        window.location.href = data.approvalUrl;
      } else {
        toast.error("No se pudo generar la orden de PayPal");
      }
    } catch (error) {
      console.error("Error creando la orden:", error);
      toast.error("Error creando la orden");
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-6xl mx-auto py-6 px-6">
      {/* Header */}
      <header className="flex items-center justify-center mb-6">
        <Link to="/">
        <img 
        src="https://res.cloudinary.com/dvgpq1ezx/image/upload/v1757571936/Logo_lb2nfx.png"
        alt="Maylé"
        className="h-10 object-contain"
        />
        </Link>
      </header>

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-white border border-gray-200 p-6 rounded-md">
          <Contacto email={email} setEmail={setEmail} />
          <InfoEnvio
            country={country}
            setCountry={setCountry}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            onPayNow={handleConfirmarPedido}
          />
        </section>

        {/* Resumen del pedido */}
        <aside className="lg:col-span-4 space-y-4">
          {productosCarrito.length === 0 ? (
            <div className="border border-gray-200 rounded-md p-4 text-center text-gray-500">
              Tu carrito está vacío.
            </div>
          ) : (
            <ResumenPedido
              products={productosCarrito.map((item) => ({
                id: item.id,
                title: item.nombre,
                subtitle: item.talla,
                color:
                  typeof item.color === "string"
                    ? item.color
                    : item.color?.[0] || "N/A",
                price: item.precio,
                img: item.imagen,
                cantidad: item.cantidad,
              }))}
              subtotal={subtotal}
              shippingCost={shipping}
              setDescuento={setDescuento}
            />
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-gray-500">
        <a className="underline mr-3" href="#">
          Políticas de devolución
        </a>
        <a className="underline mr-3" href="#">
          Envíos
        </a>
        <a className="underline" href="#">
          Privacidad
        </a>
      </footer>
    </div>
  );
}
