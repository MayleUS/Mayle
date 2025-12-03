import React from "react";

// Lista de países
const paises = ["Colombia", "Estados Unidos", "España", "México", "Francia"];

// Estados de Estados Unidos
const estadosEEUU = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
  "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
  "Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"
];

export default function SelectorPaisProvincia({ pais, setPais, provincia, setProvincia }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Selector de país */}
      <select
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
        value={pais}
        onChange={(e) => {
          setPais(e.target.value);
          setProvincia(""); // Limpiar provincia si cambia el país
        }}
      >
        <option value="">Selecciona país</option>
        {paises.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Selector de provincia solo si es Estados Unidos */}
      {pais === "Estados Unidos" ? (
        <select
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
        >
          <option value="">Selecciona estado</option>
          {estadosEEUU.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      ) : (
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          placeholder="Provincia / Región"
          value={provincia || ""}
          onChange={(e) => setProvincia(e.target.value)}
        />
      )}
    </div>
  );
}
