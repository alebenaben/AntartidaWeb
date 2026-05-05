import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const servicesData = {
  "recepcionista-digital": {
    title: "Recepcionista Digital",
    subtitle: "Atención al cliente 24/7 sin esperas",
    description: "Un agente conversacional entrenado específicamente con los datos de tu empresa. Capaz de entender el contexto, resolver dudas frecuentes, derivar consultas complejas y agendar reuniones de forma automática.",
    features: [
      "Atención omnicanal (Web, WhatsApp, Redes Sociales)",
      "Integración nativa con tu CRM actual",
      "Soporte multilingüe",
      "Análisis de sentimiento en tiempo real"
    ],
  },
  "qa-agent": {
    title: "QA Agent",
    subtitle: "Aseguramiento de calidad continuo",
    description: "Agente automatizado que diseña, escribe y ejecuta pruebas de software interpretando las reglas de negocio en lenguaje natural, garantizando que cada despliegue sea seguro.",
    features: [
      "Generación automática de casos de prueba",
      "Ejecución en múltiples entornos",
      "Reportes detallados con evidencia visual",
      "Integración con flujos CI/CD"
    ],
  },
  "refactoring-agent": {
    title: "Refactoring Agent",
    subtitle: "Modernización de código legacy",
    description: "Analiza bases de código antiguas y las traduce o reestructura a frameworks modernos manteniendo exactamente la misma lógica de negocio, reduciendo drásticamente la deuda técnica.",
    features: [
      "Análisis estático de seguridad",
      "Traducción de lenguajes (ej. COBOL a Java)",
      "Generación de documentación automática",
      "Mantenimiento de paridad funcional"
    ],
  },
  "consultoria-ia": {
    title: "Consultoría Estratégica en IA",
    subtitle: "Diseñamos tu hoja de ruta hacia la IA",
    description: "Acompañamos a tu equipo directivo en la identificación de oportunidades de automatización, evaluamos la viabilidad técnica y trazamos un plan de implementación escalable.",
    features: [
      "Auditoría de procesos actuales",
      "Evaluación de viabilidad técnica y ROI",
      "Diseño de arquitectura de IA",
      "Acompañamiento en la gestión del cambio"
    ],
  },
  "capacitacion-ia": {
    title: "Educación y Capacitación",
    subtitle: "Empodera a tu equipo con IA",
    description: "Talleres prácticos y programas de formación corporativa para desmitificar la IA y enseñar a tus colaboradores a utilizar agentes y herramientas generativas en su día a día.",
    features: [
      "Workshops prácticos de Prompt Engineering",
      "Formación técnica para desarrolladores",
      "Sesiones ejecutivas sobre impacto de negocio",
      "Materiales de estudio personalizados"
    ],
  }
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug as keyof typeof servicesData];

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/#servicios" className="inline-flex items-center text-cyan hover:text-blue transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a servicios
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">{service.title}</h1>
        <h2 className="text-xl md:text-2xl text-cyan mb-8">{service.subtitle}</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
          <h3 className="text-2xl font-bold text-navy mb-4">Descripción del servicio</h3>
          <p className="text-lg text-navy/80 leading-relaxed mb-8">
            {service.description}
          </p>

          <h3 className="text-2xl font-bold text-navy mb-6">Características principales</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-cyan mr-3 flex-shrink-0" />
                <span className="text-navy/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center bg-blue-light/30 rounded-2xl p-10 border border-blue-light">
          <h3 className="text-2xl font-bold text-navy mb-4">¿Te interesa implementar este servicio?</h3>
          <p className="text-navy/70 mb-8 max-w-2xl mx-auto">
            Hablemos sobre cómo podemos adaptar {service.title} a las necesidades específicas de tu empresa.
          </p>
          <Link 
            href="/#contacto" 
            className="inline-block px-8 py-4 text-base font-semibold text-white bg-navy rounded-lg hover:bg-navy/90 transition-all shadow-lg hover:shadow-xl"
          >
            Contactar a un asesor
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate static params for optimal build performance
export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}
