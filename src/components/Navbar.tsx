import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold">
            <span className="text-gradient">CodXBros</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("work")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Process
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Desktop CTA Button */}
          <Button
            onClick={() => window.open("https://calendly.com/satyam21092001/30min", "_blank")}
            className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Get a Quote
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/20">
            <div className="flex flex-col space-y-4 pt-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("work")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Process
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Contact
              </button>
              <Button
                onClick={() => {
                  window.open("https://calendly.com/satyam21092001/30min", "_blank");
                  setIsMobileMenuOpen(false);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mt-4 w-full"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
