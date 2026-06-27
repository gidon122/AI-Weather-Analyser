// Fetches current weather given location data from LocationToCoordinates
const WeatherData = async (locationData) => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const { lat, lon } = locationData[0];
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

  return res.json();
};

export default WeatherData;
