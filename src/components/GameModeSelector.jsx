import { useLanguage } from "../i18n/LanguageContext";

function GameModeSelector({ selectedMode, onModeChange }) {
  const { t } = useLanguage();

  const modes = [
    { id: "classic", label: t.modeClassic, icon: "🌍" },
    { id: "timed", label: t.modeTimed, icon: "⏱️" }
  ];

  return (
    <div className="game-mode-selector">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`mode-btn ${selectedMode === mode.id ? "active" : ""}`}
          onClick={() => onModeChange(mode.id)}
        >
          <span className="mode-icon">{mode.icon}</span>
          <span className="mode-label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

export default GameModeSelector;
