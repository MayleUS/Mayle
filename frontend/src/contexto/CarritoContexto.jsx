import { createContext, useState, useEffect } from 'react';
import API from '../api';

export const CarritoContexto = createContext();

export const ProveedorCarrito = ({ children }) => {
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [carritoAbierto, setCarritoAbierto] = useState(false); // ✅ Estado global del carrito

  const token = localStorage.getItem('token');
  let session_id = localStorage.getItem('session_id');

  if (!token && !session_id) {
    session_id = crypto.randomUUID();
    localStorage.setItem('session_id', session_id);
  }

  const extraerId = (producto_id) =>
    typeof producto_id === 'object' && producto_id !== null
      ? producto_id._id
      : producto_id;

  const obtenerCarrito = async () => {
    try {
      const respuesta = await API.get('/carrito', {
        params: !token ? { session_id } : {}
      });

      const productosFormateados = respuesta.data.productos.map(p => ({
        id: extraerId(p.producto_id),
        nombre: p.nombre || '',
        color: p.color,
        talla: p.talla,
        cantidad: p.cantidad,
        precio: p.precio_total,
        imagen: p.imagen || ''
      }));

      setProductosCarrito(productosFormateados);
    } catch (error) {
      console.error('Error al obtener el carrito:', error.message);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Funciones para abrir/cerrar carrito globalmente
  const abrirCarrito = () => setCarritoAbierto(true);
  const cerrarCarrito = () => setCarritoAbierto(false);

  const agregarProducto = async (producto) => {
    try {
      const cuerpo = {
        producto_id: producto.id,
        color: producto.color,
        talla: producto.talla,
        cantidad: producto.cantidad || 1,
        imagen: producto.imagen,
        ...(token ? {} : { session_id })
      };

      const respuesta = await API.post('/carrito/agregar', cuerpo);

      const productosFormateados = respuesta.data.carrito.productos.map(p => ({
        id: extraerId(p.producto_id),
        nombre: p.nombre || '',
        color: p.color,
        talla: p.talla,
        cantidad: p.cantidad,
        precio: p.precio_total,
        imagen: p.imagen || ''
      }));

      setProductosCarrito(productosFormateados);

      abrirCarrito(); // ✅ Abrir automáticamente al agregar producto
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
    }
  };

  const eliminarProducto = async (producto_id, color, talla) => {
    try {
      const cuerpo = {
        producto_id,
        color,
        talla,
        ...(token ? {} : { session_id })
      };

      const respuesta = await API.delete('/carrito/eliminar', { data: cuerpo });

      const productosFormateados = respuesta.data.carrito.productos.map(p => ({
        id: extraerId(p.producto_id),
        nombre: p.nombre || '',
        color: p.color,
        talla: p.talla,
        cantidad: p.cantidad,
        precio: p.precio_total,
        imagen: p.imagen || ''
      }));

      setProductosCarrito(productosFormateados);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
    }
  };

  const actualizarCantidad = async (producto_id, color, talla, cantidad) => {
    try {
      const cuerpo = {
        producto_id,
        color,
        talla,
        cantidad,
        ...(token ? {} : { session_id })
      };

      const respuesta = await API.put('/carrito/actualizar', cuerpo);

      const productosFormateados = respuesta.data.carrito.productos.map(p => ({
        id: extraerId(p.producto_id),
        nombre: p.nombre || '',
        color: p.color,
        talla: p.talla,
        cantidad: p.cantidad,
        precio: p.precio_total,
        imagen: p.imagen || ''
      }));

      setProductosCarrito(productosFormateados);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error.message);
    }
  };

  const calcularTotal = () =>
    productosCarrito.reduce((acc, item) => acc + item.precio, 0);

  useEffect(() => {
    obtenerCarrito();
  }, []);

  return (
    <CarritoContexto.Provider
      value={{
        productosCarrito,
        agregarProducto,
        eliminarProducto,
        actualizarCantidad,
        obtenerCarrito,
        calcularTotal,
        session_id,
        cargando,
        carritoAbierto, // ✅ Estado compartido
        abrirCarrito,   // ✅ Función para abrir
        cerrarCarrito   // ✅ Función para cerrar
      }}
    >
      {children}
    </CarritoContexto.Provider>
  );
};
