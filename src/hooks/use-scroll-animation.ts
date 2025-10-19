import { useEffect, useRef, useState, RefObject } from 'react';
import { useAnimationControls } from 'framer-motion';
import { useReducedMotion } from './use-reduced-motion';

interface ScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  ease?: string;
  rootMargin?: string;
}

interface ScrollAnimationReturn {
  ref: RefObject<HTMLElement>;
  isInView: boolean;
  controls: ReturnType<typeof useAnimationControls>;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    rootMargin = '0px'
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const controls = useAnimationControls();

  // Use the reduced motion hook
  const { prefersReducedMotion, shouldAnimate } = useReducedMotion();



  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView && (!triggerOnce || !hasAnimated)) {
          setIsInView(true);
          
          if (shouldAnimate) {
            // Trigger animation with delay if animations are enabled
            const animationDelay = prefersReducedMotion ? 0 : delay;
            
            setTimeout(() => {
              controls.start('visible');
              if (triggerOnce) {
                setHasAnimated(true);
              }
            }, animationDelay);
          } else {
            // For reduced motion, immediately show the element without animation
            controls.set('visible');
            if (triggerOnce) {
              setHasAnimated(true);
            }
          }
        } else if (!inView && !triggerOnce) {
          setIsInView(false);
          if (shouldAnimate) {
            controls.start('hidden');
          } else {
            controls.set('hidden');
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [controls, threshold, triggerOnce, delay, hasAnimated, rootMargin]);

  // Initialize with hidden state
  useEffect(() => {
    if (shouldAnimate) {
      controls.start('hidden');
    } else {
      // For reduced motion, start in visible state or no animation
      controls.set('visible');
    }
  }, [controls, shouldAnimate]);

  return {
    ref,
    isInView,
    controls
  };
}