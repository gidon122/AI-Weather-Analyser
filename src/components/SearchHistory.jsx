import PropTypes from "prop-types";

// Component
// ✅ Improvement 3: Added `onClear` prop — a function called when the user clicks
// "Clear history". The parent (App.jsx) owns the actual clear logic; this component
// just provides the button and calls back up. This follows the same "lift state up,
// pass handlers down" pattern used throughout the rest of the app.
const SearchHistory = ({ onSelect, history, onClear }) => {
  if (!history.length) return null;

  return (
    <div className="mt-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <p className="text-xs text-slate-500 uppercase tracking-widest">
          Recent searches
        </p>
        {/* Clear button — only shown when there IS history to clear */}
        <button
          onClick={onClear}
          className="text-xs text-slate-600 hover:text-red-400 transition-colors"
          title="Clear search history"
        >
          ✕ Clear
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {history.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

SearchHistory.propTypes = {
  onSelect: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  // ✅ `onClear` is optional (not `.isRequired`) so the component still works
  // safely if a parent forgets to pass it — it just won't show the clear button.
  onClear: PropTypes.func,
};

export default SearchHistory;