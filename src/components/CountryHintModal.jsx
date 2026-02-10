import { getCountryByCode } from "../data/countries";
import { useLanguage } from "../i18n/LanguageContext";

function CountryHintModal({ countryCode, onClose }) {
  const { t, getCountryCapital, getContinentName } = useLanguage();
  const country = getCountryByCode(countryCode);

  if (!country) return null;

  const flagUrl = `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hint-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{t.countryHint}</h2>
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
              <strong>{t.capital}</strong> {getCountryCapital(countryCode)}
            </p>
            <p>
              <strong>{t.continent}</strong> {getContinentName(country.continent)}
            </p>
          </div>
        </div>
        <p className="hint-note">{t.hintNote}</p>
      </div>
    </div>
  );
}

export default CountryHintModal;
