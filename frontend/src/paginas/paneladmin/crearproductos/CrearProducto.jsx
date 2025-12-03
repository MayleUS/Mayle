import React, { useState } from 'react';

// CrearProducto - Dashboard Empresarial
// Single-file React component styled with TailwindCSS
// Exporta por defecto el componente principal.

export default function CrearProductoDashboard() {
  // --- Estado general del formulario ---
  const [activeSection, setActiveSection] = useState('general');
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    sku: '',
    categoria: [''],
    descripcion: '',
    precio: '',
    descuentoPorcentaje: 0,
    guia: '',
    variantes: [
      {
        id: Date.now(),
        colorNombre: '',
        colorHex: '',
        imagenes: [''],
        tallas: [{ id: 1, talla: '', stock: 0, imagen: '' }],
      },
    ],
    publicado: false,
  });

  // --- Helpers para actualizar form ---
  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const actualizarCategoria = (index, valor) => {
    const c = [...form.categoria];
    c[index] = valor;
    setForm({ ...form, categoria: c });
  };

  const agregarCategoria = () => setForm({ ...form, categoria: [...form.categoria, ''] });
  const eliminarCategoria = (index) =>
    setForm({ ...form, categoria: form.categoria.filter((_, i) => i !== index) });

  // --- Variantes (colores + tallas) ---
  const agregarVariante = () => {
    const nueva = {
      id: Date.now(),
      colorNombre: '',
      colorHex: '',
      imagenes: [''],
      tallas: [{ id: 1, talla: '', stock: 0, imagen: '' }],
    };
    setForm({ ...form, variantes: [...form.variantes, nueva] });
  };

  const eliminarVariante = (id) =>
    setForm({ ...form, variantes: form.variantes.filter((v) => v.id !== id) });

  const actualizarVariante = (id, path, value) => {
    const nuevas = form.variantes.map((v) => {
      if (v.id !== id) return v;
      // support paths like 'colorNombre' or 'imagenes[0]'
      if (path.startsWith('imagenes')) {
        const match = path.match(/imagenes\[(\d+)\]/);
        if (match) {
          const idx = Number(match[1]);
          const imgs = [...v.imagenes];
          imgs[idx] = value;
          return { ...v, imagenes: imgs };
        }
      }
      if (path.startsWith('tallas')) {
        const match = path.match(/tallas\[(\d+)\]\.(.*)/);
        if (match) {
          const idx = Number(match[1]);
          const key = match[2];
          const ts = v.tallas.map((t, i) => (i === idx ? { ...t, [key]: value } : t));
          return { ...v, tallas: ts };
        }
      }
      return { ...v, [path]: value };
    });
    setForm({ ...form, variantes: nuevas });
  };

  const agregarImagenVariante = (id) => {
    const nuevas = form.variantes.map((v) => (v.id === id ? { ...v, imagenes: [...v.imagenes, ''] } : v));
    setForm({ ...form, variantes: nuevas });
  };

  const eliminarImagenVariante = (id, indexImg) => {
    const nuevas = form.variantes.map((v) => {
      if (v.id !== id) return v;
      return { ...v, imagenes: v.imagenes.filter((_, i) => i !== indexImg) };
    });
    setForm({ ...form, variantes: nuevas });
  };

  const agregarTallaVariante = (id) => {
    const nuevas = form.variantes.map((v) =>
      v.id === id ? { ...v, tallas: [...v.tallas, { id: Date.now(), talla: '', stock: 0, imagen: '' }] } : v
    );
    setForm({ ...form, variantes: nuevas });
  };

  const eliminarTallaVariante = (id, idTalla) => {
    const nuevas = form.variantes.map((v) =>
      v.id === id ? { ...v, tallas: v.tallas.filter((t) => t.id !== idTalla) } : v
    );
    setForm({ ...form, variantes: nuevas });
  };

  // --- Submit (simulado). Mantengo la lógica de envío original ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Guardando producto...');

    try {
      // ejemplo simple: enviar a backend
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) setMensaje('Producto guardado correctamente');
      else setMensaje(data.mensaje || 'Error guardando');
    } catch (err) {
      setMensaje('Error de conexión con servidor');
    }

    setTimeout(() => setMensaje(''), 4000);
  };

  // --- small UI bits: components internos ---
  const IconGrid = () => (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

  const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-500 rounded-md flex items-center justify-center">
          <span className="text-white font-semibold">IP</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Gestor de productos</h1>
          <p className="text-sm text-gray-500">Crear y publicar artículos en el catálogo</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Mi empresa</div>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">JS</div>
      </div>
    </header>
  );

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
      <nav className="space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase">Navegación</div>
        <ul className="mt-3 space-y-1">
          <li className="px-2 py-2 rounded-md hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium">
            <span className="w-5 h-5"><IconGrid /></span> Panel
          </li>
          <li className="px-2 py-2 rounded-md bg-gray-50 border-l-2 border-green-600 flex items-center gap-3 text-green-700 font-medium">
            <span className="w-5 h-5"><IconGrid /></span> Productos
          </li>
          <li className="px-2 py-2 rounded-md hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium">Inventario</li>
          <li className="px-2 py-2 rounded-md hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium">Reportes</li>
        </ul>
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
        <div className="mb-2">Última acción</div>
        <div className="text-xs text-gray-400">Hoy · Guardado automático</div>
      </div>
    </aside>
  );

  const Field = ({ label, children, hint }) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2">{children}</div>
      {hint && <p className="text-xs text-gray-400 mt-2">{hint}</p>}
    </div>
  );

  // --- Render principal ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <Sidebar />

        <main className="bg-transparent">
          <div className="rounded-lg shadow-sm overflow-hidden">
            <Header />

            <form onSubmit={handleSubmit} className="p-6 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: meta */}
                <div className="col-span-2 space-y-6">
                  {/* Card: Identidad básica */}
                  <section className="rounded-md border border-gray-100 p-5 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Información básica</h2>
                        <p className="text-xs text-gray-500 mt-1">Nombre, SKU y categorías principales.</p>
                      </div>
                      <div className="text-xs text-gray-400">Estado: <span className="ml-2 font-medium text-green-600">Borrador</span></div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <Field label="Nombre del producto">
                        <input
                          value={form.nombre}
                          onChange={(e) => setField('nombre', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                          placeholder="Ej: Camisa clásica blanca"
                          required
                        />
                      </Field>

                      <div className="grid lg:grid-cols-2 gap-3">
                        <Field label="SKU">
                          <input
                            value={form.sku}
                            onChange={(e) => setField('sku', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                            placeholder="SKU interno"
                          />
                        </Field>

                        <Field label="Precio base (COP)">
                          <input
                            type="number"
                            value={form.precio}
                            onChange={(e) => setField('precio', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                            placeholder="0"
                          />
                        </Field>
                      </div>

                      <Field label="Categorías">
                        <div className="space-y-2">
                          {form.categoria.map((c, i) => (
                            <div key={i} className="flex gap-3">
                              <input
                                value={c}
                                onChange={(e) => actualizarCategoria(i, e.target.value)}
                                className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                                placeholder={`Categoría #${i + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => eliminarCategoria(i)}
                                className="text-red-600 text-sm hover:underline"
                              >
                                Eliminar
                              </button>
                            </div>
                          ))}

                          <button type="button" onClick={agregarCategoria} className="text-green-700 font-medium mt-1 hover:underline">
                            + Agregar categoría
                          </button>
                        </div>
                      </Field>

                      <Field label="Descripción">
                        <textarea
                          value={form.descripcion}
                          onChange={(e) => setField('descripcion', e.target.value)}
                          rows={5}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none resize-none"
                          placeholder="Descripción detallada del producto"
                        />
                      </Field>
                    </div>
                  </section>

                  {/* Card: Variantes */}
                  <section className="rounded-md border border-gray-100 p-5 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Variantes</h2>
                        <p className="text-xs text-gray-500 mt-1">Colores y tallas — agrega las combinaciones que vendas.</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={agregarVariante}
                          className="inline-flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm hover:opacity-95"
                        >
                          + Agregar variante
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {form.variantes.map((v) => (
                        <article key={v.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3">
                                <div style={{ background: v.colorHex || 'transparent' }} className="w-8 h-8 rounded-md border" />
                                <div>
                                  <div className="font-medium text-gray-800">{v.colorNombre || 'Color sin nombre'}</div>
                                  <div className="text-xs text-gray-400">{v.colorHex || '-'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button type="button" onClick={() => eliminarVariante(v.id)} className="text-red-600 text-sm hover:underline">
                                Eliminar
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
                            <input
                              placeholder="Nombre color"
                              value={v.colorNombre}
                              onChange={(e) => actualizarVariante(v.id, 'colorNombre', e.target.value)}
                              className="col-span-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                            />
                            <input
                              placeholder="#HEX or rgb"
                              value={v.colorHex}
                              onChange={(e) => actualizarVariante(v.id, 'colorHex', e.target.value)}
                              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                            />

                            <div className="col-span-3">
                              <div className="text-xs text-gray-600 mb-2">Imágenes</div>
                              <div className="space-y-2">
                                {v.imagenes.map((img, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <input
                                      value={img}
                                      onChange={(e) => actualizarVariante(v.id, `imagenes[${idx}]`, e.target.value)}
                                      placeholder={`URL imagen #${idx + 1}`}
                                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                                    />
                                    <button type="button" onClick={() => eliminarImagenVariante(v.id, idx)} className="text-red-600 text-sm hover:underline">Eliminar</button>
                                  </div>
                                ))}

                                <button type="button" onClick={() => agregarImagenVariante(v.id)} className="text-green-700 text-sm font-medium hover:underline">
                                  + Agregar imagen
                                </button>
                              </div>
                            </div>

                            <div className="col-span-3 mt-2">
                              <div className="text-xs text-gray-600 mb-2">Tallas</div>
                              <div className="space-y-2">
                                {v.tallas.map((t) => (
                                  <div key={t.id} className="flex gap-3 items-center">
                                    <input
                                      value={t.talla}
                                      onChange={(e) => actualizarVariante(v.id, `tallas[${v.tallas.indexOf(t)}].talla`, e.target.value)}
                                      placeholder="Talla (S, M, L)"
                                      className="w-40 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                                    />
                                    <input
                                      type="number"
                                      value={t.stock}
                                      onChange={(e) => actualizarVariante(v.id, `tallas[${v.tallas.indexOf(t)}].stock`, e.target.value)}
                                      placeholder="Stock"
                                      className="w-28 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                                    />
                                    <input
                                      value={t.imagen}
                                      onChange={(e) => actualizarVariante(v.id, `tallas[${v.tallas.indexOf(t)}].imagen`, e.target.value)}
                                      placeholder="URL imagen talla"
                                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                                    />
                                    <button type="button" onClick={() => eliminarTallaVariante(v.id, t.id)} className="text-red-600 text-sm hover:underline">Eliminar</button>
                                  </div>
                                ))}

                                <button type="button" onClick={() => agregarTallaVariante(v.id)} className="text-green-700 text-sm font-medium hover:underline">+ Agregar talla</button>
                              </div>
                            </div>

                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  {/* Card: Media y guía */}
                  <section className="rounded-md border border-gray-100 p-5 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">Media / Guía de tallas</h2>
                    <p className="text-xs text-gray-500 mt-1">Sube imágenes o pega URLs para la guía de tallas.</p>

                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Field label="URL guía de tallas">
                        <input
                          value={form.guia}
                          onChange={(e) => setField('guia', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                          placeholder="https://..."
                        />
                      </Field>

                      <Field label="Publicación">
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={form.publicado}
                              onChange={(e) => setField('publicado', e.target.checked)}
                              className="w-4 h-4 text-green-600 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Publicar al guardar</span>
                          </label>
                        </div>
                      </Field>
                    </div>

                    {form.guia && (
                      <div className="mt-4 border border-gray-100 rounded-md p-3 bg-gray-50">
                        <img src={form.guia} alt="Guía" className="w-full object-contain max-h-52 rounded-md" />
                      </div>
                    )}

                  </section>
                </div>

                {/* Right column: resumen / acciones */}
                <aside className="space-y-4">
                  <div className="border border-gray-100 rounded-md p-4 bg-white">
                    <h3 className="text-sm font-semibold text-gray-700">Resumen rápido</h3>
                    <div className="mt-3 text-xs text-gray-500 space-y-2">
                      <div>Variantes: <strong className="text-gray-800">{form.variantes.length}</strong></div>
                      <div>Categorías: <strong className="text-gray-800">{form.categoria.filter(Boolean).length}</strong></div>
                      <div>Publicado: <strong className="text-gray-800">{form.publicado ? 'Sí' : 'No'}</strong></div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-md p-4 bg-white space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Acciones</h3>

                    <div className="flex flex-col gap-2">
                      <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-md font-medium">Guardar</button>
                      <button type="button" onClick={() => { navigator.clipboard && form.nombre && navigator.clipboard.writeText(form.nombre); setMensaje('Nombre copiado'); setTimeout(()=>setMensaje(''),2000); }} className="w-full border border-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Copiar nombre</button>
                      <button type="button" onClick={() => { setForm({ nombre: '', sku: '', categoria: [''], descripcion: '', precio: '', descuentoPorcentaje: 0, guia: '', variantes: [], publicado: false }); setMensaje('Formulario reiniciado'); setTimeout(()=>setMensaje(''),2000); }} className="w-full border border-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-50">Limpiar</button>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-md p-3 bg-white">
                    <div className="text-xs text-gray-500">Ayuda</div>
                    <div className="mt-2 text-xs text-gray-600">Este panel es para crear productos de catálogo. Los campos son validables por el backend al guardar.</div>
                  </div>
                </aside>
              </div>

              {mensaje && <div className="mt-6 text-sm text-gray-700">{mensaje}</div>}
            </form>

          </div>
        </main>
      </div>
    </div>
  );
}