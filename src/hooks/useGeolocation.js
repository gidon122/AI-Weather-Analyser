import { useState } from "react";

const useGeolocation = (onSuccess, onError) => {
  const [loading, setLoading] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const data = await res.json();

          if (!data.length) throw new Error("Could not determine your city.");

          onSuccess(data[0].name);
        } catch (err) {
          onError("Could not determine your location.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        onError("Location access denied. Please allow it in your browser.");
        console.error(err);
        setLoading(false);
      }
    );
  };

  return { locate, loading };
};

export default useGeolocation;
