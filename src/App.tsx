import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothScrollProvider, SmoothScrollRouterSync } from "@/components/scroll/SmoothScrollProvider";
import { ReducedMotionProvider } from "@/hooks/use-reduced-motion";
import { DevPerformanceOverlay } from "@/components/PerformanceMonitor";
import AnimationErrorBoundary from "@/components/AnimationErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AnimationErrorBoundary>
      <ReducedMotionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SmoothScrollProvider
            options={{
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smooth: true,
              smoothTouch: false, // Better performance on mobile
              touchMultiplier: 2,
              infinite: false
            }}
          >
            <BrowserRouter>
              <SmoothScrollRouterSync />
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <DevPerformanceOverlay />
            </BrowserRouter>
          </SmoothScrollProvider>
        </TooltipProvider>
      </ReducedMotionProvider>
    </AnimationErrorBoundary>
  </QueryClientProvider>
);

export default App;
