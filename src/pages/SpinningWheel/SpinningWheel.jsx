import React, { useState, useEffect } from "react";
import "./SpinningWheel.css";
import CongratulationsModal from "./CongratulationsModal";

const SpinningWheel = ({ onSpinComplete, reward }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Start spinning
    setSpinning(true);

    // Calculate final rotation with random stopping position
    const baseSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations for variety
    const randomStopPosition = Math.random() * 360; // Random position 0-360 degrees
    const finalRotation = baseSpins * 360 + randomStopPosition;

    setTimeout(() => {
      setRotation(finalRotation);
    }, 100);

    // Stop spinning after animation
    const timer = setTimeout(() => {
      setSpinning(false);
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [reward]);

  const handleClaimReward = () => {
    setShowModal(false);
    setTimeout(() => {
      onSpinComplete();
    }, 300);
  };

  return (
    <div className="spinning-wheel-container">
      {/* Background ellipses */}
      <div className="ellipse ellipse-39"></div>
      <div className="ellipse ellipse-42"></div>
      <div className="ellipse ellipse-44"></div>

      {/* Spinning Wheel */}
      <h1 className="page-title">Hurrah !</h1>
      <p className="page-subtitle">Spining...</p>

      <div className="wheel-wrapper">
        <img
          src="/assets/fb15534c055241e249db244403b3ae373fa7e2e5.png"
          alt="Pointer"
          className="wheel-pointer"
        />
        <div className="wheel-main">
          {/* Radial gradient glow overlay */}
          <div className="wheel-glow"></div>
          <img src="/assets/ring.png" alt="ring" className="ring" />
          <img
            src="/assets/spiner.png"
            alt="spinner"
            className={`spiner ${spinning ? "spinning" : "stopped"}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          />

          {/* <div className="wheel-segment segment-1">
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
          </div> */}
        </div>
      </div>

      <div className="spin-footer">
        <p className="wait-text">Good luck!</p>
      </div>

      {/* Congratulations Modal */}
      {showModal && (
        <CongratulationsModal reward={reward} onClaim={handleClaimReward} />
      )}
    </div>
  );
};

export default SpinningWheel;
