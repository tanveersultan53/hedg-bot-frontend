import SpinWheel from "./SpinWheel";
import "../WheelPrompt/WheelPrompt.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CongratulationsModal from "../SpinningWheel/CongratulationsModal";

const SpinToUnlock = ({ onSpinComplete, setReward, reward }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (reward) => {
    setReward(reward);
    setShowModal(true);
  };

  return (
    <>
      <div className="splash-screen">
        <div className="background-overlay"></div>
        <div className="ellipse ellipse-39"></div>
        <div className="ellipse ellipse-42"></div>
        <div className="ellipse ellipse-44"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Spinning Wheel */}
          <h1 className="page-title">{t("SPIN_TO_UNLOCK_TITLE")}</h1>
          <p className="page-subtitle">{t("SPIN_TO_UNLOCK_SUBTITLE")}</p>
          <SpinWheel setReward={handleShowModal} />
        </div>
      </div>
      {showModal && (
        <CongratulationsModal reward={reward} onClaim={onSpinComplete} />
      )}
    </>
  );
};

export default SpinToUnlock;
