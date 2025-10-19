// Central export file for all animation utilities
export * from './animation-variants';
export * from './animation-performance';
export { useScrollAnimation } from '../hooks/use-scroll-animation';

// Re-export commonly used framer-motion components and hooks
export { motion, AnimatePresence } from 'framer-motion';
export { useAnimationControls, useInView } from 'framer-motion';