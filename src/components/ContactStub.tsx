import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactStub: React.FC = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Ready to Build Something Amazing?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Let's discuss your project and see how we can help you achieve your goals.
        </p>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => window.open('https://calendly.com/satyam21092001/30min', '_blank')}
          >
            <Calendar className="w-6 h-6" />
            Schedule Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactStub;