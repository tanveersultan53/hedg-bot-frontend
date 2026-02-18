import SpinWheel from "./SpinWheel";

const SpinToUnlock = () => {
  return (
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
        <h1 className="page-title">You’re In</h1>
        <p className="page-subtitle">
          Spin the wheel to unlock your HEDG reward
        </p>
        <SpinWheel />
      </div>
    </div>
  );
};

export default SpinToUnlock;
