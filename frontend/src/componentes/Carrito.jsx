import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineXMark, HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";
import { CarritoContexto } from "../contexto/CarritoContexto";

// ✅ Formato editorial para precios en USD
const formatearPrecio = (valor) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

export default function Carrito() {
  const {
    productosCarrito,
    eliminarProducto,
    actualizarCantidad,
    calcularTotal,
    cargando,
    carritoAbierto,
    abrirCarrito,
    cerrarCarrito
  } = useContext(CarritoContexto);

  const navigate = useNavigate();
  const totalUnidades = productosCarrito.reduce((acc, item) => acc + item.cantidad, 0);

  // 👉 Función para manejar el checkout
  const handleCheckout = () => {
    cerrarCarrito();
    navigate("/pedido"); // Redirige a la página de pedido
  };

  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      {/* Botón bolsa */}
      <button
        onClick={abrirCarrito}
        className="relative flex items-center justify-center text-gray-700 hover:text-black"
      >
        <HiOutlineShoppingBag className="h-6 w-6" />
        {/* Badge contador */}
        <span
          className="absolute -top-1 -right-1
                     bg-[#7B5E57] text-white text-[9px] font-bold rounded-full 
                     w-4 h-4 flex items-center justify-center shadow-sm"
        >
          {totalUnidades}
        </span>
      </button>

      {/* Overlay */}
      {carritoAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={cerrarCarrito}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          carritoAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button onClick={cerrarCarrito}>
            <HiOutlineXMark className="h-6 w-6 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
          {cargando ? (
            <p className="text-center text-sm text-gray-500">Loading cart...</p>
          ) : productosCarrito.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            productosCarrito.map((item) => (
              <div key={item.id + item.color + item.talla} className="flex gap-3 border-b pb-4">
                {/* ✅ Imagen clickeable que lleva al producto */}
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-28 object-cover border cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    cerrarCarrito();
                    navigate(`/producto/${item.id}`);
                  }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{item.nombre}</h3>
                    <p className="text-sm text-gray-500">Size: {item.talla}</p>
                    <p className="text-sm text-gray-500">Color: {item.color?.[0]}</p>

                    {/* ✅ Panel interactivo para cantidad */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          item.cantidad > 1 &&
                          actualizarCantidad(item.id, item.color, item.talla, item.cantidad - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:text-black hover:border-black disabled:opacity-40"
                        disabled={item.cantidad <= 1}
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, item.color, item.talla, item.cantidad + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:text-black hover:border-black"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold">
                      {formatearPrecio(item.precio)}
                    </span>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() =>
                        eliminarProducto(item.id, item.color, item.talla)
                      }
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">
              {formatearPrecio(calcularTotal())}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-[#7A7369] text-white py-3 font-medium hover:bg-gray-900 transition"
          >
            CHECK OUT
          </button>
          <p className="text-xs text-gray-500 text-center">
            Shipping, taxes and discounts are calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
