import { getCountryByCode } from "../data/countries";

function CountryHintModal({ countryCode, onClose }) {
  const country = getCountryByCode(countryCode);

  if (!country) return null;

  const flagUrl = `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hint-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Country Hint</h2>
        <div className="hint-content">
          <img
            src={flagUrl}
            alt="Country flag"
            className="country-flag"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="hint-info">
            <p>
              <strong>Capital:</strong> {country.capital}
            </p>
            <p>
              <strong>Continent:</strong> {country.continent}
            </p>
          </div>
        </div>
        <p className="hint-note">Can you guess this country?</p>
      </div>
    </div>
  );
}

export default CountryHintModal;
