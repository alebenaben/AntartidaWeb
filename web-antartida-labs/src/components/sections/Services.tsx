import { Bot, Bug, CodeSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      id: "recepcionista-digital",
      title: "Recepcionista Digital",
      description: "Agente que atiende llamadas, agenda citas y entrega información útil al cliente.",
      icon: <Bot className="w-10 h-10 text-cyan" />,
    },
    {
      id: "qa-agent",
      title: "QA Agent",
      description: "Agente que ejecuta tareas de testing a partir de especificaciones funcionales.",
      icon: <Bug className="w-10 h-10 text-blue" />,
    },
    {
      id: "refactoring-agent",
      title: "Refactoring Agent",
      description: "Agente que recodifica aplicaciones legacy para homologarlas a un nuevo software de base. No desarrolla nuevas funcionalidades; solo adapta/homologa.",
      icon: <CodeSquare className="w-10 h-10 text-navy" />,
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-navy/70">
            Agentes especializados diseñados para resolver problemas concretos de tu negocio, operativos desde el primer día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="w-16 h-16 rounded-xl bg-blue-light/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{service.title}</h3>
              <p className="text-navy/70 mb-8 flex-grow">{service.description}</p>
              
              {/* Note: Links to detail pages are hidden for Phase 1 as per spec, but could be un-commented later */}
              {/* 
              <Link href={`/servicios/${service.id}`} className="inline-flex items-center font-semibold text-cyan hover:text-blue transition-colors mt-auto">
                Saber más <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
