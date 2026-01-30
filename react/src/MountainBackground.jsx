import React from "react";
import "./MountainBackground.css";

const MountainBackground = () => {
  return (
    <div className="mountain-bg">
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          />
        ))}
      </div>
      <div className="mountain-layer layer-1"></div>
      <div className="mountain-layer layer-2"></div>
      <div className="mountain-layer layer-3"></div>
      <div className="moon-glow"></div>
    </div>
  );
};

export default MountainBackground;
