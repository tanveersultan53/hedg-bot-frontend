import React, { useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="background-overlay"></div>
      <div className="ellipse ellipse-39"></div>
      <div className="ellipse ellipse-42"></div>
      <div className="ellipse ellipse-44"></div>

      <div className="logo-container">
        {/* <div className="spinner-ring"></div> */}
        <div className="logo-wrapper">
          <img
            src="/logo.svg"
            alt="H"
            className="hedg-logo-img"
          />
          <div className="logo-text">EDG</div>
        </div>
      </div>

      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default SplashScreen;
