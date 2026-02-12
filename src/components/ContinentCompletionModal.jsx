import { useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

function ContinentCompletionModal({ continent, continentColor, onClose }) {
  const { t, getContinentName } = useLanguage();

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [onClose]);

  const continentName = getContinentName(continent);
  const celebrationMessage = t.completedCelebration.replace("{continent}", continentName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content celebration-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: continentColor }}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>🎉 {t.continentComplete}</h2>
        <p>{celebrationMessage}</p>
      </div>
    </div>
  );
}

export default ContinentCompletionModal;
