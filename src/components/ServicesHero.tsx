import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAnimationPerformance } from '@/hooks/use-animation-performance';
import { useLenisGSAP } from '@/hooks/use-lenis-gsap';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ServicesHeroProps {
  onTunnelComplete?: () => void;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ onTunnelComplete }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, shouldAnimate } = useReducedMotion();
  const { registerAnimation } = useAnimationPerformance();
  
  // Initialize Lenis-GSAP integration
  useLenisGSAP();

  useEffect(() => {
    if (!heroRef.current || !headlineRef.current || !overlayRef.current) return;

    const cleanup = registerAnimation('services-tunnel');

    if (!shouldAnimate) {
      // Reduced motion: simple fade transition
      const tl = gsap.timeline();
      
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        animation: tl,
        onLeave: () => onTunnelComplete?.()
      });

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });

      return () => {
        cleanup();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    // Full animation: tunnel effect
    const tl = gsap.timeline();
    
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '150% top',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      animation: tl,
      onLeave: () => onTunnelComplete?.()
    });

    // Animate the headline scaling (tunnel effect)
    tl.to(headlineRef.current, {
      scale: 12,
      duration: 1,
      ease: 'power2.inOut',
      transformOrigin: 'center center'
    })
    // Fade out the overlay to reveal content behind
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.7);

    // Add subtle background parallax
    const backgroundElements = heroRef.current.querySelectorAll('.parallax-bg');
    backgroundElements.forEach((element, index) => {
      tl.to(element, {
        y: -100 * (index + 1),
        duration: 1,
        ease: 'none'
      }, 0);
    });

    return () => {
      cleanup();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [shouldAnimate, onTunnelComplete, registerAnimation]);

  return (
    <div 
      ref={heroRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background elements for parallax */}
      <div className="absolute inset-0 parallax-bg opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>
      
      {/* Main headline */}
      <h1 
        ref={headlineRef}
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-center leading-none text-outline gpu-accelerated"
      >
        Services that
        <br />
        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
         WebStudio
        </span>
      </h1>

      {/* Overlay that gets masked by the text */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-background z-10 pointer-events-none tunnel-mask"
      />


    </div>
  );
};

export default ServicesHero;