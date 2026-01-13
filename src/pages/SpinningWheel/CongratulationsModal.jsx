import React from 'react';
import './CongratulationsModal.css';

const CongratulationsModal = ({ reward, onClaim }) => {
  return (
    <div className="congratulations-overlay">
      <div className="congratulations-modal">
        {/* Background ellipses */}
        <div className="modal-ellipse modal-ellipse-39"></div>
        <div className="modal-ellipse modal-ellipse-42"></div>

        {/* Logo */}
        <div className="modal-logo">
          <img src="/logo.svg" alt="HEDG" />
        </div>

        {/* Congratulations text */}
        <h2 className="modal-title">Congratulations!</h2>

        {/* Reward description */}
        <p className="modal-reward">
          You've unlocked{' '}
          <span className="reward-highlight">
            "{reward?.name || 'Risk-free credit'}{reward?.description ? ` ${reward.description}` : ''}"
          </span>
        </p>

        {/* Reward image/icon placeholder */}
        <div className="reward-visual">
          <img src="/assets/Image Enhancer-1767935863000 1.png" alt="Gift" className="reward-icon" />
        </div>

        {/* Claim button */}
        <button className="claim-button" onClick={onClaim}>
          Claim your reward
        </button>

        {/* Terms & Conditions */}
        <p className="modal-terms">Terms & conditions apply</p>
      </div>
    </div>
  );
};

export default CongratulationsModal;
