import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 80, speed = 1 }) => {
  return (
    <div className="spinner-container">
      <img
        src="/logo.svg"
        alt="Loading..."
        className="spinner-logo"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${1 / speed}s`
        }}
      />
    </div>
  );
};

export default Spinner;
