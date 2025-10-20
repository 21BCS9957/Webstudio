import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const handleCalendly = () => {
    window.open("https://calendly.com/satyam21092001/30min", "_blank");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-0 overflow-hidden">
      {/* Dynamic animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Subtle moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" 
             style={{ animationDuration: '8s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              High-Performance
              <br />
              <span className="text-gradient">Websites by CodXBros</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Design → Development → Optimization for startups & SMBs. We build
              websites that don't just look good—they drive results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                onClick={handleCalendly}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold hover:scale-105 w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                Book Free Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleCalendly}
                className="border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold hover:scale-105 w-full sm:w-auto"
              >
                <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                Get Started
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 opacity-60">
              <p className="text-xs sm:text-sm font-medium">Trusted by:</p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="w-18 sm:w-20 md:w-24 h-7 sm:h-8 bg-muted rounded flex items-center justify-center text-xs font-semibold">
                  TechFlow
                </div>
                <div className="w-18 sm:w-20 md:w-24 h-7 sm:h-8 bg-muted rounded flex items-center justify-center text-xs font-semibold">
                  StartupX
                </div>
                <div className="w-18 sm:w-20 md:w-24 h-7 sm:h-8 bg-muted rounded flex items-center justify-center text-xs font-semibold">
                  InnovateCo
                </div>
              </div>
            </div>
          </div>

          <div className="animate-scale-in hidden lg:block">
            <img
              src={heroImage}
              alt="Modern web development workspace"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
