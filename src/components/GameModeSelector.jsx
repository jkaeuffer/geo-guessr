import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";

function GameModeSelector({ selectedMode, onModeChange }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const modes = [
    { id: "classic", label: t.modeClassic, icon: "🌍" },
    { id: "timed", label: t.modeTimed, icon: "⏱️" },
    { id: "us-states", label: t.modeUSStates || "US States", icon: "🇺🇸" },
    { id: "africa", label: t.modeAfrica, icon: "🦁" },
    { id: "asia", label: t.modeAsia, icon: "🐼" },
    { id: "europe", label: t.modeEurope, icon: "🏰" },
    { id: "north-america", label: t.modeNorthAmerica, icon: "🦅" },
    { id: "south-america", label: t.modeSouthAmerica, icon: "🦜" },
    { id: "oceania", label: t.modeOceania, icon: "🦘" }
  ];

  const currentMode = modes.find(m => m.id === selectedMode) || modes[0];

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="game-mode-selector" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        className={`mode-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="mode-icon">{currentMode.icon}</span>
        <span className="mode-label">{currentMode.label}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mode-dropdown-menu" role="menu">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-menu-item ${selectedMode === mode.id ? 'selected' : ''}`}
              onClick={() => {
                onModeChange(mode.id);
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameModeSelector;
