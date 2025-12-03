import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProveedorCarrito } from "./contexto/CarritoContexto.jsx"; // 👈 Importa el proveedor
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProveedorCarrito>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProveedorCarrito>
  </React.StrictMode>
);
