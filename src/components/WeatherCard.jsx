import PropTypes from "prop-types";
import Loader from "./Loader";

// ✅ Typo fixed: temTranslator → tempTranslator
// ✅ Fixed: stray comma inside object literal
const tempTranslator = (temp, unit) => {
  const allTemps = {
    k: { value: temp, unit: "K" },
    c: { value: temp - 273.15, unit: "°C" },
    f: { value: 1.8 * (temp - 273.15) + 32, unit: "°F" },
  };
  if (unit === "metric") return allTemps.c;
  if (unit === "imperial") return allTemps.f;
  return allTemps.k;
};

const speedTranslator = (speed, units) => {
  const allSpeeds = {
    metric: { value: speed, unit: "m/s" },
    imperial: { value: speed * 3.281, unit: "ft/s" },
  };
  return allSpeeds[units] ?? allSpeeds.metric;
};

const WeatherCard = ({ isLoading, data, units, country, USstate, setUnits }) => {
  // ✅ Guard: if no data, show loader or empty state
  if (!data?.name) {
    return (
      <div className="text-center mt-20">
        {isLoading ? (
          <Loader />
        ) : (
          <p className="text-slate-500 text-sm">Search a city to see weather.</p>
        )}
      </div>
    );
  }

  // ✅ stateDisplay is now safe — data.sys.country is verified to exist via data?.name check above
  const stateDisplay = data.sys?.country === "US" && USstate ? `, ${USstate}` : "";

  const handleUnitChange = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  const temp = tempTranslator(data.main.temp, units);
  const speed = speedTranslator(data.wind.speed, units);

  // ✅ Fixed: was ${data.wind.deg} — removed errant $ sign
  const windDegStyle = {
    transform: `rotate(${data.wind.deg + 90}deg)`,
  };

  return (
    <article className="bg-slate-800 rounded-2xl p-6 shadow-xl mt-8">
      {isLoading && <Loader />}

      <div className="flex flex-col items-center text-center gap-2">
        {/* Location */}
        {/* ✅ Fixed template literal — removed stray } */}
        <h2 className="text-xl font-semibold">
          {`${data.name}${stateDisplay}, ${country}`}
        </h2>

        {/* Icon */}
        {data.weather?.[0]?.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="w-16 h-16"
          />
        )}

        {/* Temperature */}
        <div className="text-6xl font-bold tracking-tight">
          {temp.value.toFixed(1)}
          <span className="text-2xl font-normal ml-1">{temp.unit}</span>
        </div>

        <p className="text-slate-400 capitalize">
          {data.weather?.[0]?.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 w-full mt-4 text-sm">
          <div className="bg-slate-700 rounded-xl p-3">
            <p className="text-slate-400">Humidity</p>
            <p className="font-semibold text-lg">{data.main.humidity}%</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3">
            <p className="text-slate-400">Wind</p>
            <p className="font-semibold text-lg">
              {speed.value.toFixed(1)} {speed.unit}
            </p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3">
            <p className="text-slate-400">Feels like</p>
            <p className="font-semibold text-lg">
              {tempTranslator(data.main.feels_like, units).value.toFixed(1)}{temp.unit}
            </p>
          </div>
        </div>

        {/* Wind direction arrow */}
        <div className="mt-2 text-slate-400 text-sm flex items-center gap-2">
          <span style={windDegStyle} className="text-xl inline-block">→</span>
          <span>Wind direction: {data.wind.deg}°</span>
        </div>

        {/* Unit toggle */}
        <button
          onClick={handleUnitChange}
          className="mt-4 px-4 py-1.5 text-sm border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Switch to {units === "metric" ? "°F" : "°C"}
        </button>
      </div>
    </article>
  );
};

WeatherCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.object,
  units: PropTypes.string,
  country: PropTypes.string,
  USstate: PropTypes.string,
  setUnits: PropTypes.func,
};

export default WeatherCard;