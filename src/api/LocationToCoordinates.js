// Converts a city name to lat/lon using OpenWeatherMap Geocoding API
const LocationToCoordinates = async (cityName) => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data = await res.json();
  if (!data.length) throw new Error(`City not found: "${cityName}"`);

  return data; // Array of location objects with lat, lon, country, state
};

export default LocationToCoordinates;
