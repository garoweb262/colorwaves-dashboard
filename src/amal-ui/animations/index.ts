import { Variants, Transition } from "framer-motion";

// Animation Presets
export const animationPresets = {
  // Spring animations (Material UI inspired)
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  } as Transition,

  // Smooth ease animations
  smooth: {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.3,
  } as Transition,

  // Quick snap animations
  snap: {
    type: "spring",
    stiffness: 500,
    damping: 25,
  } as Transition,

  // Gentle fade animations
  gentle: {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.4,
  } as Transition,

  // Bounce animations
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  } as Transition,
} as const;

// Page Transitions
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: animationPresets.smooth,
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: animationPresets.spring,
  },

  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: animationPresets.smooth,
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: animationPresets.spring,
  },
} as const;

// Component Animations
export const componentAnimations = {
  // Button animations
  button: {
    tap: { scale: 0.95 },
    hover: { scale: 1.02, y: -1 },
    transition: animationPresets.snap,
  },

  // Card animations
  card: {
    hover: {
      y: -4,
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    tap: { scale: 0.98 },
    transition: animationPresets.smooth,
  },

  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: animationPresets.spring,
  },

  // Sheet animations
  sheet: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: animationPresets.smooth,
  },

  // Dropdown animations
  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: animationPresets.snap,
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: animationPresets.smooth,
  },

  // Fade in animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: animationPresets.gentle,
  },

  // Scale animations
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: animationPresets.spring,
  },
} as const;

// Stagger animations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as Variants;

// Parallax animations
export const parallaxAnimations = {
  slow: {
    y: (i: number) => i * 0.1,
    transition: animationPresets.smooth,
  },
  medium: {
    y: (i: number) => i * 0.2,
    transition: animationPresets.smooth,
  },
  fast: {
    y: (i: number) => i * 0.3,
    transition: animationPresets.smooth,
  },
} as const;

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: animationPresets.smooth,
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: animationPresets.smooth,
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: animationPresets.smooth,
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: animationPresets.spring,
  },
} as const;

// SVG animations
export const svgAnimations = {
  draw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 2, ease: "easeInOut" },
  },

  morph: {
    initial: { d: "M0 0" },
    animate: { d: "M0 0 L100 0 L100 100 L0 100 Z" },
    transition: animationPresets.smooth,
  },

  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
} as const;

// Hover animations
export const hoverAnimations = {
  lift: {
    hover: { y: -4, scale: 1.02 },
    transition: animationPresets.smooth,
  },

  glow: {
    hover: {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
      scale: 1.02,
    },
    transition: animationPresets.smooth,
  },

  pulse: {
    hover: { scale: 1.05 },
    transition: animationPresets.bounce,
  },
} as const;

// Utility functions
export const createStaggerAnimation = (delay: number = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

export const createScrollAnimation = (
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 30
) => {
  const initial: { opacity: number; x?: number; y?: number } = { opacity: 0 };
  const animate: { opacity: number; x?: number; y?: number } = { opacity: 1 };

  switch (direction) {
    case "up":
      initial.y = distance;
      animate.y = 0;
      break;
    case "down":
      initial.y = -distance;
      animate.y = 0;
      break;
    case "left":
      initial.x = distance;
      animate.x = 0;
      break;
    case "right":
      initial.x = -distance;
      animate.x = 0;
      break;
  }

  return {
    initial,
    whileInView: animate,
    viewport: { once: true, margin: "-100px" },
    transition: animationPresets.smooth,
  };
};
