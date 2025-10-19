import React, { Component, ErrorInfo, ReactNode } from 'react';

interface AnimationErrorBoundaryState {
  hasError: boolean;
  errorType: 'lenis' | 'animation' | 'performance' | 'unknown';
  errorMessage?: string;
}

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class AnimationErrorBoundary extends Component<
  AnimationErrorBoundaryProps,
  AnimationErrorBoundaryState
> {
  constructor(props: AnimationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorType: 'unknown'
    };
  }

  static getDerivedStateFromError(error: Error): AnimationErrorBoundaryState {
    // Determine error type based on error message or stack
    let errorType: AnimationErrorBoundaryState['errorType'] = 'unknown';
    
    if (error.message.toLowerCase().includes('lenis')) {
      errorType = 'lenis';
    } else if (error.message.toLowerCase().includes('animation') || 
               error.message.toLowerCase().includes('framer')) {
      errorType = 'animation';
    } else if (error.message.toLowerCase().includes('performance') ||
               error.message.toLowerCase().includes('fps')) {
      errorType = 'performance';
    }

    return {
      hasError: true,
      errorType,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('Animation Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo);
    }
  }

  private getErrorMessage(): string {
    const { errorType, errorMessage } = this.state;
    
    switch (errorType) {
      case 'lenis':
        return 'Smooth scrolling is temporarily unavailable. The page will use standard scrolling.';
      case 'animation':
        return 'Some animations are temporarily disabled. All functionality remains available.';
      case 'performance':
        return 'Animations have been reduced to improve performance.';
      default:
        return 'Some visual enhancements are temporarily unavailable.';
    }
  }

  private getFallbackContent(): ReactNode {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default fallback UI
    return (
      <div 
        role="alert" 
        style={{
          padding: '1rem',
          margin: '1rem 0',
          backgroundColor: '#fef3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '0.375rem',
          color: '#856404'
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
          Notice
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          {this.getErrorMessage()}
        </p>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // For animation errors, we typically want to render children without animations
      // rather than showing an error message, unless it's a critical error
      if (this.state.errorType === 'animation' || this.state.errorType === 'performance') {
        // Try to render children in a degraded state
        try {
          return (
            <div data-animation-disabled="true">
              {this.props.children}
            </div>
          );
        } catch {
          // If children still fail, show fallback
          return this.getFallbackContent();
        }
      }
      
      // For Lenis or unknown errors, show fallback
      return this.getFallbackContent();
    }

    return this.props.children;
  }
}

export default AnimationErrorBoundary;

// Higher-order component for wrapping components with error boundary
export function withAnimationErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundary = (props: P) => (
    <AnimationErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </AnimationErrorBoundary>
  );

  WithErrorBoundary.displayName = `withAnimationErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithErrorBoundary;
}

// Hook for handling animation errors in functional components
export function useAnimationErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Animation error${context ? ` in ${context}` : ''}:`, error);
    
    // In production, you might want to report this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, { context });
    }
  }, []);

  return handleError;
}