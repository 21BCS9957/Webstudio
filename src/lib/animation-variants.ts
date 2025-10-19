import { Variants } from 'framer-motion';

// Custom easing functions for natural animations
export const easings = {
  // Smooth and natural easing for most animations
  smooth: [0.25, 0.46, 0.45, 0.94],
  // Bouncy easing for playful interactions
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Sharp easing for quick transitions
  sharp: [0.4, 0, 0.2, 1],
  // Gentle easing for subtle animations
  gentle: [0.25, 0.1, 0.25, 1]
} as const;

// Fade in with upward motion - primary animation for content reveals
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Fade in with downward motion - alternative reveal animation
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Fade in from left - for horizontal reveals
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Fade in from right - for horizontal reveals
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Scale fade in - for emphasis animations
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Container for staggered children animations
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      duration: 0.6,
      ease: easings.smooth
    }
  }
};

// Child items for staggered animations
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth
    }
  }
};

// Progress line animation for scroll-based progress
export const progressLine: Variants = {
  hidden: {
    scaleX: 0,
    transformOrigin: 'left',
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    scaleX: 1,
    transformOrigin: 'left',
    transition: {
      duration: 1.2,
      ease: easings.smooth
    }
  }
};

// Hover lift effect for interactive elements
export const hoverLift: Variants = {
  initial: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.gentle
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: easings.gentle
    }
  }
};

// Subtle hover glow effect
export const hoverGlow: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: {
      duration: 0.3,
      ease: easings.gentle
    }
  },
  hover: {
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: easings.gentle
    }
  }
};

// Slide in from bottom - for modal/drawer animations
export const slideInUp: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: easings.sharp
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  }
};

// Rotate and scale in - for loading or emphasis
export const rotateScaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -180,
    transition: {
      duration: 0.6,
      ease: easings.smooth
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: easings.bouncy
    }
  }
};

// Reduced motion variants - simplified animations for accessibility
export const reducedMotionVariants = {
  // Simple fade without movement
  fadeOnly: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'linear' } }
  },
  // Instant appearance for users who prefer no animation
  instant: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } }
  },
  // Minimal movement for essential feedback
  subtle: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'linear' } }
  }
};

// Utility function to create reduced motion versions of any variant
export function createReducedMotionVariant(originalVariant: Variants): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.2, ease: 'linear' }
    }
  };
}

// Utility function to get appropriate variants based on reduced motion preference
export function getAccessibleVariants(
  originalVariant: Variants, 
  prefersReducedMotion: boolean,
  reducedMotionType: 'fadeOnly' | 'instant' | 'subtle' = 'fadeOnly'
): Variants {
  if (prefersReducedMotion) {
    return reducedMotionVariants[reducedMotionType];
  }
  return originalVariant;
}

// Enhanced variants that automatically adapt to reduced motion
export function createAdaptiveVariants(baseVariant: Variants): {
  full: Variants;
  reduced: Variants;
  adaptive: (prefersReducedMotion: boolean) => Variants;
} {
  const reducedVariant = createReducedMotionVariant(baseVariant);
  
  return {
    full: baseVariant,
    reduced: reducedVariant,
    adaptive: (prefersReducedMotion: boolean) => 
      prefersReducedMotion ? reducedVariant : baseVariant
  };
}

// Export all variants as a collection for easy access
export const animationVariants = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  progressLine,
  hoverLift,
  hoverGlow,
  slideInUp,
  rotateScaleIn,
  reducedMotionVariants
};