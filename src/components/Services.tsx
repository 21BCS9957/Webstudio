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

    // Initially hide all cards completely
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.set(card, {
          opacity: 0,
          visibility: 'hidden',
          x: 0,
          y: 0,
          scale: 0.5,
          rotation: 0,
          zIndex: 100
        });
      }
    });

    if (!shouldAnimate) {
      // Reduced motion: just show cards in grid
      gsap.set(headlineRef.current, { opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const isMobile = window.innerWidth < 640;
          
          let finalX: number, finalY: number;
          
          if (isMobile) {
            const col = index % 2;
            const row = Math.floor(index / 2);
            finalX = (col - 0.5) * 200;
            finalY = -100 + (row * 160);
          } else {
            const col = index % 3;
            const row = Math.floor(index / 3);
            finalX = (col - 1) * 300;
            finalY = -80 + (row * 200);
          }
          
          gsap.set(card, {
            opacity: 1,
            visibility: 'visible',
            x: finalX,
            y: finalY,
            scale: 1,
            rotation: 0,
            zIndex: 100
          });
        }
      });
      return cleanup;
    }

    // Set initial states
    gsap.set(headlineRef.current, {
      scale: 1,
      opacity: 1,
      transformOrigin: 'center center'
    });

    gsap.set(overlayRef.current, {
      opacity: 1
    });

    // Create simple timeline
    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '200% top',
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Phase 1: Tunnel effect (0% - 50%)
    mainTL.to(headlineRef.current, {
      scale: 10,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(headlineRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.2)
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.4);

    // Phase 2: Show cards ONLY after text is gone (50% - 100%)
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const isMobile = window.innerWidth < 640;
      
      let finalX: number, finalY: number;
      
      if (isMobile) {
        const col = index % 2;
        const row = Math.floor(index / 2);
        finalX = (col - 0.5) * 200;
        finalY = -100 + (row * 160);
      } else {
        const col = index % 3;
        const row = Math.floor(index / 3);
        finalX = (col - 1) * 300;
        finalY = -80 + (row * 200);
      }

      // Cards appear AFTER text disappears (at 0.8s in timeline)
      mainTL.to(card, {
        x: finalX,
        y: finalY,
        opacity: 1,
        visibility: 'visible',
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, 0.8 + (index * 0.1));
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
      <div className="relative z-40 w-full max-w-6xl mx-auto px-6">
        <h1 
          ref={headlineRef}
          className="services-headline text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold text-center leading-tight will-change-transform px-4"
          style={{
            WebkitTextStroke: '2px currentColor',
            WebkitTextFillColor: 'transparent',
            color: 'hsl(var(--foreground))'
          }}
        >
          Services by
          <br />
          <span 
            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: '2px transparent'
            }}
          >
            CodXBros
          </span>
        </h1>
      </div>

      {/* Tunnel mask overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-background z-35 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 25%, black 50%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 25%, black 50%)'
        }}
      />

      {/* Service Cards - Simplified */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="relative w-full">
          {services.map((service, index) => (
            <Card
              key={index}
              ref={(el) => addCardRef(el, index)}
              className="service-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-56 md:w-64 lg:w-72 h-64 sm:h-72 md:h-80 lg:h-88 bg-white dark:bg-gray-800 border-2 border-primary/50 shadow-2xl rounded-lg flex flex-col"
            >
              <CardHeader className="text-center pb-2 sm:pb-3 md:pb-4 flex-shrink-0 px-2 sm:px-3 md:px-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 mx-auto shadow-lg">
                  <service.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
                </div>
                <CardTitle className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold mb-2 md:mb-3 text-foreground leading-tight">{service.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-start px-2 sm:px-3 md:px-6">
                <ul className="space-y-1 sm:space-y-2 md:space-y-3">
                  {service.outcomes.slice(0, 3).map((outcome, i) => (
                    <li key={i} className="flex items-start text-xs sm:text-sm md:text-base">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-primary to-accent mr-2 sm:mr-3 flex-shrink-0 mt-1" />
                      <span className="text-foreground/80 leading-relaxed">{outcome}</span>
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
