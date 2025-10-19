import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '@/components/scroll/SmoothScrollProvider';

gsap.registerPlugin(ScrollTrigger);

export function useLenisGSAP() {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!lenis) return;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Update ScrollTrigger when Lenis scrolls
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Refresh ScrollTrigger when Lenis is ready
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, [lenis]);

  return { lenis };
}