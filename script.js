const apiKey = 'API_KEY'; // Tutaj wpisz swój klucz z OpenWeatherMap

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

async function checkWeather(city, lat, lon) {
    let url;
    if (city) {
        if (!city) {
            alert('Podaj nazwę miasta!');
            return;
        }
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
        cityName.textContent = data.name;
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

    } catch (error) {
        console.error("Błąd:", error);
        alert('Problem z połączeniem internetowym.');
    }
}

// Obsługa przycisku
getWeatherBtn.addEventListener('click', () => {
    checkWeather(cityInput.value.trim());
});

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