import { Search, PenTool, Rocket, Activity } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Diagnóstico",
      description: "Entendemos tu proceso actual y determinamos dónde un agente puede generar más valor.",
      icon: <Search className="w-6 h-6 text-navy" />
    },
    {
      num: "02",
      title: "Diseño",
      description: "Adaptamos el agente a tus reglas de negocio, tono de comunicación y sistemas existentes.",
      icon: <PenTool className="w-6 h-6 text-navy" />
    },
    {
      num: "03",
      title: "Implementación",
      description: "Desplegamos el agente en tu entorno de forma transparente y sin fricciones.",
      icon: <Rocket className="w-6 h-6 text-navy" />
    },
    {
      num: "04",
      title: "Operación",
      description: "Mantenemos el agente funcionando, monitorizando su rendimiento y aplicando mejoras continuas.",
      icon: <Activity className="w-6 h-6 text-navy" />
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Cómo Funciona AAAS</h2>
          <p className="text-lg text-navy/70">
            Un proceso simple y transparente para integrar inteligencia artificial en tu empresa sin curvas de aprendizaje empinadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-cyan/30 to-transparent" />
              )}
              
              <div className="bg-white w-24 h-24 rounded-2xl shadow-sm flex items-center justify-center mb-6 relative z-10 border border-gray-100">
                <div className="absolute -top-3 -right-3 text-4xl font-black text-gray-100">{step.num}</div>
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-navy/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
