import React, { useState, useEffect } from 'react';
import './SuccessScreen.css';

const SuccessScreen = ({ redirectUrl, autoRedirectSeconds = 3 }) => {
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl]);

  const handleManualRedirect = () => {
    window.location.href = redirectUrl;
  };

  return (
    <div className="success-screen">
      {/* Background ellipses */}
      <div className="ellipse-cyan"></div>
      <div className="ellipse-orange-bottom"></div>
      <div className="ellipse-orange-top"></div>

      {/* Dark overlay */}
      <div className="success-overlay"></div>

      {/* Success modal */}
      <div className="success-modal">
        {/* Background ellipses for modal */}
        <div className="modal-ellipse-orange"></div>
        <div className="modal-ellipse-cyan"></div>

        {/* Success icon */}
        <div className="success-icon">
          <img src="/logo.svg" alt="Success" />
        </div>

        {/* Title */}
        <h1 className="success-title">You're all set</h1>

        {/* Description */}
        <p className="success-description">
          Our VIP representative will contact you shortly to guide you further.
        </p>

        {/* Launch button */}
        <button className="launch-button" onClick={handleManualRedirect}>
          Launch Platform
        </button>

        {/* Continue link */}
        <a href="#" className="continue-link">
          Continue exploring
        </a>
      </div>
    </div>
  );
};

export default SuccessScreen;
