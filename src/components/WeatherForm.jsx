import { useState } from "react";
import PropTypes from "prop-types";

const WeatherForm = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a city name..."
        className="w-72 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
};

WeatherForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default WeatherForm;