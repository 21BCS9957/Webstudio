import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    id: 1,
    category: "website",
    title: "TechStart Solutions",
    description: "Modern SaaS landing page with integrated analytics",
    tech: ["React", "Tailwind", "Framer Motion"],
    metric: "+42% conversion",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: 2,
    category: "ecommerce",
    title: "Urban Fashion Store",
    description: "High-performance eCommerce with 300+ products",
    tech: ["Next.js", "Stripe", "Headless CMS"],
    metric: "LCP 1.2s",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    id: 3,
    category: "webapp",
    title: "ProjectHub Portal",
    description: "Team collaboration platform with real-time updates",
    tech: ["React", "Node.js", "WebSocket"],
    metric: "5k+ users",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: 4,
    category: "website",
    title: "GreenLife Wellness",
    description: "Health & wellness brand with booking system",
    tech: ["WordPress", "Custom Theme", "Calendly"],
    metric: "+85% bookings",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  },
  {
    id: 5,
    category: "ecommerce",
    title: "Gourmet Bites",
    description: "Food delivery platform with real-time tracking",
    tech: ["React", "Shopify", "Google Maps"],
    metric: "3x revenue",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  },
  {
    id: 6,
    category: "webapp",
    title: "FinTrack Dashboard",
    description: "Financial analytics SaaS with custom reports",
    tech: ["Vue.js", "D3.js", "Express"],
    metric: "99.9% uptime",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
];

const Portfolio = () => {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Real projects, real results. See how we've helped businesses grow.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-primary" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "website" ? "default" : "outline"}
              onClick={() => setFilter("website")}
              className={filter === "website" ? "bg-primary" : ""}
            >
              Websites
            </Button>
            <Button
              variant={filter === "ecommerce" ? "default" : "outline"}
              onClick={() => setFilter("ecommerce")}
              className={filter === "ecommerce" ? "bg-primary" : ""}
            >
              eCommerce
            </Button>
            <Button
              variant={filter === "webapp" ? "default" : "outline"}
              onClick={() => setFilter("webapp")}
              className={filter === "webapp" ? "bg-primary" : ""}
            >
              Web Apps
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden hover-lift group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <Badge className="bg-accent text-accent-foreground">
                    {project.metric}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
