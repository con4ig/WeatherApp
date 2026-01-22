# 🌤️ Weather Dashboard - React

![Podgląd aplikacji](zdjecie.png)

Nowoczesna, responsywna aplikacja pogodowa zbudowana w **React**, wykorzystująca dane z **OpenWeatherMap API**. Projekt został zaprojektowany z myślą o elegancji i intuicyjności, korzystając z zaawansowanych technik **Glassmorphism**.

**🚀 Zobacz wersję demo:** [https://weatherappszymon.netlify.app/](https://weatherappszymon.netlify.app/)

## ✨ Funkcje

- **Inteligentne auto-wyszukiwanie**: Dzięki zastosowaniu **Debouncera**, aplikacja automatycznie pobiera dane po zakończeniu wpisywania przez użytkownika (brak konieczności klikania przycisku).
- **Premium Weather Dashboard**: Przejrzysty układ dwukolumnowy na desktopie, dzielący główne informacje od szczegółowych statystyk.
- **Szczegółowe kafelki (Tiles)**: 8 interaktywnych kart z informacjami takimi jak:
  - Temperatura odczuwalna
  - Wilgotność i ciśnienie
  - Prędkość wiatru i widoczność
  - Godzina wschodu słońca
  - Zakres temperatur (Min/Max)
- **Ulubione lokalizacje**: Możliwość zapisywania miast do listy ulubionych (zapis w `localStorage`).
- **Responsive Design**: Pełne wsparcie dla urządzeń mobilnych i tabletów.

## 🛠️ Technologie

- **React 19** (Vite)
- **CSS3 (Vanilla)** z efektami Glassmorphism
- **OpenWeatherMap API**
- **Lucide React / Emoji Icons**
- **Google Fonts** (Outfit)

## 📦 Instalacja i uruchomienie

Aplikacja znajduje się w katalogu `/react`.

1. Przejdź do folderu z aplikacją:
   ```bash
   cd react
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Skonfiguruj klucz API:
   Utwórz plik `.env` w folderze `react` i dodaj:
   ```env
   VITE_OPENWEATHER_API_KEY=twoj_klucz_api
   ```
4. Uruchom projekt:
   ```bash
   npm run dev
   ```

---

_Projekt wykonany przez Szymona Wire na zadanie szkolne z programowania._
