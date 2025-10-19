import React, { useState } from 'react';
import { useAnimationPerformance } from '../hooks/use-animation-performance';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showInProduction = false,
  position = 'bottom-right',
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    metrics,
    isPerformant,
    warnings,
    deviceTier,
    getPerformanceStats,
    getCurrentFPS
  } = useAnimationPerformance();

  // Don't show in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  const stats = getPerformanceStats();
  const currentFPS = getCurrentFPS();

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 45) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDeviceTierColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (compact && !isExpanded) {
    return (
      <div 
        className={`fixed ${positionClasses[position]} z-50 cursor-pointer`}
        onClick={() => setIsExpanded(true)}
      >
        <div className={`
          px-2 py-1 rounded text-xs font-mono
          ${isPerformant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
          backdrop-blur-sm border border-current/20
        `}>
          {currentFPS} FPS
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Performance Monitor</h3>
          {compact && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getPerformanceColor(currentFPS)}>
              {currentFPS}
            </span>
          </div>
          
          {stats && (
            <>
              <div className="flex justify-between">
                <span>Avg FPS:</span>
                <span className={getPerformanceColor(stats.averageFps)}>
                  {stats.averageFps}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Min/Max:</span>
                <span className="text-gray-300">
                  {stats.minFps}/{stats.maxFps}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Animations:</span>
                <span className="text-blue-400">
                  {stats.activeAnimations}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Stable:</span>
                <span className={stats.isStable ? 'text-green-400' : 'text-yellow-400'}>
                  {stats.isStable ? 'Yes' : 'No'}
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <span>Device:</span>
            <span className={getDeviceTierColor(deviceTier)}>
              {deviceTier.toUpperCase()}
            </span>
          </div>
          
          {metrics?.memoryUsage && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="text-purple-400">
                {metrics.memoryUsage.toFixed(1)} MB
              </span>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="text-yellow-400 font-semibold mb-1">Warnings:</div>
              {warnings.map((warning, index) => (
                <div key={index} className="text-yellow-300 text-xs">
                  • {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;

// Development-only performance overlay
export const DevPerformanceOverlay: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <PerformanceMonitor compact />;
};