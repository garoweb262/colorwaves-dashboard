import React from "react";
import { useMotionTemplate, useMotionValue } from "framer-motion";

export interface MotionConfig {
  radius?: number;
  color?: string;
}

export function useMotionGradient(config: MotionConfig = {}) {
  const { radius = 100, color = "#3b82f6" } = config;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: any) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      ${radius}px circle at ${mouseX}px ${mouseY}px,
      ${color},
      transparent 80%
    )
  `;

  return {
    mouseX,
    mouseY,
    handleMouseMove,
    background,
  };
}

export function useMotionState() {
  const [visible, setVisible] = React.useState(false);

  return {
    visible,
    setVisible,
  };
}
