import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity. A landing page typically takes 1-2 weeks, while a full business website takes 4-6 weeks. Complex web applications can take 8-12 weeks. We'll provide a detailed timeline during our discovery call.",
  },
  {
    question: "What's included in the pricing?",
    answer:
      "All our packages include design, development, responsive implementation, basic SEO setup, and the specified number of revision rounds. We also provide training on how to manage your content and ongoing support as outlined in each plan.",
  },
  {
    question: "Do I own the website after it's built?",
    answer:
      "Absolutely! Once the project is completed and final payment is received, you own 100% of the code, design, and content. We'll transfer all files and provide documentation for your records.",
  },
  {
    question: "What if I need changes after launch?",
    answer:
      "We offer post-launch support as part of every package. For ongoing changes, we recommend our monthly maintenance plans which include regular updates, security monitoring, and allocated development hours each month.",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer:
      "While we don't directly provide hosting, we'll guide you through selecting the best hosting solution for your needs and can handle the entire setup process. We work with all major hosting providers and can recommend options based on your budget and requirements.",
  },
  {
    question: "Can you help with SEO and marketing?",
    answer:
      "Yes! All our websites are built with SEO best practices from the ground up. We include technical SEO setup, meta tags, schema markup, and performance optimization. For ongoing SEO and digital marketing, we can connect you with trusted partners or include it in a custom package.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We use modern, proven technologies including React, Next.js, Tailwind CSS, and various headless CMS solutions. Our tech stack is chosen based on your specific needs, ensuring optimal performance, scalability, and ease of maintenance.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes! For projects over ₹50,000, we offer flexible payment terms with 50% upfront and 50% on completion. For larger enterprise projects, we can discuss custom payment schedules. Monthly maintenance plans are billed at the start of each month.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about working with us.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border-2 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
