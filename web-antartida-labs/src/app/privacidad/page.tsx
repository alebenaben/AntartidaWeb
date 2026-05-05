export default function Privacidad() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-navy mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-navy max-w-none">
        <p className="mb-4">
          Última actualización: Mayo 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. Información que recopilamos</h2>
        <p className="mb-4">
          Recopilamos la información personal que nos proporcionás directamente cuando completás nuestro formulario de contacto:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Nombre y Apellido</li>
          <li>Dirección de correo electrónico profesional</li>
          <li>Número de teléfono (opcional)</li>
          <li>Empresa (opcional)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Uso de la información</h2>
        <p className="mb-4">
          Utilizamos la información que recopilamos para:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Responder a tus consultas y solicitudes de información.</li>
          <li>Enviarte comunicaciones comerciales relacionadas con nuestros servicios (podés darte de baja en cualquier momento).</li>
          <li>Mejorar nuestro sitio web y la experiencia del usuario.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Compartir información</h2>
        <p className="mb-4">
          No vendemos, alquilamos ni compartimos tu información personal con terceros para sus fines de marketing. Tu información puede ser compartida únicamente con proveedores de servicios que nos asisten en la operación del negocio (por ejemplo, servicios de alojamiento o CRM), quienes están sujetos a obligaciones de confidencialidad.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Seguridad</h2>
        <p className="mb-4">
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso, alteración, divulgación o destrucción no autorizada.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Tus derechos</h2>
        <p className="mb-4">
          Tenés derecho a acceder, rectificar, limitar o solicitar la eliminación de tus datos personales en cualquier momento. Para ejercer estos derechos, contactanos a {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@antartidalabs.com'}.
        </p>
      </div>
    </div>
  );
}
