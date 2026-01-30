import React, { useState, useEffect } from "react";
import "./App.css";
import MountainBackground from "./MountainBackground";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("weatherFavorites")) || [],
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedCity = useDebounce(city, 600);

  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (debouncedCity.trim().length >= 3) {
      checkWeather(debouncedCity.trim());
    }
  }, [debouncedCity]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const checkWeather = async (cityName, lat, lon) => {
    let weatherUrl, forecastUrl;
    const baseParams = `appid=${apiKey}&units=metric&lang=pl`;

    if (cityName) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&${baseParams}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&${baseParams}`;
    } else if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${baseParams}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&${baseParams}`;
    } else return;

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Current Weather (Critical)
      const resWeather = await fetch(weatherUrl);
      if (!resWeather.ok) throw new Error("City not found");
      const data = await resWeather.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        feelsLike: Math.round(data.main.feels_like),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: (data.visibility / 1000).toFixed(1),
        wind: Math.round(data.wind.speed * 3.6),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      setCity("");

      // 2. Fetch Forecast (Optional) - separate try/catch to not block main UI
      try {
        const resForecast = await fetch(forecastUrl);
        if (resForecast.ok) {
          const forecastData = await resForecast.json();
          const chartData = forecastData.list.slice(0, 9).map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              hour12: false,
            }),
            temp: Math.round(item.main.temp),
          }));
          setForecast(chartData);
        } else {
          console.warn("Forecast API failed");
          setForecast([]);
        }
      } catch (forecastErr) {
        console.warn("Forecast fetch error:", forecastErr);
        setForecast([]);
      }
    } catch (e) {
      console.error(e);
      showError("Nie znaleziono miasta lub błąd sieci.");
      setWeather(null);
    }
    setLoading(false);
  };

  const handleFavorite = () => {
    if (!weather) return;
    if (favorites.includes(weather.city))
      setFavorites(favorites.filter((f) => f !== weather.city));
    else setFavorites([...favorites, weather.city]);
  };

  const currentDate = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-container">
      <MountainBackground />

      <header className="app-header">
        <div className="location-info">
          {weather ? (
            <>
              <div className="location-row">
                <span className="location-icon">📍</span>
                <span className="location-text">
                  {weather.city}, {weather.country}
                </span>
              </div>
              <div className="date-text">{currentDate}</div>
            </>
          ) : (
            <div className="location-row">
              <span className="location-text">Pogoda</span>
            </div>
          )}
        </div>

        {/* Desktop Search Bar */}
        <div className="desktop-search">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkWeather(city.trim())}
            placeholder="Szukaj miasta..."
          />
          <button onClick={() => checkWeather(city.trim())}>🔍</button>
        </div>
        <button
          className="menu-btn"
          onClick={() =>
            document.getElementById("search-modal").classList.toggle("active")
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      <div
        id="search-modal"
        className={`search-overlay ${!weather ? "active" : ""}`}
      >
        <div className="search-content">
          <h2>Znajdź lokalizację</h2>
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkWeather(city.trim())}
              placeholder="Szukaj miasta..."
            />
            <button onClick={() => checkWeather(city.trim())}>🔍</button>
          </div>
          {favorites.length > 0 && (
            <div className="favorites-grid">
              {favorites.map((fav) => (
                <div
                  key={fav}
                  className="fav-item"
                  onClick={() => checkWeather(fav)}
                >
                  {fav}
                </div>
              ))}
            </div>
          )}
          <button
            className="close-search"
            onClick={() =>
              document.getElementById("search-modal").classList.remove("active")
            }
          >
            Zamknij
          </button>
        </div>
      </div>

      {weather && (
        <div className="dashboard-grid">
          {/* Left Column: Hero */}
          <div className="hero-section">
            <div className="temperature-display">{weather.temp}</div>

            <div className="hero-pills">
              <div className="glass-pill">{weather.desc}</div>
              <div className="glass-pill icon-pill">📈</div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="details-section">
            <div className="glass-card-container">
              <div className="glass-card">
                <div className="card-item">
                  <div className="icon-circle">💨</div>
                  <span>Wiatr</span>
                  <p>{weather.wind} km/h</p>
                </div>
                <div className="card-item">
                  <div className="icon-circle">💧</div>
                  <span>Wilgotność</span>
                  <p>{weather.humidity}%</p>
                </div>
                <div className="card-item">
                  <div className="icon-circle">👁️</div>
                  <span>Widoczność</span>
                  <p>{weather.visibility} km</p>
                </div>
                <div className="card-item">
                  <div className="icon-circle">⏲️</div>
                  <span>Ciśnienie</span>
                  <p>{weather.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <h3 className="chart-title">Prognoza 24h</h3>
            <div className="chart-container-glass">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={forecast}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            className={`fab-fav ${favorites.includes(weather.city) ? "active" : ""}`}
            onClick={handleFavorite}
          >
            ❤
          </button>
        </div>
      )}

      {error && <div className="error-toast">{error}</div>}
      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}
