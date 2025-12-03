import { useEffect, useState, useContext } from "react";
import { ContextoAutenticacion } from "../../../contexto/ContextoAutenticacion";

const Pedidos = () => {
  const { usuario } = useContext(ContextoAutenticacion);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState({
    fecha: "",
    totalMin: "",
    totalMax: "",
  });

  const formatearFecha = (raw) => {
    if (!raw) return "Sin fecha";  // Si la fecha es vacía, muestra "Sin fecha"
    return raw;  // La fecha ya está formateada como cadena
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!usuario?.id) return;

      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/pedido/mis-pedidos`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!respuesta.ok) {
          const data = await respuesta.json();
          throw new Error(data.mensaje || "Error al obtener pedidos");
        }

        const datos = await respuesta.json();

        const datosConFechas = datos.map((p) => ({
          ...p,
          fecha_limpia: p.fecha_pedido ? p.fecha_pedido.split("T")[0] : "",
        }));

        setPedidos(datosConFechas);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, [usuario]);

  const aplicarFiltro = (pedido) => {
    const { fecha, totalMin, totalMax } = filtro;

    // Filtrar por coincidencia parcial en la fecha (día, mes o año)
    const cumpleFecha = fecha
      ? pedido.fecha_limpia.includes(fecha) // Busca la coincidencia parcial en la fecha
      : true;

    const cumpleTotalMin = totalMin
      ? pedido.total_pedido >= parseFloat(totalMin)
      : true;

    const cumpleTotalMax = totalMax
      ? pedido.total_pedido <= parseFloat(totalMax)
      : true;

    return cumpleFecha && cumpleTotalMin && cumpleTotalMax;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900"></div>
          <p className="mt-4 text-neutral-600 text-sm font-light">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
          <p className="text-neutral-900 font-medium mb-2">
            Error al cargar
          </p>
          <p className="text-neutral-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <p className="text-neutral-400 text-sm font-light">
          No hay pedidos disponibles
        </p>
      </div>
    );
  }

  const pedidosFiltrados = pedidos.filter(aplicarFiltro);

  // Función para manejar el cambio en la fecha, añadiendo los "/"
  const manejarFechaChange = (e) => {
    let value = e.target.value;

    // Añadir "/" automáticamente
    if (value.length === 2 && !value.includes("/")) {
      value = value + "/"; // Si hay 2 caracteres, añadir "/"
    }
    if (value.length === 5 && !value.includes("/", 2)) {
      value = value.substring(0, 3) + "/" + value.substring(3); // Añadir "/" entre mes y día
    }

    setFiltro({ ...filtro, fecha: value });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 text-center mb-3 tracking-tight">
            Historial de Compras
          </h1>
          <p className="text-center text-neutral-500 text-sm font-light">
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2 uppercase tracking-wide">
                Fecha
              </label>
              <input
                type="text"
                placeholder="Escribe día, mes o año"
                value={filtro.fecha}
                onChange={manejarFechaChange} // Cambiar fecha con el manejador
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2 uppercase tracking-wide">
                Mínimo
              </label>
              <input
                type="number"
                placeholder="$0.00"
                value={filtro.totalMin}
                onChange={(e) =>
                  setFiltro({ ...filtro, totalMin: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2 uppercase tracking-wide">
                Máximo
              </label>
              <input
                type="number"
                placeholder="$0.00"
                value={filtro.totalMax}
                onChange={(e) =>
                  setFiltro({ ...filtro, totalMax: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
            <p className="text-neutral-400 text-sm font-light">
              Sin resultados
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido._id}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="px-6 sm:px-8 py-6 border-b border-neutral-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wider font-medium">
                            Pedido
                          </p>
                          <p className="font-mono text-sm text-neutral-900">
                            #{pedido._id.slice(-8).toUpperCase()}
                          </p>
                        </div>

                        <div className="hidden sm:block w-px h-10 bg-neutral-200"></div>

                        <div>
                          <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wider font-medium">
                            Fecha
                          </p>
                          <p className="text-sm text-neutral-900 font-light">
                            {formatearFecha(pedido.fecha_pedido)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wider font-medium">
                        Total
                      </p>
                      <p className="text-3xl font-serif text-neutral-900">
                        ${pedido.total_pedido.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 py-6 bg-neutral-50">
                  <p className="text-xs text-neutral-500 mb-4 uppercase tracking-wider font-medium">
                    Artículos ({pedido.productos.length})
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pedido.productos.map((p) => (
                      <div
                        key={p._id || p.id || p.nombre}
                        className="bg-white border border-neutral-200 rounded px-4 py-3 hover:border-neutral-400 transition-colors"
                      >
                        <p className="text-sm text-neutral-900 font-light leading-relaxed">
                          {p.nombre}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
