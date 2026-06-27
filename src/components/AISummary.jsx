import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const AISummary = ({ weatherData, units }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!weatherData?.name) return;

    // Cancel any in-flight request before starting a new one
    if (controllerRef.current) controllerRef.current.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      setSummary("");

      const temp =
        units === "metric"
          ? (weatherData.main.temp - 273.15).toFixed(1)
          : (1.8 * (weatherData.main.temp - 273.15) + 32).toFixed(1);

      const unitLabel = units === "metric" ? "°C" : "°F";

      const prompt = `
You are a professional weather analyst and smart travel assistant for a modern weather app.

Using ONLY the provided weather data, generate a realistic weather summary followed by practical clothing recommendations for someone going outdoors.

Guidelines:

* Keep the response natural, concise, and human-like
* Use 5–8 short sentences
* Describe how the weather actually feels outdoors
* Make the forecast sound realistic and grounded
* Suggest suitable clothing based on the actual weather conditions
* Mention practical outfit ideas like jackets, hoodies, breathable clothes, sneakers, umbrellas, etc.
* Keep clothing suggestions context-aware and seasonally appropriate
* Do not exaggerate weather conditions
* Avoid robotic wording or repetitive phrases
* Avoid generic safety advice unless conditions are extreme
* Do not assume time of day unless provided
* Do not repeat the same temperature details
* Sound like a premium weather/travel app, not a chatbot

Weather Data:

* City: ${weatherData.name}
* Temperature: ${temp}${unitLabel}
* Condition: ${weatherData.weather[0].description}
* Humidity: ${weatherData.main.humidity}%
* Wind Speed: ${weatherData.wind.speed} m/s
* Feels Like: ${(weatherData.main.feels_like - 273.15).toFixed(1)}°C

Generate:

1. A realistic weather summary
2. Smart clothing/dressing recommendations for the weather

`.trim();


      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
          }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          setError("Rate limit reached. Please wait a moment and try again.");
          return;
        }

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || "AI request failed");
        }

        const data = await res.json();
        setSummary(data.choices[0].message.content.trim());

      } catch (err) {
        if (err.name === "AbortError") return;
        setError("Couldn't load AI summary. Check your Groq API key.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    return () => controller.abort();
  }, [weatherData, units]);

  if (!weatherData?.name) return null;

  return (
    <div className="mt-4 bg-slate-700 rounded-xl p-4 text-left">
      <p className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-2">
        AI Summary
      </p>
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-slate-500 border-t-sky-400 rounded-full animate-spin" />
          Analyzing weather...
        </div>
      )}
      {error && <p className="text-yellow-400 text-sm">{error}</p>}
      {summary && (
        <p className="text-slate-200 text-sm leading-relaxed">{summary}</p>
      )}
    </div>
  );
};

AISummary.propTypes = {
  weatherData: PropTypes.object,
  units: PropTypes.string,
};

export default AISummary;