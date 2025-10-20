import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactStub: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          Ready to Build Something Amazing?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          Let's discuss your project and see how we can help you achieve your goals.
        </p>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-sm sm:max-w-none"
            onClick={() => window.open('https://calendly.com/satyam21092001/30min', '_blank')}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="sm:hidden">Free Consultation</span>
            <span className="hidden sm:inline">Schedule Free Consultation</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactStub;