import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import SpinWheel from "./SpinWheel";

const data = [
  { option: "VIP Onboarding" },
  { option: "Risk-Free Credit" },
  { option: "Priority Support" },
  { option: "Fee Discounts" },
  { option: "Upgraded Acccess" },
  { option: "Welcome Bonus" },
];

const SpinToUnlock = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className="splash-screen">
      <div className="background-overlay"></div>
      <div className="ellipse ellipse-39"></div>
      <div className="ellipse ellipse-42"></div>
      <div className="ellipse ellipse-44"></div>

      {/* <div>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor={["#5DBEA8"]}
          outerBorderWidth={[4]}
          innerBorderColor={["#fff"]}
          radiusLineColor={["#fff"]}
          radiusLineWidth={[6]}
          fontSize={15}
          textColors={["#ffffff"]}
          backgroundColors={[
            "#4DB59E",
            "#2D8E78",
            "#4DB59E",
            "#2D8E78",
            "#4DB59E",
            "#2D8E78",
          ]}
          onStopSpinning={() => {
            setMustSpin(false);
            console.log(data[prizeNumber]);
          }}
        />
        <button onClick={handleSpinClick}>SPIN</button>
        {!mustSpin ? data[prizeNumber].option : "0"}
      </div> */}

      <SpinWheel />
    </div>
  );
};

export default SpinToUnlock;
