import { LanguageProvider } from "./i18n/LanguageContext";
import { ThemeProvider } from "./i18n/ThemeContext";
import Game from "./components/Game";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Game />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
