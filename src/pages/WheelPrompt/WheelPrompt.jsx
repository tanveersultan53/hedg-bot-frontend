import React from 'react';
import './WheelPrompt.css';

const WheelPrompt = ({ onSpin }) => {
  return (
    <div className="wheel-prompt-simple">
      {/* Background ellipses */}
      <div className="ellipse-cyan"></div>
      <div className="ellipse-orange-bottom"></div>
      <div className="ellipse-orange-top"></div>

      {/* Spinning Wheel */}
      <div className="wheel-container">
        <img
          src="/assets/fb15534c055241e249db244403b3ae373fa7e2e5.png"
          alt="Pointer"
          className="wheel-pointer-static"
        />
        <div className="wheel-static">
          <div className="wheel-glow"></div>
          <div className="wheel-segment segment-1">
            <div className="segment-content">
              <div className="segment-icon">🔓</div>
              <span className="segment-text">Upgraded Access</span>
            </div>
          </div>
          <div className="wheel-segment segment-2">
            <div className="segment-content">
              <div className="segment-icon">💳</div>
              <span className="segment-text">Fee Discounts</span>
            </div>
          </div>
          <div className="wheel-segment segment-3">
            <div className="segment-content">
              <div className="segment-icon">💰</div>
              <span className="segment-text">Risk Free Credit</span>
            </div>
          </div>
          <div className="wheel-segment segment-4">
            <div className="segment-content">
              <div className="segment-icon">⭐</div>
              <span className="segment-text">VIP Onboarding</span>
            </div>
          </div>
          <div className="wheel-segment segment-5">
            <div className="segment-content">
              <div className="segment-icon">💳</div>
              <span className="segment-text">Fee Discounts</span>
            </div>
          </div>
          <div className="wheel-segment segment-6">
            <div className="segment-content">
              <div className="segment-icon">🎁</div>
              <span className="segment-text">Welcome Bonus</span>
            </div>
          </div>
          <div className="wheel-center">
            <img src="/logo.svg" alt="HEDG" className="wheel-logo" />
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button className="spin-btn" onClick={onSpin}>
        Spin
      </button>
    </div>
  );
};

export default WheelPrompt;
