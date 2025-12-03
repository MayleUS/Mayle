import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductosRelacionados from "../componentes/ProductosRelacionados";
import GaleriaImagenes from "../componentes/GaleriaImagenes";
import Panel from "../componentes/Panel";
import { CarritoContexto } from "../../../contexto/CarritoContexto";

export default function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState(0); // índice del color activo

  const { agregarProducto } = useContext(CarritoContexto);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProducto(data);

        if (data.categoria && data.categoria.length > 0) {
          const cat = encodeURIComponent(data.categoria[0]);
          const resRel = await fetch(`${BACKEND_URL}/productos?categoria=${cat}`);
          if (!resRel.ok) throw new Error("Error al cargar productos relacionados");
          let relData = await resRel.json();
          relData = relData.filter((p) => p._id !== data._id);
          setProductosRelacionados(relData);
        }
      } catch (error) {
        console.error("Error cargando el producto:", error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Cargando producto...</div>;

  if (!producto)
    return (
      <div className="text-center py-20 text-red-600">
        Producto no encontrado
      </div>
    );

  // 🔹 Obtener el color activo según el índice seleccionado
  const colorActivo = producto.colores[colorSeleccionado] || {};
  const imagenes = colorActivo.imagenes || [];
  const tallasDisponibles = colorActivo.tallas || [];

  const panelData = {
    productoId: producto._id,
    nombre: producto.nombre,
    categoria: producto.categoria || [],
    precio: producto.precio,
    precioConDescuento: producto.precioConDescuento,
    descuentoPorcentaje: producto.descuentoPorcentaje,
    color: colorActivo.color,
    colorHex: colorActivo.color?.[1] || "",
    tallas: tallasDisponibles.map((t) => t.talla),
    tallasNoDisponibles: tallasDisponibles
      .filter((t) => t.stock <= 0)
      .map((t) => t.talla),
    descripcion: producto.descripcion,
    cuidados: producto.cuidados,
    coloresDisponibles: producto.colores,
    setColorSeleccionado,
    colorSeleccionado,
    imagenPrincipal: imagenes[0] || "",
    agregarProducto,
    guia: producto.guia,
  };

  return (
    <>
      <section className="w-full bg-[#F9F8F7] px-6 py-14 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <GaleriaImagenes imagenes={imagenes} />
          <Panel producto={panelData} />
        </div>
      </section>

      <ProductosRelacionados productos={productosRelacionados} />
    </>
  );
}
