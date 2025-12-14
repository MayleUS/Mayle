import { useState, useEffect } from "react";
import API from "../../../../api"; // Ajusta la ruta según tu proyecto

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setCargando(true);
        const respuesta = await API.get("/pedido/todos");

        if (!Array.isArray(respuesta.data)) {
          throw new Error(
            respuesta.data.mensaje || "No se recibieron pedidos válidos"
          );
        }

        const pedidosOrdenados = respuesta.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPedidos(pedidosOrdenados);
      } catch (err) {
        console.error("Error al traer pedidos:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, []);

  if (cargando) return <p className="text-gray-500">Cargando pedidos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Todos los Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No hay pedidos registrados.</p>
      ) : (
        <div className="grid gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-transform hover:scale-105"
            >
              {/* ID y Fecha */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">ID: {pedido._id}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(pedido.createdAt).toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Cliente y Envío en dos columnas */}
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Cliente */}
                <div>
                  <p className="text-gray-500 text-sm">Nombre del cliente</p>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pedido.first_name} {pedido.last_name}
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">Correo electrónico</p>
                  <p className="text-gray-600">{pedido.correo_cliente}</p>

                  <p className="text-gray-500 text-sm mt-2">Celular</p>
                  <p className="text-gray-600">{pedido.celular_cliente}</p>
                </div>

                {/* Envío */}
                <div>
                  <p className="text-gray-500 text-sm">País de envío</p>
                  <p className="text-gray-600">{pedido.pais_envio || "No especificado"}</p>

                  <p className="text-gray-500 text-sm mt-2">Dirección de envío</p>
                  <p className="text-gray-600 break-words">{pedido.direccion_envio || "No especificada"}</p>
                </div>
              </div>

              {/* Productos */}
              <div className="mb-4">
                <p className="text-gray-700 font-semibold">Productos:</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {pedido.productos?.map((p, index) => (
                    <li key={index}>
                      {p.nombre} - Color: {p.color[0]}, Cantidad: {p.cantidad}
                    </li>
                  )) || <li>No hay productos registrados</li>}
                </ul>
              </div>

              {/* Total y envío */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-600 font-medium">
                  Envío: ${pedido.valor_envio?.toFixed(2) || "0.00"}
                </span>
                <span className="text-gray-800 font-bold text-lg">
                  Total: ${pedido.total_pedido?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
