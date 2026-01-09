const apiKey = 'API_KEY'; // Tutaj wleisz swój klucz z OpenWeatherMap

const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

async function checkWeather(city) {
    if (!city) {
        alert('Podaj nazwę miasta!');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

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

// Obsługa klawisza Enter
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(cityInput.value.trim());
    }
});