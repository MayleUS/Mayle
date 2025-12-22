import React from "react";
import { toast } from "sonner";

// Lista de países
const countries = ["United States"];

// Provincias de Estados Unidos
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export default function InfoEnvio({
  country,
  setCountry,
  shippingAddress,
  setShippingAddress,
  onPayNow,
}) {
  const handlePayNow = () => {
    const camposRequeridos = [
      "first",
      "last",
      "phone",
      "address",
      "city",
      "province",
      "postal",
    ];

    const vacios = camposRequeridos.filter(
      (campo) => !shippingAddress[campo] || shippingAddress[campo].trim() === ""
    );

    if (vacios.length > 0) {
      toast.warning(
        "Por favor completa todos los campos obligatorios antes de continuar"
      );
      return;
    }

    onPayNow();
  };

  // Envío gratis solo para Georgia
  const envioGratis =
    country === "United States" &&
    shippingAddress.province &&
    shippingAddress.province.toLowerCase() === "georgia";

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Delivery</h3>
      <div className="space-y-3">
        {/* País y Teléfono */}
        <div className="grid grid-cols-2 gap-3">
          <select
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              // Limpiar provincia si cambia el país
              setShippingAddress({ ...shippingAddress, province: "" });
            }}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            required
            type="tel"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            placeholder="Phone number"
            value={shippingAddress.phone || ""}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
          />
        </div>

        {/* Nombres */}
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="First name"
            value={shippingAddress.first || ""}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, first: e.target.value })
            }
          />
          <input
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Last name"
            value={shippingAddress.last || ""}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, last: e.target.value })
            }
          />
        </div>

        {/* Dirección */}
        <input
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          placeholder="Address"
          value={shippingAddress.address || ""}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          placeholder="Apartment, suite, etc. (optional)"
          value={shippingAddress.apt || ""}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, apt: e.target.value })
          }
        />

        {/* Ciudad, provincia y código postal */}
        <div className="grid grid-cols-4 gap-3">
          <input
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm col-span-2"
            placeholder="City"
            value={shippingAddress.city || ""}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
          />

          {/* Provincia / Estado */}
          {country === "United States" ? (
            <select
              required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={shippingAddress.province || ""}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  province: e.target.value,
                })
              }
            >
              <option value="">Select state</option>
              {usStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : (
            <input
              required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Province/Region"
              value={shippingAddress.province || ""}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  province: e.target.value,
                })
              }
            />
          )}

          <input
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Postal code"
            value={shippingAddress.postal || ""}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, postal: e.target.value })
            }
          />
        </div>

        {/* Aviso de envío */}
        {shippingAddress.province && (
          <p className="text-xs text-gray-600">
            {envioGratis
              ? "Free shipping in Georgia"
              : "Shipping cost: $10.95"}
          </p>
        )}

        {/* Checkboxes */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <span>Save this information for next time</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <span>Text me with news and offers</span>
        </label>

        {/* Botón de pago */}
        <button
          onClick={handlePayNow}
          className="bg-gray-900 text-white py-3 rounded-md w-full font-medium mt-4 hover:bg-gray-800 transition"
        >
          Pay now
        </button>
      </div>
    </div>
  );
}
