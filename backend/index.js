const cron = require('node-cron');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");        // Para crear servidor HTTP
const { Server } = require("socket.io"); // Para Socket.io

const app = express();
app.use(express.json());

// 🔹 Configuración CORS para desarrollo y producción
const allowedOrigins = [
  process.env.FRONTEND_URL,  // Producción
  "http://localhost:5173",   // Vite dev
  "http://localhost:3000"    // CRA u otros frontends locales
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite requests sin origin (Postman, fetch directo)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS para ${origin} no permitido`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.error("Error de conexión:", err));

// 🔹 Crear servidor HTTP y Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// 🔹 Importar router de PayPal y pasarle io
const paypalRoutes = require('./rutas/paypal');
paypalRoutes.setIo(io);

// 🔹 Rutas principales
app.use('/carrito', require('./rutas/carrito'));
app.use('/pedido', require('./rutas/pedido'));
app.use('/usuarios', require('./rutas/usuarios'));
app.use('/productos', require('./rutas/productos'));
app.use('/cupones', require('./rutas/cupones'));
app.use('/verificacion', require('./rutas/verificacion'));
app.use('/paypal', paypalRoutes.router);

// 🔹 Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Backend de Mayle funcionando con MongoDB!");
});

// 🔹 Endpoint de salud para Railway o monitoreo
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 🔹 Conexión de clientes Socket.io
io.on("connection", (socket) => {
  console.log("Cliente conectado via Socket.io");
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// 🔹 Escuchar en el puerto
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// 🔹 Cron job diario: limpieza de carritos antiguos
const limpiarCarritosAntiguos = require('./tareas/limpiarCarritos');
cron.schedule('0 3 * * *', async () => {
  console.log('Ejecutando limpieza de carritos antiguos');
  await limpiarCarritosAntiguos();
});
