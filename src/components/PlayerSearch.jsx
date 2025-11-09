import { useState } from "react";

export default function PlayerSearch({ onGenerate }) {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onGenerate(name.trim());
  };

  return (
    <form onSubmit={submit} className="w-full max-w-2xl mx-auto flex items-center gap-3">
      <input
        type="text"
        placeholder="Enter Cricket Player Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-xl border border-gray-200 bg-white/70 backdrop-blur px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Generate Report
      </button>
    </form>
  );
}
