import { continents, getCountriesByContinent } from "../data/countries";

function EndGameModal({ guessedCountries, totalTime, onClose, onRestart }) {
  const getMissedCountries = () => {
    const missed = [];
    continents.forEach((continent) => {
      const countriesInContinent = getCountriesByContinent(continent);
      const missedInContinent = countriesInContinent.filter(
        (c) => !guessedCountries.has(c.code)
      );
      if (missedInContinent.length > 0) {
        missed.push({
          continent,
          countries: missedInContinent,
        });
      }
    });
    return missed;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const missedByContinent = getMissedCountries();
  const totalCountries = continents.reduce(
    (acc, continent) => acc + getCountriesByContinent(continent).length,
    0
  );
  const guessedCount = guessedCountries.size;
  const missedCount = totalCountries - guessedCount;

  return (
    <div className="modal-overlay">
      <div className="modal-content end-game-modal">
        <h2>Game Over!</h2>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-value">{guessedCount}</span>
            <span className="stat-label">Countries Found</span>
          </div>
          <div className="stat">
            <span className="stat-value">{missedCount}</span>
            <span className="stat-label">Countries Missed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatTime(totalTime)}</span>
            <span className="stat-label">Total Time</span>
          </div>
        </div>

        {missedByContinent.length > 0 && (
          <div className="missed-countries">
            <h3>Missed Countries</h3>
            <div className="missed-list">
              {missedByContinent.map(({ continent, countries }) => (
                <div key={continent} className="missed-continent">
                  <h4>{continent}</h4>
                  <div className="missed-country-list">
                    {countries.map((country) => (
                      <span key={country.code} className="missed-country">
                        <img
                          src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                          alt=""
                          className="mini-flag"
                        />
                        {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onRestart}>
            Play Again
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGameModal;
