import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div>
            <div className="text-xl sm:text-2xl font-bold mb-4">
              <span className="text-primary">CodXBros</span>
            </div>
            <p className="text-sm sm:text-base text-background/70 mb-4 leading-relaxed">
              Building high-performance websites that drive real business results.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("work")}
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm sm:text-base text-background/70">
              <li>Landing Pages</li>
              <li>Business Websites</li>
              <li>eCommerce</li>
              <li>Web Applications</li>
              <li>SEO & Performance</li>
              <li>Maintenance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <a
                  href="mailto:hello@codxbros.dev"
                  className="text-sm sm:text-base text-background/70 hover:text-primary transition-colors"
                >
                  hello@codxbros.dev
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm sm:text-base text-background/70">
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} CodXBros. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
