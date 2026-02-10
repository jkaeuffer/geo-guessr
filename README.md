# 🌍 Geo Guessr

A fun geography quiz game where you try to name all the countries in the world as fast as possible!

**[Play Now →](https://jkaeuffer.github.io/geo-guessr/)**

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎮 Gameplay
- **197 countries** to guess from all 6 continents
- **Interactive world map** - click on countries to get hints
- **Timer** tracks how long it takes you to complete
- **5-second penalty** for wrong guesses
- **Fuzzy matching** - minor typos are accepted (thanks to Levenshtein distance algorithm)

### 🌐 Multilingual Support
- **English & French** - toggle between languages using the flag buttons in the top right
- **Fully translated** - all country names, capitals, continents, and UI text
- **Type in your language** - enter country names in English or French depending on selected language

### 🗺️ Map Features
- **Zoom & pan** - scroll to zoom, drag to pan around the map
- **Color-coded continents** - each continent has its own color
- **Hint system** - click any unguessed country to see its flag and capital

### 📊 Progress Tracking
- **Real-time progress bars** for each continent
- **Final score screen** showing your time and completion percentage
- **Missed countries list** organized by continent with flags

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jkaeuffer/geo-guessr.git
cd geo-guessr

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🌐 Deployment

This app is configured for automatic deployment to GitHub Pages.

### Automatic Deployment
Every push to the `main` branch triggers a GitHub Actions workflow that:
1. Builds the production bundle
2. Deploys to GitHub Pages

**Live URL:** https://jkaeuffer.github.io/geo-guessr/

### Manual Deployment

You can also deploy to other platforms:

#### Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

#### Vercel
```bash
npm install -g vercel
vercel
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **TopoJSON** - World map data from [world-atlas](https://github.com/topojson/world-atlas)
- **FlagCDN** - Country flag images

## 📁 Project Structure

```
geo-guessr/
├── src/
│   ├── components/
│   │   ├── Game.jsx           # Main game logic
│   │   ├── WorldMap.jsx       # Interactive SVG map
│   │   ├── ContinentProgress.jsx  # Progress bars
│   │   ├── CountryHintModal.jsx   # Hint popup
│   │   ├── EndGameModal.jsx   # Final score screen
│   │   ├── LanguageSelector.jsx   # Language toggle (EN/FR)
│   │   └── Timer.jsx          # Game timer
│   ├── data/
│   │   └── countries.js       # Country data & fuzzy matching
│   ├── i18n/
│   │   ├── LanguageContext.jsx    # Language state provider
│   │   └── translations.js    # UI text & country translations
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
└── vite.config.js
```

## 🎯 How to Play

1. **Type a country name** in the input field and press Enter or click Guess
2. **Correct guesses** highlight the country on the map in its continent's color
3. **Wrong guesses** add a 5-second penalty to your timer
4. **Click on any country** on the map to get a hint (shows flag and capital)
5. **Try to guess all 197 countries** as fast as possible!

## 📝 License

MIT License - feel free to use this project for learning or build upon it!

---

Made with ❤️ and React
