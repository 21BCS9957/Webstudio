import React, { useEffect, useRef } from 'react';
import { Globe, ShoppingCart, Layers, Zap, Search, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAnimationPerformance } from '@/hooks/use-animation-performance';
import ContactStub from './ContactStub';
import { useLenisGSAP } from '@/hooks/use-lenis-gsap';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Globe,
    title: "Landing Pages",
    description: "High-converting pages designed to capture leads and drive action.",
    outcomes: ["90+ PageSpeed", "Mobile-first design", "A/B test ready"],
  },
  {
    icon: Layers,
    title: "Business Websites",
    description: "Professional multi-page sites that establish credibility and trust.",
    outcomes: ["Custom CMS", "SEO optimized", "Fast & secure"],
  },
  {
    icon: ShoppingCart,
    title: "eCommerce",
    description: "Full-featured online stores with seamless checkout experiences.",
    outcomes: ["Payment integration", "Inventory management", "Analytics dashboard"],
  },
  {
    icon: Zap,
    title: "Web Applications",
    description: "Complex portals and SaaS platforms built for scale.",
    outcomes: ["Cloud-hosted", "API integration", "User authentication"],
  },
  {
    icon: Search,
    title: "SEO & Performance",
    description: "Technical optimization to rank higher and load faster.",
    outcomes: ["Core Web Vitals", "Schema markup", "Speed optimization"],
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Ongoing updates, monitoring, and technical support.",
    outcomes: ["24/7 monitoring", "Security updates", "Priority support"],
  },
];

const ServicesHeroWithCards: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const { shouldAnimate } = useReducedMotion();
  const { registerAnimation } = useAnimationPerformance();
  
  // Initialize Lenis-GSAP integration
  useLenisGSAP();

  useEffect(() => {
    if (!heroRef.current || !headlineRef.current || !overlayRef.current) return;

    const cleanup = registerAnimation('services-tunnel-with-cards');

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    if (!shouldAnimate) {
      // Reduced motion: simple horizontal layout with text hidden and cards visible
      gsap.set(headlineRef.current, { opacity: 0 }); // Hide text
      gsap.set(overlayRef.current, { opacity: 0 });
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // Creative curved layout: cards in a gentle arc for better visibility
          const totalCards = services.length;
          const centerIndex = (totalCards - 1) / 2;
          
          // Horizontal positioning with tighter spacing
          const cardSpacing = 220; // Reduced spacing for better fit
          const totalWidth = (totalCards - 1) * cardSpacing;
          const startX = -totalWidth / 2;
          const finalX = startX + (index * cardSpacing);
          
          // Gentle curve: outer cards slightly higher for visibility
          const distanceFromCenter = Math.abs(index - centerIndex);
          const curveHeight = distanceFromCenter * 15; // Subtle curve
          const finalY = -curveHeight;
          
          gsap.set(card, {
            opacity: 1,
            x: finalX,
            y: finalY,
            scale: 1,
            rotation: 0,
            zIndex: index + 1
          });
        }
      });
      return cleanup;
    }

    // Set initial states with better performance
    gsap.set(headlineRef.current, {
      scale: 1,
      opacity: 1, // Start fully visible
      transformOrigin: 'center center',
      force3D: true
    });

    gsap.set(overlayRef.current, {
      opacity: 1,
      force3D: true
    });

    // Initially hide all cards - start from right side
    cardsRef.current.forEach((card, index) => {
      if (card) {
        // All cards start from the right side of screen
        const startX = window.innerWidth + 100 + (index * 50); // Stagger start positions from right
        
        gsap.set(card, {
          x: startX, // Start from right side
          y: 0, // All at same vertical level
          scale: 1,
          rotation: 0,
          opacity: 0,
          zIndex: index + 1,
          force3D: true
        });
      }
    });

    // Optimized timeline with shorter duration
    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '200% top', // Reduced from 400% for better performance
        scrub: 0.5, // Reduced scrub for smoother animation
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Phase 1: Tunnel effect (0% - 50%)
    mainTL.to(headlineRef.current, {
      scale: 8, // Zoom in
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(headlineRef.current, {
      opacity: 0, // Fade out text during zoom
      duration: 0.4,
      ease: 'power2.out'
    }, 0.1) // Start fading slightly after zoom begins
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.3);

    // Phase 2: Creative curved card layout (50% - 100%)
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Calculate final positions: cards in a gentle arc for better visibility
      const totalCards = services.length;
      const centerIndex = (totalCards - 1) / 2;
      
      // Horizontal positioning with optimized spacing
      const cardSpacing = 220; // Tighter spacing for better screen fit
      const totalWidth = (totalCards - 1) * cardSpacing;
      const startX = -totalWidth / 2;
      const finalX = startX + (index * cardSpacing);
      
      // Gentle curve: outer cards slightly higher for better visibility
      const distanceFromCenter = Math.abs(index - centerIndex);
      const curveHeight = distanceFromCenter * 15; // Subtle upward curve
      const finalY = -curveHeight;
      
      // First card appears on far left, last card on far right
      const cardStartTime = 0.5 + (index * 0.08); // Stagger timing
      const cardDuration = 0.2; // Animation duration for each card

      mainTL.to(card, {
        x: finalX, // Final horizontal position (left to right)
        y: finalY, // Curved positioning for better visibility
        opacity: 1,
        rotation: 0, // No rotation for clean layout
        scale: 1, // All cards same size
        duration: cardDuration,
        ease: 'power2.out'
      }, cardStartTime);
    });

    return () => {
      cleanup();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [shouldAnimate, registerAnimation]);

  const addCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      cardsRef.current[index] = el;
    }
  };

  return (
    <div 
      ref={heroRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      
      {/* Larger headline */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6">
        <h1 
          ref={headlineRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-center leading-tight will-change-transform"
          style={{
            WebkitTextStroke: '3px currentColor',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          Services by
          <br />
          <span 
            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: '3px transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Webstudio
          </span>
        </h1>
      </div>

      {/* Simplified overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-background z-10 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 15%, black 35%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 15%, black 35%)'
        }}
      />

      {/* Enhanced curved cards layout */}
      <div className="absolute inset-0 flex items-center justify-center z-5 px-4">
        <div className="relative w-full max-w-[90vw]">
          {services.map((service, index) => (
            <Card
              key={index}
              ref={(el) => addCardRef(el, index)}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-80 bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl hover:shadow-2xl transition-shadow will-change-transform flex flex-col"
            >
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold mb-2 text-foreground leading-tight">{service.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-start">
                <ul className="space-y-1.5">
                  {service.outcomes.slice(0, 3).map((outcome, i) => (
                    <li key={i} className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent mr-2 flex-shrink-0" />
                      <span className="text-foreground/80 leading-tight">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <div id="services" className="relative">
      {/* Combined Tunnel Effect + Card Stacking */}
      <ServicesHeroWithCards />
      
      {/* Normal Content Continues */}
      <div className="relative z-10 bg-background pt-8">
        <ContactStub />
      </div>
    </div>
  );
};

export default Services;
