import { CheckCircle2 } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      title: "Time-to-value corto",
      description: "Despliegue rápido. Empezá a ver resultados en semanas, no en meses."
    },
    {
      title: "Modelo OPEX",
      description: "Sin grandes inversiones de capital inicial. Pagá por el servicio que consumís."
    },
    {
      title: "Sin equipo interno de IA",
      description: "Nosotros nos encargamos de la complejidad técnica, el mantenimiento y las actualizaciones."
    },
    {
      title: "Especialización por dominio",
      description: "Agentes diseñados específicamente para resolver problemas concretos de tu industria."
    },
    {
      title: "Escalabilidad inmediata",
      description: "Nuestros agentes pueden manejar picos de demanda sin necesidad de reestructurar tu equipo."
    },
    {
      title: "Integración sin fricción",
      description: "Se adaptan a tus herramientas actuales (CRM, ERP, canales de comunicación)."
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Beneficios de AAAS</h2>
            <p className="text-lg text-navy/70 mb-8">
              Transformá tu negocio con inteligencia artificial sin asumir los riesgos y costos asociados al desarrollo tradicional de software.
            </p>
            <div className="w-24 h-1 bg-gradient-accent rounded-full"></div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg">{benefit.title}</h3>
                    <p className="text-navy/70 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
