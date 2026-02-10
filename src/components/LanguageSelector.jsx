import { useLanguage } from "../i18n/LanguageContext";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
        title="English"
      >
        <span className="flag-icon">🇬🇧</span>
      </button>
      <button
        className={`lang-btn ${language === "fr" ? "active" : ""}`}
        onClick={() => setLanguage("fr")}
        title="Français"
      >
        <span className="flag-icon">🇫🇷</span>
      </button>
    </div>
  );
}

export default LanguageSelector;
