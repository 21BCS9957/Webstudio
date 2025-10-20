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
      // Reduced motion: mobile-friendly layout
      gsap.set(headlineRef.current, { opacity: 0 }); // Hide text
      gsap.set(overlayRef.current, { opacity: 0 });
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const totalCards = services.length;
          const centerIndex = (totalCards - 1) / 2;
          const isMobile = window.innerWidth < 640;
          const isTablet = window.innerWidth < 1024;
          
          if (isMobile) {
            // Mobile: Stack cards vertically in a compact grid
            const cardsPerRow = 2;
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const cardWidth = 144; // Card width (w-36 = 144px)
            const cardSpacing = 16; // Gap between cards
            const totalRowWidth = (cardsPerRow * cardWidth) + ((cardsPerRow - 1) * cardSpacing);
            
            const finalX = -totalRowWidth / 2 + (col * (cardWidth + cardSpacing)) + cardWidth / 2;
            const finalY = -80 + (row * 180); // Tighter vertical spacing
            
            gsap.set(card, {
              opacity: 1,
              x: finalX,
              y: finalY,
              scale: 0.9, // Slightly smaller on mobile
              rotation: 0,
              zIndex: index + 1
            });
          } else {
            // Tablet and desktop: horizontal curved layout
            const cardSpacing = isTablet ? 180 : 220;
            const maxViewportWidth = window.innerWidth * 0.9; // Use 90% of viewport
            const totalWidth = Math.min((totalCards - 1) * cardSpacing, maxViewportWidth);
            const actualSpacing = totalWidth / (totalCards - 1);
            const startX = -totalWidth / 2;
            const finalX = startX + (index * actualSpacing);
            
            // Gentle curve: outer cards slightly higher for visibility
            const distanceFromCenter = Math.abs(index - centerIndex);
            const curveHeight = distanceFromCenter * 15;
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

    // Phase 2: Mobile-friendly card layout (50% - 100%)
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const totalCards = services.length;
      const centerIndex = (totalCards - 1) / 2;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      
      let finalX, finalY, finalScale;
      
      if (isMobile) {
        // Mobile: Compact grid layout
        const cardsPerRow = 2;
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        const cardWidth = 144; // w-36 = 144px
        const cardSpacing = 16;
        const totalRowWidth = (cardsPerRow * cardWidth) + ((cardsPerRow - 1) * cardSpacing);
        
        finalX = -totalRowWidth / 2 + (col * (cardWidth + cardSpacing)) + cardWidth / 2;
        finalY = -80 + (row * 180); // Tighter vertical spacing
        finalScale = 1; // Keep normal scale on mobile
      } else {
        // Tablet and desktop: horizontal curved layout with viewport constraints
        const maxViewportWidth = window.innerWidth * 0.85; // Use 85% of viewport
        const idealSpacing = isTablet ? 180 : 220;
        const totalIdealWidth = (totalCards - 1) * idealSpacing;
        
        // Adjust spacing if it would exceed viewport
        const actualSpacing = totalIdealWidth > maxViewportWidth 
          ? maxViewportWidth / (totalCards - 1) 
          : idealSpacing;
        
        const totalWidth = (totalCards - 1) * actualSpacing;
        const startX = -totalWidth / 2;
        finalX = startX + (index * actualSpacing);
        
        // Gentle curve for better visibility
        const distanceFromCenter = Math.abs(index - centerIndex);
        const curveHeight = distanceFromCenter * 15;
        finalY = -curveHeight;
        finalScale = 1;
      }
      
      // Stagger timing for smooth appearance
      const cardStartTime = 0.5 + (index * 0.08);
      const cardDuration = 0.2;

      mainTL.to(card, {
        x: finalX,
        y: finalY,
        opacity: 1,
        rotation: 0,
        scale: finalScale,
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold text-center leading-tight will-change-transform px-4"
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
            CodXBros
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

      {/* Enhanced curved cards layout - mobile responsive */}
      <div className="absolute inset-0 flex items-center justify-center z-5 px-4 sm:px-6">
        <div className="relative w-full max-w-[100vw] overflow-hidden">
          {services.map((service, index) => (
            <Card
              key={index}
              ref={(el) => addCardRef(el, index)}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 md:w-52 h-56 sm:h-64 md:h-80 bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl hover:shadow-2xl transition-shadow will-change-transform service-card-mobile flex flex-col"
            >
              <CardHeader className="text-center pb-1 sm:pb-2 flex-shrink-0 px-2 sm:px-3 md:px-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-1 sm:mb-2 mx-auto shadow-lg">
                  <service.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-primary" />
                </div>
                <CardTitle className="text-xs sm:text-sm md:text-lg font-bold mb-1 text-foreground leading-tight">{service.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-tight line-clamp-2 hidden sm:block">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-start px-2 sm:px-3 md:px-6">
                <ul className="space-y-0.5 sm:space-y-1">
                  {service.outcomes.slice(0, 3).map((outcome, i) => (
                    <li key={i} className="flex items-start text-xs">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-primary to-accent mr-1.5 sm:mr-2 flex-shrink-0 mt-1" />
                      <span className="text-foreground/80 leading-tight text-xs">{outcome}</span>
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
