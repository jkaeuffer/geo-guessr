import { useTheme } from "../i18n/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === "light" ? t.switchToDark : t.switchToLight}
      aria-label={theme === "light" ? t.switchToDark : t.switchToLight}
    >
      <span className="theme-icon">
        {theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
      </span>
    </button>
  );
}

export default ThemeToggle;
