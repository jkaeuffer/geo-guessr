import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import WorldMap from "./WorldMap";
import ContinentProgress from "./ContinentProgress";
import CountryHintModal from "./CountryHintModal";
import ContinentCompletionModal from "./ContinentCompletionModal";
import EndGameModal from "./EndGameModal";
import Timer from "./Timer";
import LanguageSelector from "./LanguageSelector";
import GameModeSelector from "./GameModeSelector";
import { findCountry, countries, dependencies, findDependency, getDependenciesForCountry, continents, getCountriesByContinent, continentColors } from "../data/countries";
import { useLanguage } from "../i18n/LanguageContext";

function Game() {
  const { t, getCountryName, language } = useLanguage();
  const [gameMode, setGameMode] = useState("classic");
  const [timedModeLimit, setTimedModeLimit] = useState(600); // 10 minutes default
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
  const [streak, setStreak] = useState(0);
  const [recentGuesses, setRecentGuesses] = useState([]);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          // Timed mode: count down
          if (gameMode === "timed") {
            const newTime = prev - 1;
            if (newTime <= 0) {
              setIsTimerRunning(false);
              setShowEndModal(true);
              return 0;
            }
            return newTime;
          }
          // Classic mode: count up
          return prev + 1;
        });
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
  }, [isTimerRunning, gameMode]);

  // Confetti effect when all countries are guessed
  useEffect(() => {
    if (guessedCountries.size === countries.length && guessedCountries.size > 0) {
      // Trigger confetti celebration
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [guessedCountries.size]);

  // Load saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('countryGuesserSave');
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        // Only show resume prompt if game was in progress (has guessed countries)
        if (gameData.guessedCountries && gameData.guessedCountries.length > 0) {
          setShowResumePrompt(true);
        }
      } catch (error) {
        console.error('Failed to load saved game:', error);
        localStorage.removeItem('countryGuesserSave');
      }
    }
  }, []);

  // Save game state to localStorage when it changes
  useEffect(() => {
    // Only save if there are guessed countries and game hasn't ended
    if (guessedCountries.size > 0 && !showEndModal) {
      const gameData = {
        guessedCountries: Array.from(guessedCountries),
        time,
        streak,
        recentGuesses,
        celebratedContinents: Array.from(celebratedContinents),
        timestamp: Date.now()
      };
      localStorage.setItem('countryGuesserSave', JSON.stringify(gameData));
    }
  }, [guessedCountries, time, streak, recentGuesses, celebratedContinents, showEndModal]);

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

          // Add to recent guesses (keep last 8)
          setRecentGuesses(prev => {
            const newRecent = [{ code: country.code, name: getCountryName(country.code) }, ...prev];
            return newRecent.slice(0, 8);
          });

          // Increment streak for correct guess
          setStreak(prev => prev + 1);

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
          // Reset streak on wrong guess
          setStreak(0);
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

  const handleResumeGame = () => {
    const savedGame = localStorage.getItem('countryGuesserSave');
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        setGuessedCountries(new Set(gameData.guessedCountries || []));
        setTime(gameData.time || 0);
        setStreak(gameData.streak || 0);
        setRecentGuesses(gameData.recentGuesses || []);
        setCelebratedContinents(new Set(gameData.celebratedContinents || []));
        setShowResumePrompt(false);
        inputRef.current?.focus();
      } catch (error) {
        console.error('Failed to resume game:', error);
        setShowResumePrompt(false);
      }
    }
  };

  const handleStartNewGame = () => {
    localStorage.removeItem('countryGuesserSave');
    setShowResumePrompt(false);
    inputRef.current?.focus();
  };

  const handleModeChange = (newMode) => {
    if (guessedCountries.size > 0 || isTimerRunning) {
      // If game is in progress, ask for confirmation
      if (confirm(t.confirmModeChange)) {
        setGameMode(newMode);
        handleRestart();
        if (newMode === "timed") {
          setTime(timedModeLimit);
        }
      }
    } else {
      setGameMode(newMode);
      if (newMode === "timed") {
        setTime(timedModeLimit);
      } else {
        setTime(0);
      }
    }
  };

  const handleRestart = () => {
    setGuessedCountries(new Set());
    setHintsUsed(new Set());
    setInputValue("");
    // Reset time based on game mode
    if (gameMode === "timed") {
      setTime(timedModeLimit);
    } else {
      setTime(0);
    }
    setIsTimerRunning(false);
    setHintCountryCode(null);
    setShowEndModal(false);
    setLastGuessStatus(null);
    setCanClearStatus(true);
    setStreak(0);
    setRecentGuesses([]);
    setCelebratedContinents(new Set());
    setCurrentCelebration(null);
    localStorage.removeItem('countryGuesserSave');
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

  // Create a Set of dependency codes for O(1) lookup
  const dependencyCodes = new Set(dependencies.map(d => d.code));

  // Count only actual countries (not dependencies) that have been guessed
  const guessedCount = Array.from(guessedCountries).filter(
    code => !dependencyCodes.has(code)
  ).length;

  const completionPercentage = Math.round((guessedCount / totalCountries) * 100);

  return (
    <div className="game">
      <header className="game-header">
          <h1>{t.appTitle}</h1>
          <div className="header-stats">
            <Timer time={time} isRunning={isTimerRunning} />
            <div className="score">
              {guessedCount} / {totalCountries}
            </div>
            <div className="completion-percentage">
              {completionPercentage}%
            </div>
            {streak > 0 && (
              <div className="streak-counter">
                🔥 {streak}
              </div>
            )}
          </div>
          <LanguageSelector />
        </header>

        <GameModeSelector selectedMode={gameMode} onModeChange={handleModeChange} />

        <p className="welcome-text">
          {gameMode === "classic" ? t.welcomeText : t.timedModeWelcome}
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

        {recentGuesses.length > 0 && (
          <div className="recent-guesses">
            <h3 className="recent-guesses-title">{t.recentGuesses}</h3>
            <div className="recent-guesses-list">
              {recentGuesses.map((guess, index) => (
                <span key={`${guess.code}-${index}`} className="recent-guess-item">
                  {guess.name}
                </span>
              ))}
            </div>
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

      {showResumePrompt && (
        <div className="modal-overlay" onClick={handleStartNewGame}>
          <div className="modal-content resume-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t.continueLastGame}</h2>
            <p>{t.continueGamePrompt}</p>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleResumeGame}>
                {t.resumeGame}
              </button>
              <button className="btn btn-secondary" onClick={handleStartNewGame}>
                {t.startNewGame}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
