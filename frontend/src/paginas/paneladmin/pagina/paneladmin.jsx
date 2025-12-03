import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

import Encabezado from "../componentes/Encabezado";
import BarraLateral from "../componentes/BarraLateral";

import CrearProducto from "../crearproductos/pagina/CrearProductos";
import InventarioDashboard from "../inventario/pagina/InventarioDashboard";
import Reportes from "../reportes/pagina/Reportes";
import Loader3D from "../componentes/Loader3D";
import Cupones from "../cupones/pagina/Cupones";
import Pedidos from "../pedidos/pagina/Pedidos";

export default function PanelAdmin() {
  const [seccionActiva, setSeccionActiva] = useState("cupones");
  const [cargando, setCargando] = useState(true);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  // -----------------------------
  // 🔊 SISTEMA DE AUDIO DESBLOQUEADO
  // -----------------------------
  const audioRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/notificacion.mp3");
    audioRef.current.volume = 1;

    const unlock = () => {
      if (!audioUnlocked) {
        audioRef.current.play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioUnlocked(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [audioUnlocked]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // -----------------------------
  // 🔔 Notificación estilo WhatsApp Web
  // -----------------------------
  const showBrowserNotification = (pedido) => {
    if (Notification.permission === "granted") {
      new Notification("📦 Nuevo pedido recibido", {
        body: `Cliente: ${pedido.cliente} - Total: $${pedido.total}`,
        icon: "/icon.png", // opcional, si tienes un icono
      });
    }
  };

  // Solicitar permiso al cargar
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  }, []);

  // -----------------------------
  // 🔹 Socket.io
  // -----------------------------
  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const socket = io(BACKEND_URL);

    socket.connect();
    console.log("🔌 Conectando a Socket.io...");

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor Socket.io:", socket.id);
    });

    socket.on("pedido_creado", (pedido) => {
      console.log("🔔 Nuevo pedido recibido:", pedido);

      playSound(); // sonido
      showBrowserNotification(pedido); // notificación emergente

      setPedidosRecientes((prev) => [pedido, ...prev]);

      setTimeout(() => {
        setPedidosRecientes((prev) =>
          prev.filter((p) => p.id !== pedido.id)
        );
      }, 30000);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión Socket.io:", err);
    });

    return () => {
      socket.off("pedido_creado");
      socket.disconnect();
      console.log("❌ Desconectado de Socket.io");
    };
  }, []);

  // -----------------------------
  // Cargador inicial
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const secciones = {
    cupones: {
      titulo: "Gestor de cupones",
      subtitulo: "Crear, editar y administrar cupones",
    },
    productos: {
      titulo: "Gestor de productos",
      subtitulo: "Crear y publicar artículos en el catálogo",
    },
    inventario: {
      titulo: "Gestor de inventario",
      subtitulo: "Control y seguimiento de existencias",
    },
    pedidos: {
      titulo: "Gestor de pedidos",
      subtitulo: "Revisión y control de las órdenes de compra",
    },
    reportes: {
      titulo: "Centro de reportes",
      subtitulo: "Análisis y reportes del sistema",
    },
  };

  const renderContenido = () => {
    const { titulo, subtitulo } = secciones[seccionActiva] || {
      titulo: "Panel administrativo",
      subtitulo: "Selecciona una sección del panel",
    };

    switch (seccionActiva) {
      case "cupones":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">
              <Cupones />
            </div>
          </div>
        );

      case "productos":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">
              <CrearProducto />
            </div>
          </div>
        );

      case "inventario":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">
              <InventarioDashboard />
            </div>
          </div>
        );

      case "pedidos":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">
              <Pedidos />
            </div>
          </div>
        );

      case "reportes":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">
              <Reportes />
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Encabezado titulo={titulo} subtitulo={subtitulo} />
            <div className="mt-6">Selecciona una opción del menú.</div>
          </div>
        );
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 overflow-hidden">
        <Loader3D />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <BarraLateral
        seccionActiva={seccionActiva}
        onNavegar={setSeccionActiva}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={seccionActiva}
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              transition: { duration: 0.45, type: "spring", stiffness: 80 },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              rotateX: -10,
              transition: { duration: 0.3 },
            }}
          >
            {renderContenido()}
          </motion.div>
        </AnimatePresence>

        {/* 🔔 Notificaciones visuales */}
        <div className="fixed top-5 right-5 space-y-2 z-50">
          <AnimatePresence>
            {pedidosRecientes.map((pedido) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="bg-green-500 text-white p-3 rounded shadow"
              >
                Nuevo pedido de {pedido.cliente} - Total: ${pedido.total}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
