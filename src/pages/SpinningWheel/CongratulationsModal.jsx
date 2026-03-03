import { useTranslation } from "react-i18next";
import "./CongratulationsModal.css";

const CongratulationsModal = ({ reward, onClaim }) => {
  const { t } = useTranslation();

  return (
    <div className="congratulations-overlay">
      <div className="congratulations-modal">
        {/* Background ellipses */}
        <div className="modal-ellipse modal-ellipse-39"></div>
        <div className="modal-ellipse modal-ellipse-42"></div>

        {/* Logo
        <div className="modal-logo">
          <img src="/logo.svg" alt="HEDG" />
        </div> */}

        {/* Congratulations text */}
        <h2 className="modal-title">{t("CONGRATS_MODAL_TITLE")}</h2>

        {/* Reward description */}
        <p className="modal-reward">
          {t("CONGRATS_MODAL_REWARD_PREFIX")}{" "}
          <span className="reward-highlight">
            "
            {reward?.labelKey
              ? t(reward.labelKey)
              : t("CONGRATS_MODAL_REWARD_FALLBACK")}{" "}
            {t("CONGRATS_MODAL_REWARD_SUFFIX")} "
          </span>
        </p>

        {/* Reward image/icon placeholder */}
        <div className="reward-visual">
          <img
            src="/assets/Image Enhancer-1767935863000 1.png"
            alt="Gift"
            className="reward-icon"
          />
        </div>

        {/* Claim button */}
        <button className="claim-button" onClick={onClaim}>
          {t("CONGRATS_MODAL_CLAIM_BUTTON")}
        </button>

        {/* Terms & Conditions */}
        <p className="modal-terms">{t("CONGRATS_MODAL_TERMS")}</p>
      </div>
    </div>
  );
};

export default CongratulationsModal;
