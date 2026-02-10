import { LanguageProvider } from "./i18n/LanguageContext";
import Game from "./components/Game";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Game />
    </LanguageProvider>
  );
}

export default App;
