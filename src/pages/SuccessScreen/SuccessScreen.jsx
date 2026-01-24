import WebApp from '@twa-dev/sdk';
import './SuccessScreen.css';

const SuccessScreen = ({ redirectUrl }) => {
  const handleLaunchPlatform = () => {
    // Open WebTrader in external browser if user explicitly wants it
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleClose = () => {
    // Close the Telegram Mini App
    WebApp.close();
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
        <h1 className="success-title">You're all set!</h1>

        {/* Description */}
        <p className="success-description">
          Your account has been created successfully. Our VIP representative will contact you shortly.
        </p>

        {/* Close button - primary action */}
        <button className="launch-button" onClick={handleClose}>
          Done
        </button>

        {/* Optional: Launch platform link */}
        {redirectUrl && (
          <button className="continue-link" onClick={handleLaunchPlatform}>
            Open Web Platform
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessScreen;
