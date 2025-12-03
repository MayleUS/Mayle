import { Routes, Route } from "react-router-dom";
import Layout from "./paginas/Layout";
import Inicio from "./paginas/inicio/pagina/Inicio.jsx";
import Catalogo from "./paginas/catalogo/pagina/Catalogo.jsx";
import CatalogoCategoria from "./paginas/catalogo/pagina/CatalogoCategoria.jsx";
import Producto from "./paginas/producto/pagina/Producto.jsx";
import ShippingDelivery from "./paginas/envioentrega/componentes/ShippingDelivery.jsx";
import ReturnPolicy from "./paginas/politicadeentrega/componentes/ReturnPolicy.jsx";
import About from "./paginas/acercade/componentes/About.jsx";
import FAQs from "./paginas/faqs/componentes/faqs.jsx";
import Login from "./paginas/login/componentes/login.jsx";
import Register from "./paginas/registro/componentes/Register.jsx";
import CrearProducto from "./paginas/paneladmin/crearproductos/CrearProducto.jsx";
import PanelAdmin from "./paginas/paneladmin/pagina/paneladmin.jsx";
import Pedido from "./paginas/pedido/pagina/Pedido.jsx";
import PaypalSuccess from "./paginas/pedido/componentes/PaypalSuccess.jsx";
import Gracias from "./paginas/pedido/componentes/Gracias.jsx";
import Perfil from "./paginas/perfil/pagina/Perfil.jsx";

import ProveedorAutenticacion from "./contexto/ContextoAutenticacion";
import { Toaster } from "sonner";

import "./index.css";

function App() {
  return (
    <ProveedorAutenticacion>

      {/* 🟩 Notificaciones globales (estilo pro e-commerce) */}
      <Toaster
        position="top-right"
        richColors
        closeButton
      />

      <Routes>
        {/* Rutas públicas con Layout principal */}
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/categoria/:nombre" element={<CatalogoCategoria />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/Return-Policy" element={<ReturnPolicy />} />
          <Route path="/About" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/crear-producto" element={<CrearProducto />} />
        </Route>

        {/* Rutas sin Layout */}
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/paypal/success" element={<PaypalSuccess />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>

    </ProveedorAutenticacion>
  );
}

export default App;
