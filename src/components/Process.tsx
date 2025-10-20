import { Search, Palette, Code, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollAnimation } from "../hooks/use-scroll-animation";
import { staggerContainer, staggerItem, fadeInUp } from "../lib/animation-variants";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "We deep-dive into your business goals, target audience, and competitive landscape.",
  },
  {
    icon: Palette,
    title: "Design",
    description:
      "Create wireframes and high-fidelity mockups that align with your brand identity.",
  },
  {
    icon: Code,
    title: "Build",
    description:
      "Develop with clean code, best practices, and rigorous testing at every stage.",
  },
  {
    icon: Rocket,
    title: "Launch & Grow",
    description:
      "Deploy to production, monitor performance, and iterate based on real data.",
  },
];

const Process = () => {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const stepsAnimation = useScrollAnimation({ threshold: 0.1, rootMargin: "-50px" });
  
  // Refs for scroll progress tracking
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });
  
  // Transform scroll progress to height percentage
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef as any} id="process" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerAnimation.ref as any}
          initial="hidden"
          animate={headerAnimation.controls}
          variants={fadeInUp}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient">Process</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A proven methodology that delivers results, every time.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Static background progress line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border/30 -translate-x-1/2" />
            
            {/* Animated progress line */}
            <motion.div
              ref={progressRef}
              className="hidden md:block absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2 origin-top"
              style={{ height: progressHeight }}
            />
            
            {/* Progress indicators at each step */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute -translate-x-1/2 cursor-pointer"
                  style={{
                    top: `${(index / (steps.length - 1)) * 100}%`,
                  }}
                  whileHover={{ scale: 1.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <motion.div
                    className="w-3 h-3 bg-primary rounded-full relative"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: scrollYProgress.get() > index / steps.length ? 1 : 0.5,
                      opacity: scrollYProgress.get() > index / steps.length ? 1 : 0.3,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.1
                    }}
                  />
                  
                  {/* Ripple effect on active indicators */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: scrollYProgress.get() > index / steps.length ? [1, 2, 1] : 0,
                      opacity: scrollYProgress.get() > index / steps.length ? [0.5, 0, 0.5] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              ref={stepsAnimation.ref as any}
              initial="hidden"
              animate={stepsAnimation.controls}
              variants={staggerContainer}
              className="space-y-12 sm:space-y-16"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className={`flex flex-col md:flex-row gap-6 sm:gap-8 items-center ${
                    index % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <motion.div
                      variants={staggerItem}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 0.8
                      }}
                      className={`bg-card border-2 border-border p-6 sm:p-8 rounded-2xl cursor-pointer transition-colors duration-300 hover:border-primary/20 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <motion.h3 
                        className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-3 justify-center md:justify-start"
                        whileHover={{ color: "hsl(var(--primary))" }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span 
                          className="text-primary/60 text-lg"
                          whileHover={{ 
                            scale: 1.1,
                            color: "hsl(var(--primary))"
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 20 
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </motion.span>
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                        whileHover={{ color: "hsl(var(--foreground))" }}
                        transition={{ duration: 0.2 }}
                      >
                        {step.description}
                      </motion.p>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={staggerItem}
                    className="relative z-10"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: 10,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 20,
                        mass: 0.6
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg cursor-pointer hover:bg-primary/20 transition-colors duration-300"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.1,
                          rotate: -5
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 25 
                        }}
                      >
                        <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Subtle pulse effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/5"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ 
                        scale: 1.3, 
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    />
                  </motion.div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
