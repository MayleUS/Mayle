import React from "react";

export default function Contacto({ email, setEmail }) {
  return (
    <div>
      <h2 className="font-semibold mb-4">Contact</h2>
      <div className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <span>Email me with news and offers</span>
        </label>
      </div>
    </div>
  );
}
