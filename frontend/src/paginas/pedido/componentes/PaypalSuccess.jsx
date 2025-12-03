import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { confirmarPagoExitoso } from "../../../servicios/pedidoService";

export default function PaypalSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pedidoData = JSON.parse(localStorage.getItem("pedidoData"));

    if (!token || !pedidoData) {
      toast.error("No se pudo procesar el pago");
      setLoading(false);
      return;
    }

    const enviarCaptura = async () => {
      try {
        const response = await confirmarPagoExitoso(token, pedidoData);

        if (response?.success) {
          toast.success("Pago confirmado y pedido creado!");

          // Borrar data almacenada
          localStorage.removeItem("pedidoData");

          // Redirigir después de 1.5s
          setTimeout(() => {
            navigate("/gracias");
          }, 1500);
        } else {
          toast.error("El pago no se completó");
        }
      } catch (error) {
        console.error("❌ Error capturando orden:", error);
        toast.error("Error capturando el pago");
      } finally {
        setLoading(false);
      }
    };

    enviarCaptura();
  }, [token, navigate]);

  return (
    <div className="p-10 text-center">
      {loading ? (
        <>
          <h1 className="text-xl font-bold">Procesando tu pedido...</h1>
          <p>Un momento mientras confirmamos el pago.</p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">Pago procesado</h1>
          <p>Redirigiendo...</p>
        </>
      )}
    </div>
  );
}
