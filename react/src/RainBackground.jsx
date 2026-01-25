import React, { useMemo } from "react";
import "./RainBackground.css";

const RainBackground = () => {
  const raindrops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="rain-container">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default RainBackground;
