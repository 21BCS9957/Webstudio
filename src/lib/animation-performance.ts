// Performance monitoring and optimization utilities for animations

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isPerformant: boolean;
  memoryUsage?: number;
  animationCount?: number;
  timestamp: number;
}

interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  hardwareConcurrency: number;
  deviceMemory: number;
  supportsHardwareAcceleration: boolean;
  connectionType?: string;
}

interface AnimationCleanup {
  cleanup: () => void;
  id: string;
}

class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private isMonitoring = false;
  private animationFrame?: number;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  private cleanupTasks: Map<string, () => void> = new Map();
  private activeAnimations = new Set<string>();
  private performanceHistory: PerformanceMetrics[] = [];
  private maxHistorySize = 100;
  private deviceCapabilities?: DeviceCapabilities;

  // Start monitoring frame rate
  startMonitoring(callback?: (metrics: PerformanceMetrics) => void) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    if (callback) this.callbacks.push(callback);
    
    const monitor = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        const metrics: PerformanceMetrics = {
          fps: this.fps,
          frameTime: 1000 / this.fps,
          isPerformant: this.fps >= 55, // Consider 55+ fps as performant
          memoryUsage: this.getMemoryUsage(),
          animationCount: this.activeAnimations.size,
          timestamp: currentTime
        };
        
        // Store performance history
        this.performanceHistory.push(metrics);
        if (this.performanceHistory.length > this.maxHistorySize) {
          this.performanceHistory.shift();
        }
        
        this.callbacks.forEach(cb => cb(metrics));
      }
      
      if (this.isMonitoring) {
        this.animationFrame = requestAnimationFrame(monitor);
      }
    };
    
    this.animationFrame = requestAnimationFrame(monitor);
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.callbacks = [];
  }

  // Get current FPS
  getCurrentFPS(): number {
    return this.fps;
  }

  // Check if performance is acceptable
  isPerformant(): boolean {
    return this.fps >= 55;
  }

  // Get memory usage if available
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return undefined;
  }

  // Register cleanup task
  registerCleanup(id: string, cleanup: () => void) {
    this.cleanupTasks.set(id, cleanup);
  }

  // Execute cleanup task
  executeCleanup(id: string) {
    const cleanup = this.cleanupTasks.get(id);
    if (cleanup) {
      cleanup();
      this.cleanupTasks.delete(id);
    }
  }

  // Execute all cleanup tasks
  executeAllCleanups() {
    this.cleanupTasks.forEach(cleanup => cleanup());
    this.cleanupTasks.clear();
  }

  // Track active animations
  registerAnimation(id: string) {
    this.activeAnimations.add(id);
  }

  unregisterAnimation(id: string) {
    this.activeAnimations.delete(id);
  }

  // Get performance statistics
  getPerformanceStats() {
    if (this.performanceHistory.length === 0) {
      return null;
    }

    const recent = this.performanceHistory.slice(-10);
    const avgFps = recent.reduce((sum, m) => sum + m.fps, 0) / recent.length;
    const minFps = Math.min(...recent.map(m => m.fps));
    const maxFps = Math.max(...recent.map(m => m.fps));
    
    return {
      averageFps: Math.round(avgFps),
      minFps,
      maxFps,
      isStable: maxFps - minFps < 10,
      activeAnimations: this.activeAnimations.size,
      memoryTrend: this.getMemoryTrend()
    };
  }

  // Analyze memory usage trend
  private getMemoryTrend(): 'stable' | 'increasing' | 'decreasing' | 'unknown' {
    const recentMemory = this.performanceHistory
      .slice(-20)
      .map(m => m.memoryUsage)
      .filter(m => m !== undefined) as number[];
    
    if (recentMemory.length < 5) return 'unknown';
    
    const first = recentMemory.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const last = recentMemory.slice(-5).reduce((a, b) => a + b, 0) / 5;
    
    const diff = last - first;
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  }

  // Get device capabilities
  getDeviceCapabilities(): DeviceCapabilities {
    if (this.deviceCapabilities) {
      return this.deviceCapabilities;
    }

    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = (navigator as any).deviceMemory || 1;
    const connection = (navigator as any).connection;
    
    let tier: DeviceCapabilities['tier'] = 'low';
    if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
      tier = 'high';
    } else if (hardwareConcurrency >= 4 && deviceMemory >= 4) {
      tier = 'medium';
    }

    this.deviceCapabilities = {
      tier,
      hardwareConcurrency,
      deviceMemory,
      supportsHardwareAcceleration: this.checkHardwareAcceleration(),
      connectionType: connection?.effectiveType
    };

    return this.deviceCapabilities;
  }

  // Check hardware acceleration support
  private checkHardwareAcceleration(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  // Adaptive performance optimization
  getOptimizedSettings() {
    const capabilities = this.getDeviceCapabilities();
    const stats = this.getPerformanceStats();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return {
        enableAnimations: false,
        maxConcurrentAnimations: 0,
        animationDuration: 0.1,
        staggerDelay: 0,
        enableComplexEffects: false
      };
    }

    // Base settings on device tier
    let settings = {
      enableAnimations: true,
      maxConcurrentAnimations: 10,
      animationDuration: 0.8,
      staggerDelay: 0.2,
      enableComplexEffects: true
    };

    // Adjust based on device capabilities
    switch (capabilities.tier) {
      case 'low':
        settings = {
          ...settings,
          maxConcurrentAnimations: 3,
          animationDuration: 0.4,
          staggerDelay: 0.1,
          enableComplexEffects: false
        };
        break;
      case 'medium':
        settings = {
          ...settings,
          maxConcurrentAnimations: 6,
          animationDuration: 0.6,
          staggerDelay: 0.15,
          enableComplexEffects: true
        };
        break;
    }

    // Further adjust based on current performance
    if (stats && !stats.isStable) {
      settings.maxConcurrentAnimations = Math.max(1, Math.floor(settings.maxConcurrentAnimations * 0.7));
      settings.enableComplexEffects = false;
    }

    if (stats && stats.averageFps < 45) {
      settings.animationDuration *= 0.7;
      settings.staggerDelay *= 0.7;
      settings.enableComplexEffects = false;
    }

    return settings;
  }

  // Performance warning system
  checkPerformanceWarnings(): string[] {
    const warnings: string[] = [];
    const stats = this.getPerformanceStats();
    const capabilities = this.getDeviceCapabilities();

    if (stats) {
      if (stats.averageFps < 30) {
        warnings.push('Low frame rate detected. Consider reducing animation complexity.');
      }
      
      if (!stats.isStable) {
        warnings.push('Unstable frame rate. Performance may be inconsistent.');
      }
      
      if (stats.activeAnimations > 10) {
        warnings.push('High number of concurrent animations may impact performance.');
      }
      
      if (stats.memoryTrend === 'increasing') {
        warnings.push('Memory usage is increasing. Check for animation cleanup issues.');
      }
    }

    if (!capabilities.supportsHardwareAcceleration) {
      warnings.push('Hardware acceleration not available. Animations may be slower.');
    }

    if (capabilities.connectionType === 'slow-2g' || capabilities.connectionType === '2g') {
      warnings.push('Slow network connection detected. Consider reducing animation assets.');
    }

    return warnings;
  }
}

