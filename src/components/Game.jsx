import { useState, useEffect, useRef, useCallback } from "react";
import WorldMap from "./WorldMap";
import ContinentProgress from "./ContinentProgress";
import CountryHintModal from "./CountryHintModal";
import ContinentCompletionModal from "./ContinentCompletionModal";
import EndGameModal from "./EndGameModal";
import Timer from "./Timer";
import LanguageSelector from "./LanguageSelector";
import { findCountry, countries, findDependency, getDependenciesForCountry, continents, getCountriesByContinent, continentColors } from "../data/countries";
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
  const [canClearStatus, setCanClearStatus] = useState(true);
  const [celebratedContinents, setCelebratedContinents] = useState(new Set());
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [isTimerRunning]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (canClearStatus) {
      setLastGuessStatus(null);
    }
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedInput = inputValue.trim();
      if (!trimmedInput) return;

      // Clear any existing status timer
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
        statusTimerRef.current = null;
      }

      // Reset the ability to clear status
      setCanClearStatus(true);

      if (!isTimerRunning) {
        setIsTimerRunning(true);
      }

      const country = findCountry(trimmedInput, language);

      if (country) {
        if (guessedCountries.has(country.code)) {
          setLastGuessStatus({ type: "duplicate", name: getCountryName(country.code) });
        } else {
          // Add the country and its dependencies to guessed countries
          const deps = getDependenciesForCountry(country.code);
          const newGuessed = new Set([...guessedCountries, country.code]);

          // Also add all dependency codes to the guessed set
          deps.forEach(dep => {
            newGuessed.add(dep.code);
          });

          setGuessedCountries(newGuessed);

          // Check for continent completion
          continents.forEach((continent) => {
            const countriesInContinent = getCountriesByContinent(continent);
            const guessedInContinent = countriesInContinent.filter(c =>
              newGuessed.has(c.code)
            ).length;

            if (guessedInContinent === countriesInContinent.length &&
                !celebratedContinents.has(continent)) {
              // Continent just completed!
              setIsTimerRunning(false); // Pause timer
              setCurrentCelebration(continent);
              setCelebratedContinents(prev => new Set([...prev, continent]));
            }
          });

          if (deps.length > 0) {
            const depNames = deps.map(d => d.name).join(", ");
            setLastGuessStatus({
              type: "correct-with-deps",
              name: getCountryName(country.code),
              dependencies: depNames
            });
          } else {
            setLastGuessStatus({ type: "correct", name: getCountryName(country.code) });
          }
        }
      } else {
        // Check if it's a dependency
        const dependency = findDependency(trimmedInput, language);
        if (dependency) {
          setLastGuessStatus({
            type: "dependency",
            name: dependency.name,
            parentName: dependency.parentName
          });

          // Prevent clearing the status for 3 seconds to give user time to read
          setCanClearStatus(false);
          statusTimerRef.current = setTimeout(() => {
            setCanClearStatus(true);
          }, 3000);
        } else {
          setLastGuessStatus({ type: "wrong", input: trimmedInput });
          setTime((prev) => prev + 5);
        }
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

  const handleReset = () => {
    handleRestart();
  };

  const handleCloseCelebration = () => {
    setCurrentCelebration(null);
    setIsTimerRunning(true); // Resume timer
    inputRef.current?.focus();
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
    setCanClearStatus(true);
    setCelebratedContinents(new Set());
    setCurrentCelebration(null);
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
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
          {isTimerRunning && (
            <button
              type="button"
              className="btn btn-reset"
              onClick={handleReset}
            >
              {t.resetButton}
            </button>
          )}
          <button
            type="button"
            className="btn btn-end"
            onClick={handleEndGame}
          >
            {t.endGameButton}
          </button>
        </form>

        <div className="guess-feedback-container">
          {lastGuessStatus && (
            <div className={`guess-feedback ${lastGuessStatus.type}`}>
              {lastGuessStatus.type === "correct" && (
                <>✓ {t.correct} {lastGuessStatus.name}</>
              )}
              {lastGuessStatus.type === "correct-with-deps" && (
                <>✓ {t.correct} {lastGuessStatus.name} ({t.includesDependencies} {lastGuessStatus.dependencies})</>
              )}
              {lastGuessStatus.type === "wrong" && (
                <>✗ {t.wrong} "{lastGuessStatus.input}" {t.penaltyNote}</>
              )}
              {lastGuessStatus.type === "duplicate" && (
                <>⚠ {t.alreadyGuessed} {lastGuessStatus.name}</>
              )}
              {lastGuessStatus.type === "dependency" && (
                <>⚠ {lastGuessStatus.name} {t.dependencyWarning}</>
              )}
            </div>
          )}
        </div>
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

      {currentCelebration && (
        <ContinentCompletionModal
          continent={currentCelebration}
          continentColor={continentColors[currentCelebration]}
          onClose={handleCloseCelebration}
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
