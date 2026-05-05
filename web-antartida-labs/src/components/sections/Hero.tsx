import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 md:pt-32 md:pb-40">
      <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-900/[0.04] dark:bg-bottom" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Image src="/logo.png" alt="Antartida Labs Logo" width={100} height={100} className="mx-auto mb-8 object-contain drop-shadow-sm" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Inteligencia Artificial <span className="text-gradient">del Sur</span>
          </h1>
          <p className="text-xl md:text-2xl text-navy/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Agentes de IA empaquetados como servicio (AAAS). Entregamos soluciones llave en mano sin complejidad para tu equipo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/#contacto" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-navy rounded-lg hover:bg-navy/90 transition-all shadow-lg hover:shadow-xl"
            >
              Hablemos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/#servicios" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-navy bg-white border-2 border-gray-200 rounded-lg hover:border-cyan hover:text-cyan transition-all"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[500px] h-[500px] bg-blue-light rounded-full blur-3xl opacity-50" />
    </section>
  );
}
