import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Founder, TechStart India",
    company: "TechStart",
    quote:
      "Web Studio transformed our online presence. The site they built not only looks stunning but has increased our lead conversion by 42%.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "CEO, Urban Fashion",
    company: "Urban Fashion",
    quote:
      "Outstanding work! They delivered a high-performance eCommerce site that handles our growing traffic with ease. Worth every rupee.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Marketing Director, GreenLife",
    company: "GreenLife Wellness",
    quote:
      "Professional, responsive, and incredibly talented. Our new website has become our best salesperson, generating bookings 24/7.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Product Manager, FinTrack",
    company: "FinTrack",
    quote:
      "They built our complex SaaS dashboard from scratch. The attention to detail and performance optimization is exceptional.",
    rating: 5,
  },
  {
    name: "Lisa Chen",
    role: "Owner, Gourmet Bites",
    company: "Gourmet Bites",
    quote:
      "Our revenue tripled after launching the new platform. The team understood our vision and delivered beyond expectations.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-gradient">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it—hear from businesses we've helped grow.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-12">
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-accent text-accent"
                  />
                ))}
              </div>

              <blockquote className="text-2xl font-medium text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              <div className="text-center">
                <div className="font-bold text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].role}
                </div>
                <div className="text-sm text-primary mt-1">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
