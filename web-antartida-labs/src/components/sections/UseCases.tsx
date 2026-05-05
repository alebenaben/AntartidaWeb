export default function UseCases() {
  const useCases = [
    {
      agent: "Recepcionista Digital",
      cases: [
        "Clínicas médicas: Agendamiento de turnos 24/7 y recordatorios automáticos.",
        "Estudios jurídicos: Primer filtro de consultas y derivación al especialista adecuado."
      ]
    },
    {
      agent: "QA Agent",
      cases: [
        "Equipos de desarrollo: Generación automática de tests e2e a partir de historias de usuario.",
        "Agencias digitales: Validación de regresión visual en múltiples dispositivos antes de cada pase a producción."
      ]
    },
    {
      agent: "Refactoring Agent",
      cases: [
        "Bancos: Migración de componentes legacy (ej. de AngularJS a React) sin alterar la lógica de negocio.",
        "Retail: Homologación de integraciones de APIs antiguas a nuevos estándares REST/GraphQL."
      ]
    }
  ];

  return (
    <section id="casos-de-uso" className="py-20 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Casos de Uso</h2>
          <p className="text-lg text-gray-300">
            Descubrí cómo nuestros agentes ya están generando impacto real en diferentes industrias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-cyan mb-6 pb-4 border-b border-white/10">{useCase.agent}</h3>
              <ul className="space-y-4">
                {useCase.cases.map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-blue-light opacity-50 mt-1">•</span>
                    <span className="text-gray-300 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
