import React, { useState, useEffect } from "react";
import API from "../../../../api";
import { toast } from "sonner";
import FormularioGeneral from "../componentes/FormularioGeneral";
import SeccionVariantes from "../componentes/SeccionVariantes";
import SeccionGuia from "../componentes/SeccionGuia";
import ResumenProducto from "../componentes/ResumenProducto";

export default function CrearProducto() {
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
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [categoriasPrincipalesDisponibles, setCategoriasPrincipalesDisponibles] = useState([]);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const { data } = await API.get("/productos/filtros/opciones");
        setCategoriasDisponibles(data.categorias || []);
        setCategoriasPrincipalesDisponibles(data.categoriasPrincipales || []);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        toast.error("Error cargando categorías");
      }
    };
    obtenerCategorias();
  }, []);

  // ------------------------------
  // VALIDACIONES
  // ------------------------------
  const validarCampos = () => {
    const faltantes = [];

    if (!form.nombre.trim()) faltantes.push("Nombre");
    if (!form.precio.trim()) faltantes.push("Precio");
    if (!form.descripcion.trim()) faltantes.push("Descripción");
    if (!form.cuidados.trim()) faltantes.push("Cuidados");

    // Categorías
    const catP = form.categoriaPrincipal.filter((c) => !c.trim());
    if (catP.length > 0) faltantes.push("Categoría principal");

    const catS = form.categoria.filter((c) => !c.trim());
    if (catS.length > 0) faltantes.push("Categoría secundaria");

    // Variantes
    variantes.forEach((v, idx) => {
      if (!v.colorNombre.trim()) faltantes.push(`Color de variante #${idx + 1}`);
      if (!v.colorHex.trim()) faltantes.push(`Color HEX de variante #${idx + 1}`);

      const imgsVacias = v.imagenes.filter((i) => !i.trim());
      if (imgsVacias.length === v.imagenes.length)
        faltantes.push(`Imágenes de variante #${idx + 1}`);

      v.tallas.forEach((t, i) => {
        if (!t.talla.trim())
          faltantes.push(`Talla ${i + 1} de variante #${idx + 1}`);
      });
    });

    if (faltantes.length > 0) {
      faltantes.forEach((f) => toast.error(`Falta: ${f}`));
      return false;
    }

    return true;
  };

  // ------------------------------
  // SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      toast.warning("Debes completar todos los campos requeridos");
      return;
    }

    try {
      const colores = variantes.map((v) => ({
        color: [v.colorNombre],
        imagenes: v.imagenes.filter((img) => img.trim() !== ""),
        tallas: v.tallas.map((t) => ({
          talla: t.talla,
          stock: t.stock,
          imagen: t.imagen,
        })),
      }));

      const nuevoProducto = {
        nombre: form.nombre,
        categoriaPrincipal: form.categoriaPrincipal,
        categoria: form.categoria,
        descripcion: form.descripcion,
        cuidados: form.cuidados,
        guia: form.guia,
        precio: parseFloat(form.precio) || 0,
        descuentoPorcentaje: parseFloat(form.Descuento) || 0,
        colores,
      };

      await API.post("/productos", nuevoProducto);

      toast.success("Producto creado correctamente");
      limpiarFormulario();
    } catch (error) {
      console.error("Error al crear el producto:", error);
      toast.error("Error al guardar el producto");
    }
  };

  const limpiarFormulario = () => {
    setForm({
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

    setVariantes([varianteInicial]);
    toast.info("Formulario reiniciado");
  };

  const copiarNombre = () => {
    if (navigator.clipboard && form.nombre) {
      navigator.clipboard.writeText(form.nombre);
      toast.success("Nombre copiado");
    }
  };

  const actualizarCategoriaPrincipal = (index, valor) => {
    const nuevas = [...form.categoriaPrincipal];
    nuevas[index] = valor;
    setForm((f) => ({ ...f, categoriaPrincipal: nuevas }));
  };

  const agregarCategoriaPrincipal = () =>
    setForm((f) => ({ ...f, categoriaPrincipal: [...f.categoriaPrincipal, ""] }));

  const eliminarCategoriaPrincipal = (index) =>
    setForm((f) => ({
      ...f,
      categoriaPrincipal: f.categoriaPrincipal.filter((_, i) => i !== index),
    }));

  const actualizarCategoria = (index, valor) => {
    const nuevas = [...form.categoria];
    nuevas[index] = valor;
    setForm((f) => ({ ...f, categoria: nuevas }));
  };

  const agregarCategoria = () =>
    setForm((f) => ({ ...f, categoria: [...f.categoria, ""] }));

  const eliminarCategoria = (index) =>
    setForm((f) => ({
      ...f,
      categoria: f.categoria.filter((_, i) => i !== index),
    }));

  return (
    <div className="min-h-screen bg-white p-6">
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
          <ResumenProducto
            form={form}
            variantes={variantes}
            onGuardar={handleSubmit}
            onLimpiar={limpiarFormulario}
            onCopiar={copiarNombre}
          />
        </aside>
      </form>
    </div>
  );
}
