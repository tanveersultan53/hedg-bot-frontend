import { useState, useRef } from "react";

const segments = [
  { label: "VIP Onboarding", color: "#4DB59E", textColor: "#fff" },
  { label: "Risk-Free Credit", color: "#2D8E78", textColor: "#fff" },
  { label: "Priority Support", color: "#4DB59E", textColor: "#fff" },
  { label: "Fee Discounts", color: "#2D8E78", textColor: "#fff" },
  { label: "Upgraded Acccess", color: "#4DB59E", textColor: "#fff" },
  { label: "Welcome Bonus", color: "#2D8E78", textColor: "#fff" },
];

const SEGMENT_ANGLE = 360 / segments.length;

// Precompute SVG arc paths for each segment
function getSegmentPath(index, total, r = 100, cx = 100, cy = 100) {
  const startAngle = (index * 360) / total;
  const endAngle = ((index + 1) * 360) / total;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.sin(toRad(startAngle));
  const y1 = cy - r * Math.cos(toRad(startAngle));
  const x2 = cx + r * Math.sin(toRad(endAngle));
  const y2 = cy - r * Math.cos(toRad(endAngle));
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
}

function getLabelTransform(index, total) {
  const angle = (index + 0.5) * (360 / total);
  return `rotate(${angle},100,100)`;
}

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const currentRotation = useRef(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);

    const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360;
    const randomSegment = Math.floor(Math.random() * segments.length);
    const targetAngle =
      extraSpins + randomSegment * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

    currentRotation.current += targetAngle;
    setRotation(currentRotation.current);

    setTimeout(() => {
      setSpinning(false);
      const normalised = ((currentRotation.current % 360) + 360) % 360;
      const idx =
        Math.floor(((360 - normalised + 270) % 360) / SEGMENT_ANGLE) %
        segments.length;
      setResult(`→ ${segments[idx].label}`);
      setShowResult(true);
    }, 4200);
  };

  // Styles
  const styles = {
    title: {
      fontSize: "3.5rem",
      fontWeight: "800",
      letterSpacing: "0.12em",
      color: "#fff",
      marginBottom: "2.5rem",
      textTransform: "uppercase",
      textShadow: "0 0 40px rgba(255,255,255,0.12)",
    },
    wheelWrapper: {
      position: "relative",
      width: "380px",
      height: "380px",
    },
    pointer: {
      position: "absolute",
      top: "-18px",
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: 0,
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      borderTop: "36px solid #fff",
      zIndex: 10,
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
    },
    svg: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      boxShadow:
        "0 0 0 6px #1a1a1a, 0 0 0 10px #333, 0 20px 60px rgba(0,0,0,0.7)",
      transform: `rotate(${rotation}deg)`,
      transition: spinning
        ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
        : "none",
    },
    centerCap: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "52px",
      height: "52px",
      background: "#0f0f0f",
      border: "4px solid #333",
      borderRadius: "50%",
      zIndex: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    centerDot: {
      width: "16px",
      height: "16px",
      background: "#fff",
      borderRadius: "50%",
    },
    button: {
      marginTop: "2.5rem",
      fontFamily: "inherit",
      fontWeight: "700",
      fontSize: "1.2rem",
      letterSpacing: "0.15em",
      padding: "0.75rem 3rem",
      background: spinning ? "#555" : "#fff",
      color: spinning ? "#999" : "#0f0f0f",
      border: "none",
      borderRadius: "4px",
      cursor: spinning ? "not-allowed" : "pointer",
      textTransform: "uppercase",
      boxShadow: "0 6px 24px rgba(255,255,255,0.12)",
      transition: "background 0.2s, color 0.2s, transform 0.1s",
    },
    result: {
      marginTop: "1.5rem",
      fontSize: "1.3rem",
      fontWeight: "700",
      letterSpacing: "0.1em",
      color: "#fff",
      opacity: showResult ? 1 : 0,
      transition: "opacity 0.5s ease",
      minHeight: "2rem",
      textTransform: "uppercase",
    },
  };

  return (
    <div>
      <div style={styles.wheelWrapper}>
        {/* Pointer */}
        <div style={styles.pointer} />

        {/* Wheel SVG */}
        <svg style={styles.svg} viewBox="0 0 200 200">
          {/* Segments */}
          {segments.map((seg, i) => (
            <path
              key={i}
              d={getSegmentPath(i, segments.length)}
              fill={seg.color}
            />
          ))}

          {/* Divider lines */}
          {segments.map((_, i) => {
            const angle = (i * 360) / segments.length;
            const rad = (angle * Math.PI) / 180;
            const x = 100 + 100 * Math.sin(rad);
            const y = 100 - 100 * Math.cos(rad);
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}

          {/* Labels */}
          {segments.map((seg, i) => {
            const words = seg.label.split(" ");
            return (
              <text
                key={i}
                transform={getLabelTransform(i, segments.length)}
                x="100"
                y="38"
                textAnchor="middle"
                fill={seg.textColor}
                fontWeight="700"
                fontSize="8"
              >
                <tspan x="100" y="30" dominantBaseline="middle">
                  {words[0]}
                </tspan>
                <tspan x="100" y="40" dominantBaseline="middle">
                  {words[1]}
                </tspan>
              </text>
            );
          })}
        </svg>

        {/* Center cap */}
        {/* <div style={styles.centerCap}>
          <div style={styles.centerDot} />
        </div> */}
      </div>

      {/* <button style={styles.button} onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>

      <div style={styles.result}>{result}</div> */}
    </div>
  );
}
