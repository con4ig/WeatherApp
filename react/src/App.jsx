import React, { useState } from "react";
import "./App.css";

const apiKey = "26fcec2a51d0b21733fbd9e4c84cf799";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkWeather = async (cityName, lat, lon) => {
    let url;
    if (cityName) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pl`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    } else {
      setError("Nie udało się określić lokalizacji.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404)
          setError("Nie znaleziono takiego miasta :(");
        else if (response.status === 401)
          setError("Błędny klucz API! Sprawdź zmienną apiKey.");
        else setError("Wystąpił błąd podczas pobierania danych.");
        setWeather(null);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
      });
      setCity("");
    } catch (e) {
      setError("Problem z połączeniem internetowym.");
      setWeather(null);
    }
    setLoading(false);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          checkWeather(null, latitude, longitude);
        },
        () => setError("Odmówiono dostępu do lokalizacji lub wystąpił błąd.")
      );
    } else {
      setError("Twoja przeglądarka nie obsługuje lokalizacji.");
    }
  };

  const handleInput = (e) => setCity(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkWeather(city.trim());
  };

  return (
    <div className="container">
      <div className="search-box">
        <h1>Pogoda</h1>
        <div className="input-wrapper">
          <input
            type="text"
            value={city}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Wpisz miasto..."
            autoComplete="off"
          />
          <button
            id="locationBtn"
            title="Użyj mojej lokalizacji"
            onClick={handleLocation}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/ffffff/marker.png"
              alt="location"
              width="20"
            />
          </button>
          <button id="getWeatherBtn" onClick={() => checkWeather(city.trim())}>
            Szukaj
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: "#ff7675", margin: "10px 0" }}>{error}</div>
      )}

      {weather && (
        <div id="weatherResult" className="weather-card">
          <h2 id="cityName">{weather.city}</h2>
          <div className="main-info">
            <img
              id="weatherIcon"
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Ikona pogody"
            />
            <p id="temperature">{weather.temp}°C</p>
          </div>
          <p id="description">{weather.desc}</p>
          <div className="details">
            <div className="col">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/water.png"
                alt="Ikona wilgotności"
                width="24"
              />
              <div>
                <p id="humidity">{weather.humidity}%</p>
                <span>Wilgotność</span>
              </div>
            </div>
            <div className="col">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/wind.png"
                alt="Ikona wiatru"
                width="24"
              />
              <div>
                <p id="wind">{weather.wind} km/h</p>
                <span>Wiatr</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <div style={{ margin: "10px 0" }}>Ładowanie...</div>}
    </div>
  );
}
