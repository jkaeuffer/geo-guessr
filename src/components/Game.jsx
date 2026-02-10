import { useState, useEffect, useRef, useCallback } from "react";
import WorldMap from "./WorldMap";
import ContinentProgress from "./ContinentProgress";
import CountryHintModal from "./CountryHintModal";
import EndGameModal from "./EndGameModal";
import Timer from "./Timer";
import LanguageSelector from "./LanguageSelector";
import { findCountry, countries } from "../data/countries";
import { useLanguage } from "../i18n/LanguageContext";

function Game() {
  const { t, getCountryName, language } = useLanguage();
  const [guessedCountries, setGuessedCountries] = useState(new Set());
  const [hintsUsed, setHintsUsed] = useState(new Set());
  const [inputValue, setInputValue] = useState("");
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hintCountryCode, setHintCountryCode] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [lastGuessStatus, setLastGuessStatus] = useState(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setLastGuessStatus(null);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim();
      if (!trimmedInput) return;

      if (!isTimerRunning) {
        setIsTimerRunning(true);
      }

      const country = findCountry(trimmedInput, language);

      if (country) {
        if (guessedCountries.has(country.code)) {
          setLastGuessStatus({ type: "duplicate", name: getCountryName(country.code) });
        } else {
          setGuessedCountries((prev) => new Set([...prev, country.code]));
          setLastGuessStatus({ type: "correct", name: getCountryName(country.code) });
        }
      } else {
        setLastGuessStatus({ type: "wrong", input: trimmedInput });
        setTime((prev) => prev + 5);
      }

      setInputValue("");
    },
    [inputValue, isTimerRunning, guessedCountries, language, getCountryName]
  );

  const handleCountryClick = (countryCode) => {
    if (!guessedCountries.has(countryCode)) {
      setHintCountryCode(countryCode);
    }
  };

  const handleEndGame = () => {
    setIsTimerRunning(false);
    setShowEndModal(true);
  };

  const handleRestart = () => {
    setGuessedCountries(new Set());
    setHintsUsed(new Set());
    setInputValue("");
    setTime(0);
    setIsTimerRunning(false);
    setHintCountryCode(null);
    setShowEndModal(false);
    setLastGuessStatus(null);
    inputRef.current?.focus();
  };

  const handleCloseEndModal = () => {
    setShowEndModal(false);
  };

  const totalCountries = countries.length;
  const guessedCount = guessedCountries.size;

  return (
    <div className="game">
      <LanguageSelector />
      <header className="game-header">
          <h1>{t.appTitle}</h1>
          <div className="header-stats">
            <Timer time={time} isRunning={isTimerRunning} />
            <div className="score">
              {guessedCount} / {totalCountries}
            </div>
          </div>
        </header>

        <p className="welcome-text">
          {t.welcomeText}
        </p>

      <div className="game-controls">
        <form onSubmit={handleSubmit} className="guess-form">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t.inputPlaceholder}
            className={`guess-input ${lastGuessStatus?.type || ""}`}
            autoFocus
          />
          <button type="submit" className="btn btn-guess">
            {t.guessButton}
          </button>
          <button
            type="button"
            className="btn btn-end"
            onClick={handleEndGame}
          >
            {t.endGameButton}
          </button>
        </form>

        {lastGuessStatus && (
          <div className={`guess-feedback ${lastGuessStatus.type}`}>
            {lastGuessStatus.type === "correct" && (
              <>✓ {t.correct} {lastGuessStatus.name}</>
            )}
            {lastGuessStatus.type === "wrong" && (
              <>✗ {t.wrong} "{lastGuessStatus.input}" {t.penaltyNote}</>
            )}
            {lastGuessStatus.type === "duplicate" && (
              <>⚠ {t.alreadyGuessed} {lastGuessStatus.name}</>
            )}
          </div>
        )}
      </div>

      <ContinentProgress guessedCountries={guessedCountries} />

      <WorldMap
        guessedCountries={guessedCountries}
        onCountryClick={handleCountryClick}
        activeHintCountry={hintCountryCode}
      />

      {hintCountryCode && (
        <CountryHintModal
          countryCode={hintCountryCode}
          onClose={() => setHintCountryCode(null)}
        />
      )}

      {showEndModal && (
        <EndGameModal
          guessedCountries={guessedCountries}
          totalTime={time}
          onClose={handleCloseEndModal}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default Game;
