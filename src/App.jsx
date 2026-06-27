import { useEffect, useState } from "react";
import useApiRequests from "./hooks/useApiRequest";
import WeatherForm from "./components/WeatherForm";
import WeatherCard from "./components/WeatherCard";
import AISummary from "./components/AISummary";
import SearchHistory from "./components/SearchHistory";
import { saveToHistory, getHistory, clearHistory } from "./utils/storage";
import useGeolocation from "./hooks/useGeolocation";

function App() {
  const [prompt, setPrompt] = useState("");
  const [units, setUnits] = useState("metric");
  const [weatherDataLoading, setWeatherDataLoading] = useState(false);
  // ✅ Improvement 2: Single error state for both API errors and geolocation errors.
  // Previously we had `errorMsg` and `geoError` as separate pieces of state living in
  // different places (one here, one inside useGeolocation). That meant the JSX had to
  // check `{errorMsg || geoError}` everywhere — awkward and easy to forget one.
  // Now there's one source of truth: `errorMsg`. The geolocation hook still manages
  // its own internal loading state, but on error it calls `setErrorMsg` directly via
  // the `onError` callback we pass in below.
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState(getHistory());

  const { error, locationData, weatherData } = useApiRequests(prompt);

  // ✅ Improvement 1: `refreshHistory` is inlined directly into the useEffect below.
  // The old helper `const refreshHistory = () => setHistory(getHistory())` was defined
  // as a standalone function but called in only ONE place — inside this effect. Keeping
  // a named function around for a single use adds unnecessary indirection. Inlining it
  // makes the code shorter and easier to follow in one read-through.
  useEffect(() => {
    if (error) {
      setErrorMsg(error.message || "Something went wrong.");
      setWeatherDataLoading(false);
    }
    if (weatherData?.name) {
      setWeatherDataLoading(false);
      saveToHistory(weatherData.name);
      // Inlined: was `refreshHistory()` → now directly reads localStorage and sets state
      setHistory(getHistory());
    }
  }, [error, weatherData]);

  const handleSubmit = (newPrompt) => {
    setErrorMsg("");
    setWeatherDataLoading(true);
    setPrompt(newPrompt);
  };

  // Geolocation — on success, treat the city name as a new search.
  // ✅ Improvement 2 (continued): We no longer destructure `error: geoError` from this
  // hook. Instead we pass `setErrorMsg` as the `onError` callback so geo errors flow
  // into the same unified error state as API errors.
  const { locate, loading: geoLoading } = useGeolocation(handleSubmit, setErrorMsg);

  // ✅ Improvement 3: Clear history handler — wipes localStorage via the exported
  // `clearHistory` utility then resets the `history` state to an empty array so the
  // UI disappears immediately without needing a page refresh.
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const hasWeatherData = weatherData?.name && !errorMsg;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="py-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          ☁️ Weather Analyzer
        </h1>
        <p className="text-slate-400 text-sm">AI-powered insights for any city</p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <WeatherForm onSubmit={handleSubmit} />

          {/* Geolocation button */}
          <button
            onClick={locate}
            disabled={geoLoading}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors disabled:opacity-50"
          >
            {geoLoading ? (
              <div className="w-4 h-4 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />
            ) : (
              <span>📍</span>
            )}
            Use my location
          </button>
        </div>

        {/* ✅ Improvement 2: Only one error variable to check — clean and simple */}
        {errorMsg && (
          <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>
        )}

        {/* ✅ Improvement 3: Pass `onClear` down to SearchHistory */}
        <SearchHistory
          onSelect={handleSubmit}
          history={history}
          onClear={handleClearHistory}
        />
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16">
        {hasWeatherData ? (
          <>
            <WeatherCard
              isLoading={weatherDataLoading}
              data={weatherData}
              units={units}
              setUnits={setUnits}
              country={locationData[0]?.country}
              USstate={locationData[0]?.state}
            />
            <AISummary weatherData={weatherData} units={units} />
          </>
        ) : (
          <WeatherCard isLoading={weatherDataLoading} setUnits={setUnits} />
        )}
      </main>
    </div>
  );
}

export default App;