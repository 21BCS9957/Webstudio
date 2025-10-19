import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface ReducedMotionOptions {
  fallbackDuration?: number;
  fallbackEasing?: string;
  disableAnimations?: boolean;
}

interface ReducedMotionReturn {
  prefersReducedMotion: boolean;
  getAnimationProps: (originalProps: any) => any;
  shouldAnimate: boolean;
}

export function useReducedMotion(options: ReducedMotionOptions = {}): ReducedMotionReturn {
  const {
    fallbackDuration = 0.2,
    fallbackEasing = 'ease-out',
    disableAnimations = false
  } = options;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getAnimationProps = (originalProps: any) => {
    if (prefersReducedMotion || disableAnimations) {
      // Return reduced motion alternatives
      return {
        ...originalProps,
        transition: {
          duration: fallbackDuration,
          ease: fallbackEasing,
          type: 'tween'
        },
        // Disable complex animations
        animate: originalProps.animate ? {
          ...originalProps.animate,
          scale: 1, // Remove scale animations
          rotate: 0, // Remove rotation
          x: 0,     // Reduce movement
          y: 0      // Reduce movement
        } : undefined,
        // Simplify variants
        variants: originalProps.variants ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        } : undefined
      };
    }

    return originalProps;
  };

  const shouldAnimate = !prefersReducedMotion && !disableAnimations;

  return {
    prefersReducedMotion,
    getAnimationProps,
    shouldAnimate
  };
}

// Higher-order component for automatic reduced motion support
export function withReducedMotion<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: ReducedMotionOptions
) {
  const WithReducedMotion = (props: P) => {
    const { getAnimationProps } = useReducedMotion(options);
    
    // Apply reduced motion props to the component
    const enhancedProps = getAnimationProps(props);
    
    return React.createElement(WrappedComponent, enhancedProps);
  };

  WithReducedMotion.displayName = `withReducedMotion(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithReducedMotion;
}

// Utility function to get reduced motion CSS
export function getReducedMotionCSS(): string {
  return `
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
}

// Context for reduced motion preferences
interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
  shouldAnimate: boolean;
  getAnimationProps: (props: any) => any;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | null>(null);

interface ReducedMotionProviderProps {
  children: ReactNode;
  options?: ReducedMotionOptions;
}

export const ReducedMotionProvider: React.FC<ReducedMotionProviderProps> = ({
  children,
  options = {}
}) => {
  const reducedMotionState = useReducedMotion(options);

  return React.createElement(
    ReducedMotionContext.Provider,
    { value: reducedMotionState },
    children
  );
};

export const useReducedMotionContext = (): ReducedMotionContextType => {
  const context = useContext(ReducedMotionContext);
  if (!context) {
    throw new Error('useReducedMotionContext must be used within a ReducedMotionProvider');
  }
  return context;
};