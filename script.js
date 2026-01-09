const apiKey = 'cbe6e47d0da20f2b8dc75bbc47af5cbc'; // Tutaj wpisz swój klucz z OpenWeatherMap

const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const locationBtn = document.getElementById('locationBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesList = document.getElementById('favoritesList');
const favoritesSection = document.getElementById('favoritesSection');

let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

function updateFavoritesUI() {
    favoritesSection.classList.toggle('hidden', favorites.length === 0);
    favoritesList.innerHTML = favorites.map(city =>
        `<div class="fav-pill" onclick="checkWeather('${city}')">${city}</div>`
    ).join('');
}

function updateHeartBtn(city) {
    favoriteBtn.classList.toggle('active', favorites.includes(city));
}

async function checkWeather(city, lat, lon) {
    let url;
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    } else {
        alert('Nie udało się określić lokalizacji.');
        return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                alert('Nie znaleziono takiego miasta :(');
            } else if (response.status === 401) {
                alert('Błędny klucz API! Sprawdź zmienną apiKey w script.js');
            } else {
                alert('Wystąpił błąd podczas pobierania danych.');
            }
            return;
        }

        const data = await response.json();

        // Mapowanie danych do UI
        const currentCity = data.name;
        cityName.textContent = currentCity;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // m/s na km/h

        // Dynamiczna ikona
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Pokaż kartę
        weatherResult.classList.remove('hidden');

        // Wyczyść input
        cityInput.value = "";

        updateHeartBtn(currentCity);

    } catch (error) {
        console.error("Błąd:", error);
        alert('Problem z połączeniem internetowym.');
    }
}

// Obsługa przycisku wyszukiwania
getWeatherBtn.addEventListener('click', () => {
    checkWeather(cityInput.value.trim());
});

// Obsługa serca
favoriteBtn.addEventListener('click', () => {
    const city = cityName.textContent;
    if (favorites.includes(city)) {
        favorites = favorites.filter(f => f !== city);
    } else {
        favorites.push(city);
    }
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    updateHeartBtn(city);
    updateFavoritesUI();
});

// Inicjalizacja listy przy starcie
updateFavoritesUI();

// Obsługa przycisku lokalizacji
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                checkWeather(null, latitude, longitude);
            },
            () => {
                alert('Odmówiono dostępu do lokalizacji lub wystąpił błąd.');
            }
        );
    } else {
        alert('Twoja przeglądarka nie obsługuje lokalizacji.');
    }
});

// Obsługa klawisza Enter
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(cityInput.value.trim());
    }
});