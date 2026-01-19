import React, { useState, useEffect } from "react";
import "./App.css";

const apiKey = "26fcec2a51d0b21733fbd9e4c84cf799";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("weatherFavorites")) || [];
  });

  // Stan dla błędu i czy ma być widoczny
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Funkcja pomocnicza do wyświetlania błędów (znika po 3 sek)
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const checkWeather = async (cityName, lat, lon) => {
    let url;
    if (cityName) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pl`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    } else {
      showError("Nie udało się określić lokalizacji.");
      return;
    }

    setLoading(true);
    setError(null); // Czyścimy poprzednie błędy

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404)
          showError("Nie znaleziono takiego miasta :(");
        else if (response.status === 401) showError("Błędny klucz API!");
        else showError("Wystąpił błąd podczas pobierania danych.");

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
      showError("Problem z połączeniem internetowym.");
      setWeather(null);
    }
    setLoading(false);
  };

  const handleFavorite = () => {
    if (!weather) return;
    if (favorites.includes(weather.city)) {
      setFavorites(favorites.filter((f) => f !== weather.city));
    } else {
      setFavorites([...favorites, weather.city]);
    }
  };

  const handleFavoriteClick = (favCity) => {
    checkWeather(favCity);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          checkWeather(null, latitude, longitude);
        },
        () => showError("Odmówiono dostępu do lokalizacji."),
      );
    } else {
      showError("Twoja przeglądarka nie obsługuje lokalizacji.");
    }
  };

  const handleInput = (e) => setCity(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkWeather(city.trim());
  };

  return (
    <div className="container">
      {/* Sekcja Błędów - teraz wygląda jak profesjonalny alert */}
      {error && (
        <div className="error-container">
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        </div>
      )}

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
            {/* Ikona SVG zamiast zewnętrznego obrazka dla lepszej wydajności */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
          <button id="getWeatherBtn" onClick={() => checkWeather(city.trim())}>
            Szukaj
          </button>
        </div>
      </div>

      {favorites.length > 0 && (
        <div id="favoritesSection" className="favorites-container">
          <h3>Ulubione:</h3>
          <div id="favoritesList" className="favorites-list">
            {favorites.map((fav) => (
              <div
                className="fav-pill"
                key={fav}
                onClick={() => handleFavoriteClick(fav)}
              >
                {fav}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading">Ładowanie danych...</div>}

      {weather && !loading && (
        <div id="weatherResult" className="weather-card">
          <div className="card-header">
            <h2 id="cityName">{weather.city}</h2>
            <button
              id="favoriteBtn"
              className={`fav-btn${
                favorites.includes(weather.city) ? " active" : ""
              }`}
              title="Dodaj do ulubionych"
              onClick={handleFavorite}
            >
              ❤
            </button>
          </div>
          <div className="main-info">
            <img
              id="weatherIcon"
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Ikona pogody"
            />
            <p id="temperature">{weather.temp}°C</p>
          </div>
          <p id="description">
            {/* Capitalize first letter - mały JS trick dla estetyki */}
            {weather.desc.charAt(0).toUpperCase() + weather.desc.slice(1)}
          </p>
          <div className="details">
            <div className="col">
              {/* Proste ikony tekstowe lub SVG są bezpieczniejsze niż linki */}
              <span style={{ fontSize: "24px" }}>💧</span>
              <div>
                <p id="humidity">{weather.humidity}%</p>
                <span>Wilgotność</span>
              </div>
            </div>
            <div className="col">
              <span style={{ fontSize: "24px" }}>💨</span>
              <div>
                <p id="wind">{weather.wind} km/h</p>
                <span>Wiatr</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nowa sekcja licencji */}
      <footer className="footer-license">
        <p>
          Dane pogodowe dostarcza{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </p>
      </footer>
    </div>
  );
}
