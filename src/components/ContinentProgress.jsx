import { continents, getCountriesByContinent, continentColors } from "../data/countries";

function ContinentProgress({ guessedCountries }) {
  const getContinentProgress = (continent) => {
    const countriesInContinent = getCountriesByContinent(continent);
    const guessedInContinent = countriesInContinent.filter((c) =>
      guessedCountries.has(c.code)
    ).length;
    return {
      guessed: guessedInContinent,
      total: countriesInContinent.length,
      percentage:
        countriesInContinent.length > 0
          ? (guessedInContinent / countriesInContinent.length) * 100
          : 0,
    };
  };

  return (
    <div className="continent-progress-container">
      {continents.map((continent) => {
        const progress = getContinentProgress(continent);
        return (
          <div key={continent} className="continent-progress">
            <div className="continent-label">
              <span className="continent-name">{continent}</span>
              <span className="continent-count">
                {progress.guessed}/{progress.total}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress.percentage}%`,
                  backgroundColor: continentColors[continent],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContinentProgress;
