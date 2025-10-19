import { useEffect, useState, useCallback, useRef } from 'react';
import { performanceMonitor, type PerformanceMetrics } from '../lib/animation-performance';

interface UseAnimationPerformanceOptions {
  enableMonitoring?: boolean;
  warningThreshold?: number;
  onPerformanceWarning?: (warnings: string[]) => void;
}

interface AnimationPerformanceState {
  metrics: PerformanceMetrics | null;
  isPerformant: boolean;
  warnings: string[];
  optimizedSettings: any;
  deviceTier: 'low' | 'medium' | 'high';
}

export function useAnimationPerformance(options: UseAnimationPerformanceOptions = {}) {
  const {
    enableMonitoring = true,
    warningThreshold = 45,
    onPerformanceWarning
  } = options;

  const [state, setState] = useState<AnimationPerformanceState>({
    metrics: null,
    isPerformant: true,
    warnings: [],
    optimizedSettings: null,
    deviceTier: 'medium'
  });

  const warningCallbackRef = useRef(onPerformanceWarning);
  warningCallbackRef.current = onPerformanceWarning;

  // Register an animation with the performance monitor
  const registerAnimation = useCallback((id: string) => {
    performanceMonitor.registerAnimation(id);
    
    return () => {
      performanceMonitor.unregisterAnimation(id);
    };
  }, []);

  // Register cleanup task
  const registerCleanup = useCallback((id: string, cleanup: () => void) => {
    performanceMonitor.registerCleanup(id, cleanup);
  }, []);

  // Get current performance statistics
  const getPerformanceStats = useCallback(() => {
    return performanceMonitor.getPerformanceStats();
  }, []);

  // Force performance check
  const checkPerformance = useCallback(() => {
    const warnings = performanceMonitor.checkPerformanceWarnings();
    const optimizedSettings = performanceMonitor.getOptimizedSettings();
    const capabilities = performanceMonitor.getDeviceCapabilities();
    const stats = performanceMonitor.getPerformanceStats();

    setState(prev => ({
      ...prev,
      warnings,
      optimizedSettings,
      deviceTier: capabilities.tier,
      isPerformant: stats ? stats.averageFps >= warningThreshold : true
    }));

    if (warnings.length > 0 && warningCallbackRef.current) {
      warningCallbackRef.current(warnings);
    }

    return { warnings, optimizedSettings, stats };
  }, [warningThreshold]);

  useEffect(() => {
    if (!enableMonitoring) return;

    // Start monitoring
    const handleMetrics = (metrics: PerformanceMetrics) => {
      setState(prev => ({
        ...prev,
        metrics,
        isPerformant: metrics.fps >= warningThreshold
      }));
    };

    performanceMonitor.startMonitoring(handleMetrics);

    // Check performance periodically
    const performanceCheckInterval = setInterval(() => {
      checkPerformance();
    }, 5000); // Check every 5 seconds

    // Initial performance check
    setTimeout(checkPerformance, 1000);

    return () => {
      performanceMonitor.stopMonitoring();
      clearInterval(performanceCheckInterval);
    };
  }, [enableMonitoring, warningThreshold, checkPerformance]);

  return {
    ...state,
    registerAnimation,
    registerCleanup,
    getPerformanceStats,
    checkPerformance,
    // Utility methods
    isLowPerformanceDevice: state.deviceTier === 'low',
    shouldReduceAnimations: !state.isPerformant || state.warnings.length > 2,
    getCurrentFPS: () => performanceMonitor.getCurrentFPS()
  };
}

// Hook for automatic animation optimization
export function useOptimizedAnimation(animationId: string, baseConfig: any = {}) {
  const { 
    optimizedSettings, 
    registerAnimation, 
    isPerformant,
    deviceTier 
  } = useAnimationPerformance();

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current = registerAnimation(animationId);
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [animationId, registerAnimation]);

  // Return optimized animation configuration
  const optimizedConfig = {
    ...baseConfig,
    ...(optimizedSettings || {}),
    // Apply device-specific optimizations
    transition: {
      ...baseConfig.transition,
      duration: optimizedSettings?.animationDuration || baseConfig.transition?.duration || 0.8,
      ease: deviceTier === 'low' ? 'linear' : baseConfig.transition?.ease || 'easeOut'
    }
  };

  return {
    config: optimizedConfig,
    shouldAnimate: isPerformant,
    deviceTier,
    isOptimized: !!optimizedSettings
  };
}

// Hook for performance-aware component rendering
export function usePerformanceAwareRendering() {
  const { isPerformant, deviceTier, shouldReduceAnimations } = useAnimationPerformance();

  const shouldRenderComplexAnimations = isPerformant && deviceTier !== 'low';
  const shouldUseReducedMotion = shouldReduceAnimations;
  const maxConcurrentAnimations = deviceTier === 'low' ? 2 : deviceTier === 'medium' ? 5 : 10;

  return {
    shouldRenderComplexAnimations,
    shouldUseReducedMotion,
    maxConcurrentAnimations,
    renderingTier: deviceTier,
    performanceMode: isPerformant ? 'normal' : 'reduced'
  };
}