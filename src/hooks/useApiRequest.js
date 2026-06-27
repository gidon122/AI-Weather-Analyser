import { useState, useEffect } from "react";
import LocationToCoordinates from "../api/LocationToCoordinates";
import WeatherData from "../api/WeatherData";

const useApiRequests = (prompt) => {
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!prompt) return;

      try {
        const locationDataRes = await LocationToCoordinates(prompt);
        setLocationData(locationDataRes);

        const weatherDataRes = await WeatherData(locationDataRes);
        setWeatherData(weatherDataRes);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [prompt]);

  return { error, locationData, weatherData };
};

export default useApiRequests;
