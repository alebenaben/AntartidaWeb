import ContactForm from "../forms/ContactForm";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-light/20 rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-5/12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Hablemos</h2>
              <p className="text-lg text-navy/70 mb-8 leading-relaxed">
                ¿Querés saber cómo un agente de IA puede optimizar los procesos de tu empresa? Dejanos tus datos y nos pondremos en contacto a la brevedad.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy">Email</h4>
                  <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@antartidalabs.com'}`} className="text-cyan hover:text-blue transition-colors">
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@antartidalabs.com'}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-7/12">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-50">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
