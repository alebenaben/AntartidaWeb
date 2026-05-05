import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Benefits from "@/components/sections/Benefits";
import UseCases from "@/components/sections/UseCases";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-12 bg-blue-light/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Qué es AAAS?</h2>
          <p className="text-lg md:text-xl text-navy/80">
            Agent As A Service. No vendemos licencias de software, entregamos agentes operando. 
            Nuestros agentes están listos para integrarse en tus procesos y empezar a generar valor desde el primer día.
          </p>
        </div>
      </section>
      <Services />
      <HowItWorks />
      <Benefits />
      <UseCases />
      <ContactSection />
    </>
  );
}
