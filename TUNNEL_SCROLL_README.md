# Tunnel Scroll Effect Implementation

## Overview

This implementation creates a smooth scroll tunnel effect where users "scroll into" the Services headline text, followed by staggered card animations. The effect is built using GSAP + ScrollTrigger with Lenis smooth scrolling integration.

## Features

### 🎯 Tunnel Effect
- **Text Mask Portal**: The headline text acts as a mask/portal that scales up as users scroll
- **Smooth Scaling**: Text scales from 1x to 12x with smooth easing
- **Background Parallax**: Subtle background elements move during the tunnel sequence
- **Pinned Animation**: Hero section pins during the zoom sequence for ~200% viewport height

### 🎨 Integrated Tunnel + Card Animation
- **Unified Experience**: Cards are part of the tunnel effect, not a separate section
- **Sequential Phases**: Tunnel effect (40%) → Card stacking (60%) in one pinned section
- **Through the Tunnel**: Cards appear to come through the tunnel opening
- **Horizontal Slide + Linear Layout**: Cards slide horizontally from right to left into a clean row formation
- **Staggered Timing**: Cards appear with 0.08s intervals for smooth progression
- **Natural Depth**: Slight rotation (±1.2°) and scaling (1.5% per card) for visual depth
- **Extended Timeline**: 400% scroll distance for the complete sequence
- **Smooth Transitions**: GPU-accelerated transforms for buttery smooth animation

### ♿ Accessibility & Performance
- **Reduced Motion**: Respects `prefers-reduced-motion` with fallback animations
- **Performance Monitoring**: Integrated with animation performance system
- **Error Boundaries**: Graceful fallbacks for animation failures
- **GPU Acceleration**: Hardware-accelerated transforms for smooth performance

## Technical Implementation

### Components

1. **ServicesHero** (`src/components/ServicesHero.tsx`)
   - Full-height hero with tunnel effect
   - GSAP ScrollTrigger integration
   - Reduced motion support
   - Performance monitoring

2. **ServicesGrid** (in `src/components/Services.tsx`)
   - Staggered card animations
   - Scroll-triggered reveals
   - Enhanced hover effects

3. **ContactStub** (`src/components/ContactStub.tsx`)
   - Email and WhatsApp contact options
   - Clean call-to-action section

### Hooks

1. **useLenisGSAP** (`src/hooks/use-lenis-gsap.ts`)
   - Integrates Lenis smooth scrolling with GSAP
   - Syncs ScrollTrigger with Lenis scroll events
   - Optimizes ticker performance

### CSS Utilities

```css
.text-outline - Text stroke effect for tunnel mask
.tunnel-mask - Radial gradient mask for overlay
.gpu-accelerated - Hardware acceleration optimization
```

## Animation Sequence

1. **Initial State**: Hero displays large "Services by Webstudio" text (up to 12rem size)
2. **Scroll Start**: ScrollTrigger pins the hero section for entire sequence
3. **Phase 1 - Tunnel Effect (0%-50%)**: Text scales up 8x and fades out completely, overlay disappears
4. **Phase 2 - Enhanced Curved Card Layout (50%-100%)**: Cards appear through the tunnel opening
   - Cards start hidden off-screen to the right behind the tunnel
   - Each card slides horizontally from right to left into final position
   - Cards arrange in a gentle upward curve for optimal visibility
   - Outer cards positioned slightly higher to prevent edge cutoff
   - Cards appear with staggered timing (0.08s intervals)
   - Optimized spacing (220px apart) for better screen utilization
   - Larger card size (w-52) with enhanced visual design
   - Text is completely invisible, only cards remain visible
5. **Sequence Complete**: Hero section unpins, larger cards arranged in curved formation with all titles fully visible
6. **Normal Scroll**: User can continue scrolling to contact section
7. **Contact Section**: Final CTA section with email/WhatsApp options

## Performance Optimizations

- **GPU Acceleration**: All animations use transform/opacity only
- **Hardware Detection**: Adapts animation complexity based on device capabilities
- **Memory Management**: Proper cleanup of GSAP timelines and ScrollTriggers
- **Reduced Motion**: Complete fallback for accessibility
- **Frame Rate Monitoring**: Real-time performance tracking

## Browser Support

- **Modern Browsers**: Full effect with hardware acceleration
- **Fallback Support**: CSS mask fallbacks for older browsers
- **Mobile Optimized**: Touch-friendly with reduced complexity on low-end devices

## Usage

The tunnel effect is automatically applied to the Services section. No additional configuration needed:

```tsx
import Services from '@/components/Services';

// The component includes the full tunnel effect
<Services />
```

## Customization

### Animation Timing
```tsx
// In ServicesHero.tsx
tl.to(headlineRef.current, {
  scale: 12, // Adjust tunnel depth
  duration: 1, // Adjust animation speed
  ease: 'power2.inOut' // Change easing
});
```

### Card Animation Timing
```tsx
// In Services.tsx
const stackPositionY = index * -30; // Adjust vertical stack height
const rotationAngle = (index - 2.5) * 1.2; // Adjust rotation
const scaleValue = 1 - (index * 0.015); // Adjust depth scaling

mainTL.to(card, {
  x: 0, // Slide from right to center
  y: stackPositionY, // Vertical stacking position
  cardStartTime: 0.4 + (index * 0.08), // Adjust stagger timing
  cardDuration: 0.15 // Adjust individual card animation speed
});
```

### Reduced Motion Behavior
The system automatically detects `prefers-reduced-motion` and provides:
- Instant opacity transitions instead of scaling
- No movement animations
- Simplified card reveals

## Dependencies

- `gsap` - Animation library
- `lenis` - Smooth scrolling (already installed)
- `framer-motion` - Additional animation utilities (already installed)

## Performance Notes

- Animations are GPU-accelerated using `transform` and `opacity` only
- ScrollTrigger is properly synced with Lenis for smooth performance
- Memory cleanup prevents leaks during navigation
- Performance monitoring provides real-time feedback in development

The implementation provides a premium, smooth scrolling experience while maintaining excellent performance and accessibility standards.