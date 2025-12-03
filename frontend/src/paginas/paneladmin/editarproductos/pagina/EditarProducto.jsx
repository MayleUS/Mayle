import React, { useState, useEffect } from "react";
import { ArrowLeftCircle } from "lucide-react";
import API from "../../../../api";
import { toast } from "sonner";

import FormularioGeneral from "../../crearproductos/componentes/FormularioGeneral";
import SeccionVariantes from "../../crearproductos/componentes/SeccionVariantes";
import SeccionGuia from "../../crearproductos/componentes/SeccionGuia";
import ResumenProducto from "../../crearproductos/componentes/ResumenProducto";

export default function EditarProducto({ producto, onCerrar, onGuardar }) {
  const varianteInicial = {
    id: Date.now(),
    colorNombre: "",
    colorHex: "",
    imagenes: [""],
    tallas: [{ id: 1, talla: "", stock: 0, imagen: "" }],
  };

  const [form, setForm] = useState({
    nombre: "",
    Descuento: "",
    precio: "",
    categoriaPrincipal: [""],
    categoria: [""],
    descripcion: "",
    cuidados: "",
    guia: "",
    publicado: false,
  });

  const [variantes, setVariantes] = useState([varianteInicial]);
  const [loading, setLoading] = useState(true);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [categoriasPrincipalesDisponibles, setCategoriasPrincipalesDisponibles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!producto?._id) return;
      try {
        const [{ data: filtros }, { data: productoDB }] = await Promise.all([
          API.get("/productos/filtros/opciones"),
          API.get(`/productos/${producto._id}`),
        ]);

        setCategoriasDisponibles(filtros.categorias || []);
        setCategoriasPrincipalesDisponibles(
          filtros.categoriasPrincipales ||
            filtros.categoriasPrincipalesDisponibles ||
            []
        );

        setForm({
          nombre: productoDB.nombre || "",
          Descuento: productoDB.descuentoPorcentaje || 0,
          precio: productoDB.precio || 0,
          categoriaPrincipal:
            productoDB.categoriaPrincipal?.length > 0
              ? productoDB.categoriaPrincipal
              : [""],
          categoria:
            productoDB.categoria?.length > 0 ? productoDB.categoria : [""],
          descripcion: productoDB.descripcion || "",
          cuidados: productoDB.cuidados || "",
          guia: productoDB.guia || "",
          publicado: productoDB.publicado || false,
        });

        const vars =
          productoDB.colores?.map((c) => ({
            id: Date.now() + Math.random(),
            colorNombre: c.color?.[0] || "",
            colorHex: c.color?.[1] || "",
            imagenes: c.imagenes || [""],
            tallas: c.tallas || [{ id: 1, talla: "", stock: 0, imagen: "" }],
          })) || [varianteInicial];

        setVariantes(vars);
      } catch (error) {
        console.error("Error al cargar producto o filtros:", error);
        toast.error("Error cargando datos del producto", { duration: 4000 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [producto]);

  // manejar categorías principales
  const actualizarCategoriaPrincipal = (i, valor) => {
    const nuevas = [...form.categoriaPrincipal];
    nuevas[i] = valor;
    setForm((f) => ({ ...f, categoriaPrincipal: nuevas }));
  };

  const agregarCategoriaPrincipal = () =>
    setForm((f) => ({
      ...f,
      categoriaPrincipal: [...f.categoriaPrincipal, ""],
    }));

  const eliminarCategoriaPrincipal = (i) =>
    setForm((f) => ({
      ...f,
      categoriaPrincipal: f.categoriaPrincipal.filter((_, idx) => idx !== i),
    }));

  // manejar categorías secundarias
  const actualizarCategoria = (i, valor) => {
    const nuevas = [...form.categoria];
    nuevas[i] = valor;
    setForm((f) => ({ ...f, categoria: nuevas }));
  };

  const agregarCategoria = () =>
    setForm((f) => ({ ...f, categoria: [...f.categoria, ""] }));

  const eliminarCategoria = (i) =>
    setForm((f) => ({
      ...f,
      categoria: f.categoria.filter((_, idx) => idx !== i),
    }));

  // guardar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const colores = variantes.map((v) => ({
        color: [v.colorNombre, v.colorHex],
        imagenes: v.imagenes.filter((img) => img.trim() !== ""),
        tallas: v.tallas.map((t) => ({
          talla: t.talla,
          stock: t.stock,
          imagen: t.imagen,
        })),
      }));

      const productoEditado = {
        ...form,
        precio: parseFloat(form.precio) || 0,
        descuentoPorcentaje: parseFloat(form.Descuento) || 0,
        colores,
      };

      await API.put(`/productos/${producto._id}`, productoEditado);

      toast.success("Producto actualizado", { duration: 4000 });

      if (onGuardar) onGuardar();
    } catch (error) {
      console.error("Error actualizando producto:", error);
      toast.error("Error al guardar producto", { duration: 4000 });
    }
  };

  if (loading)
    return <div className="p-10 text-center">Cargando producto...</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCerrar}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeftCircle size={20} className="text-slate-600" />
            <span className="font-medium">Volver al Inventario</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6"
      >
        <div className="space-y-6">
          <FormularioGeneral
            form={form}
            setForm={setForm}
            actualizarCategoria={actualizarCategoria}
            agregarCategoria={agregarCategoria}
            eliminarCategoria={eliminarCategoria}
            actualizarCategoriaPrincipal={actualizarCategoriaPrincipal}
            agregarCategoriaPrincipal={agregarCategoriaPrincipal}
            eliminarCategoriaPrincipal={eliminarCategoriaPrincipal}
            categoriasDisponibles={categoriasDisponibles}
            categoriasPrincipalesDisponibles={categoriasPrincipalesDisponibles}
          />

          <SeccionVariantes variantes={variantes} setVariantes={setVariantes} />

          <SeccionGuia
            guia={form.guia}
            setGuia={(valor) => setForm({ ...form, guia: valor })}
          />
        </div>

        <aside className="space-y-4">
          <ResumenProducto form={form} variantes={variantes} onGuardar={handleSubmit} />
        </aside>
      </form>
    </div>
  );
}
