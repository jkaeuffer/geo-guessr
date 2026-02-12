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
- **Reset button** - restart the game without revealing answers (appears after first guess)
- **5-second penalty** for wrong guesses
- **Fuzzy matching** - minor typos are accepted (thanks to Levenshtein distance algorithm)
- **Continent celebrations** 🎉 - get a celebration modal when you complete an entire continent!

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
- **Trophy emoji** 🏆 appears when you complete a continent
- **Celebration modals** with continent-themed colors that auto-dismiss after 3 seconds
- **Timer pauses** during celebrations so they don't count against your time
- **Final score screen** showing your time and completion percentage
- **Missed countries list** organized by continent with flags

## 🎯 How to Play

1. **Type a country name** in the input field and press Enter or click Guess
2. **Correct guesses** highlight the country on the map in its continent's color
3. **Wrong guesses** add a 5-second penalty to your timer
4. **Click on any country** on the map to get a hint (shows flag and capital)
5. **Complete entire continents** to unlock celebration modals with special animations
6. **Use the Reset button** to start over without seeing the answers
7. **Try to guess all 197 countries** as fast as possible!

## 🧪 Testing

This project has a comprehensive test suite covering unit tests, integration tests, and component tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
src/
├── data/
│   └── __tests__/
│       └── countries.test.js      # Unit tests for country data functions
├── components/
│   └── __tests__/
│       ├── Timer.test.jsx         # Timer component tests
│       ├── LanguageSelector.test.jsx
│       ├── ContinentProgress.test.jsx
│       ├── CountryHintModal.test.jsx
│       ├── ContinentCompletionModal.test.jsx
│       ├── EndGameModal.test.jsx
│       └── Game.test.jsx          # Integration tests for main game
├── i18n/
│   └── __tests__/
│       └── LanguageContext.test.jsx
└── test/
    └── setup.js                   # Test configuration and mocks
```

### Test Coverage

The test suite aims for:
- **80%+ line coverage**
- **75%+ branch coverage**
- **100% coverage** of critical game logic (findCountry, scoring, penalties)

### Testing Technologies

- **Vitest** - Fast Vite-native test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM nodes
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM implementation for Node.js

### Adding New Tests

When adding new features, follow these patterns:

1. **Component tests**: Place in `src/components/__tests__/ComponentName.test.jsx`
2. **Utility tests**: Place in the `__tests__` folder next to the source file
3. **Use the LanguageProvider wrapper** for components that need translation context:

```jsx
const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};
```

## 📝 License

MIT License - feel free to use this project for learning or build upon it!

---

Made with ❤️ and React