// Global performance monitor instance
export const performanceMonitor = new AnimationPerformanceMonitor();

// Hardware acceleration optimization utilities
export const optimizeForHardwareAcceleration = {
  // Apply will-change property for better performance
  applyWillChange: (element: HTMLElement, properties: string[]) => {
    element.style.willChange = properties.join(', ');
    
    // Return cleanup function
    return () => {
      element.style.willChange = 'auto';
    };
  },

  // Force hardware acceleration with transform3d
  forceHardwareAcceleration: (element: HTMLElement) => {
    element.style.transform = element.style.transform + ' translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    
    return () => {
      element.style.transform = element.style.transform.replace(' translateZ(0)', '');
      element.style.backfaceVisibility = '';
      element.style.perspective = '';
    };
  },

  // Optimize for transform and opacity animations only
  optimizeForTransformOpacity: (element: HTMLElement) => {
    const cleanup1 = optimizeForHardwareAcceleration.applyWillChange(element, ['transform', 'opacity']);
    const cleanup2 = optimizeForHardwareAcceleration.forceHardwareAcceleration(element);
    
    return () => {
      cleanup1();
      cleanup2();
    };
  }
};

// Animation cleanup helpers
export const animationCleanup = {
  // Create a cleanup manager for multiple animations
  createCleanupManager: () => {
    const cleanups: (() => void)[] = [];
    
    return {
      add: (cleanup: () => void) => {
        cleanups.push(cleanup);
      },
      
      execute: () => {
        cleanups.forEach(cleanup => cleanup());
        cleanups.length = 0;
      },
      
      count: () => cleanups.length
    };
  },

  // Debounce function for scroll events
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for high-frequency events
  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Batch DOM operations
  batchDOMOperations: (operations: (() => void)[]) => {
    requestAnimationFrame(() => {
      operations.forEach(operation => operation());
    });
  }
};

// Performance optimization hooks and utilities
export const performanceUtils = {
  // Check if device supports hardware acceleration
  supportsHardwareAcceleration: (): boolean => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  },

  // Detect device performance tier
  getDevicePerformanceTier: (): 'low' | 'medium' | 'high' => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 1;
    
    if (hardwareConcurrency >= 8 && memory >= 8) return 'high';
    if (hardwareConcurrency >= 4 && memory >= 4) return 'medium';
    return 'low';
  },

  // Get optimal animation settings based on device
  getOptimalAnimationSettings: () => {
    const tier = performanceUtils.getDevicePerformanceTier();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return {
        duration: 0.2,
        stagger: 0.05,
        enableComplexAnimations: false,
        enableParallax: false
      };
    }
    
    switch (tier) {
      case 'high':
        return {
          duration: 0.8,
          stagger: 0.2,
          enableComplexAnimations: true,
          enableParallax: true
        };
      case 'medium':
        return {
          duration: 0.6,
          stagger: 0.15,
          enableComplexAnimations: true,
          enableParallax: false
        };
      case 'low':
        return {
          duration: 0.4,
          stagger: 0.1,
          enableComplexAnimations: false,
          enableParallax: false
        };
    }
  },

  // Memory cleanup for animations
  cleanupAnimationMemory: () => {
    // Force garbage collection if available (development only)
    if (typeof window !== 'undefined' && 'gc' in window && process.env.NODE_ENV === 'development') {
      (window as any).gc();
    }
    
    // Execute all registered cleanups
    performanceMonitor.executeAllCleanups();
  }
};

// Export performance monitoring utilities
export type { PerformanceMetrics, AnimationCleanup };

// Auto-start performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring((metrics) => {
    if (!metrics.isPerformant) {
      console.warn(`Animation performance warning: ${metrics.fps} FPS (target: 60 FPS)`);
    }
  });
}