import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const plans = {
  onetime: [
    {
      name: "Starter",
      price: "₹35,000",
      usd: "$420",
      description: "Perfect for small businesses and personal brands",
      features: [
        "5-page responsive website",
        "Mobile-first design",
        "Basic SEO setup",
        "Contact form integration",
        "2 rounds of revisions",
        "30-day support",
      ],
    },
    {
      name: "Growth",
      price: "₹75,000",
      usd: "$900",
      description: "For businesses ready to scale online",
      features: [
        "10-page custom website",
        "Advanced animations",
        "Full SEO optimization",
        "CMS integration",
        "Analytics dashboard",
        "4 rounds of revisions",
        "90-day priority support",
        "Performance optimization",
      ],
      popular: true,
    },
    {
      name: "Scale",
      price: "₹1,50,000",
      usd: "$1,800",
      description: "Enterprise-grade solutions",
      features: [
        "Unlimited pages",
        "Custom functionality",
        "API integrations",
        "User authentication",
        "Advanced analytics",
        "Unlimited revisions",
        "1-year support",
        "Dedicated project manager",
        "Quarterly performance audits",
      ],
    },
  ],
  monthly: [
    {
      name: "Starter",
      price: "₹8,000/mo",
      usd: "$95/mo",
      description: "Ongoing maintenance and updates",
      features: [
        "Monthly content updates",
        "Security monitoring",
        "Plugin updates",
        "Basic analytics reports",
        "Email support",
      ],
    },
    {
      name: "Growth",
      price: "₹18,000/mo",
      usd: "$215/mo",
      description: "Full-service maintenance & optimization",
      features: [
        "Everything in Starter",
        "Weekly backups",
        "Performance optimization",
        "A/B testing support",
        "Priority support",
        "2 hours dev time/month",
      ],
      popular: true,
    },
    {
      name: "Scale",
      price: "₹35,000/mo",
      usd: "$420/mo",
      description: "White-glove service for high-traffic sites",
      features: [
        "Everything in Growth",
        "24/7 monitoring",
        "CDN management",
        "Advanced security",
        "Dedicated support",
        "8 hours dev time/month",
        "Quarterly strategy calls",
      ],
    },
  ],
};

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(false);
  const currentPlans = isMonthly ? plans.monthly : plans.onetime;

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. No hidden fees.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="pricing-toggle" className="font-medium">
              One-time Project
            </Label>
            <Switch
              id="pricing-toggle"
              checked={isMonthly}
              onCheckedChange={setIsMonthly}
            />
            <Label htmlFor="pricing-toggle" className="font-medium">
              Monthly Plan
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative hover-lift ${
                plan.popular
                  ? "border-2 border-primary shadow-xl scale-105"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-4">
                  {plan.description}
                </CardDescription>
                <div className="space-y-1">
                  <div className="text-4xl font-bold">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">{plan.usd}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() =>
                    window.open(
                      "https://calendly.com/satyam21092001/30min",
                      "_blank"
                    )
                  }
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-secondary hover:bg-secondary/90"
                  }`}
                >
                  Start This Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
