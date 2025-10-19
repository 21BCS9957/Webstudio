import React, { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import Lenis from 'lenis';
import AnimationErrorBoundary from '../AnimationErrorBoundary';

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: any) => void;
  isInitialized: boolean;
  hasError: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

interface SmoothScrollProviderProps {
  children: ReactNode;
  options?: SmoothScrollOptions;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  options = {}
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Default Lenis configuration optimized for performance
    const defaultOptions: SmoothScrollOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      smooth: true,
      smoothTouch: false, // Disabled on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
      ...options
    };

    try {
      // Initialize Lenis instance
      lenisRef.current = new Lenis(defaultOptions);
      setIsInitialized(true);
      setHasError(false);

      // Animation frame loop for Lenis
      const raf = (time: number) => {
        try {
          lenisRef.current?.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        } catch (error) {
          console.error('Lenis animation frame error:', error);
          setHasError(true);
          // Stop the animation loop on error
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      };
      rafRef.current = requestAnimationFrame(raf);

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        try {
          lenisRef.current?.destroy();
        } catch (error) {
          console.error('Error destroying Lenis:', error);
        }
        lenisRef.current = null;
        setIsInitialized(false);
      };
    } catch (error) {
      console.error('Failed to initialize Lenis:', error);
      setHasError(true);
      setIsInitialized(false);
      // Graceful degradation - continue without smooth scrolling
      lenisRef.current = null;
    }
  }, [options]);

  const scrollTo = (target: string | number | HTMLElement, scrollOptions?: any) => {
    try {
      if (lenisRef.current && !hasError) {
        lenisRef.current.scrollTo(target, scrollOptions);
      } else {
        // Fallback to native scrolling if Lenis is not available or has error
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: 'smooth', ...scrollOptions });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth', ...scrollOptions });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth', ...scrollOptions });
        }
      }
    } catch (error) {
      console.error('Error during scrollTo:', error);
      // Fallback to basic scroll without smooth behavior
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        element?.scrollIntoView();
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView();
      }
    }
  };

  const contextValue: SmoothScrollContextType = {
    lenis: lenisRef.current,
    scrollTo,
    isInitialized,
    hasError
  };

  return (
    <AnimationErrorBoundary
      onError={(error) => {
        console.error('SmoothScrollProvider error boundary triggered:', error);
        setHasError(true);
      }}
    >
      <SmoothScrollContext.Provider value={contextValue}>
        {children}
      </SmoothScrollContext.Provider>
    </AnimationErrorBoundary>
  );
};

// Custom hook to use the smooth scroll context
export const useSmoothScroll = (): SmoothScrollContextType => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};

// Router integration component that must be used inside BrowserRouter
export const SmoothScrollRouterSync: React.FC = () => {
  const { lenis } = useSmoothScroll();
  
  useEffect(() => {
    const handleRouteChange = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    };

    // Listen for browser navigation (back/forward buttons)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [lenis]);

  return null; // This component doesn't render anything
};

export default SmoothScrollProvider;