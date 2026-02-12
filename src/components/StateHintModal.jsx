import { getStateByCode } from "../data/states";
import { useLanguage } from "../i18n/LanguageContext";

function StateHintModal({ stateCode, onClose }) {
  const { t } = useLanguage();
  const state = getStateByCode(stateCode);

  if (!state) return null;

  // US state flags are available at flagcdn.com using the state code
  const flagUrl = `https://flagcdn.com/w160/us-${stateCode.toLowerCase()}.png`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hint-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{t.stateHint || "State Hint"}</h2>
        <div className="hint-content">
          <img
            src={flagUrl}
            alt={`${state.name} flag`}
            className="country-flag"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="hint-info">
            <p>
              <strong>{t.capital || "Capital:"}</strong> {state.capital}
            </p>
            <p>
              <strong>{t.region || "Region:"}</strong> {state.region}
            </p>
          </div>
        </div>
        <p className="hint-note">{t.hintNote || "You haven't guessed this one yet!"}</p>
      </div>
    </div>
  );
}

export default StateHintModal;
