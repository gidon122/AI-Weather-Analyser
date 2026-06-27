const HISTORY_KEY = "weather_search_history";
const MAX_HISTORY = 8;

export const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveToHistory = (cityName) => {
  const existing = getHistory();
  const updated = [
    cityName,
    ...existing.filter((c) => c.toLowerCase() !== cityName.toLowerCase()),
  ].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = () => localStorage.removeItem(HISTORY_KEY);
