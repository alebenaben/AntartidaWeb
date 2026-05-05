import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Image src="/logo.png" alt="Antartida Labs Logo" width={32} height={32} className="object-contain brightness-0 invert" />
              <span className="font-bold text-xl tracking-tight">Antartida Labs</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Inteligencia Artificial del Sur. Entregamos agentes de IA productivos llave en mano.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-200">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link href="/#servicios" className="text-gray-400 hover:text-cyan transition-colors">Servicios</Link></li>
              <li><Link href="/#como-funciona" className="text-gray-400 hover:text-cyan transition-colors">Cómo Funciona</Link></li>
              <li><Link href="/#casos-de-uso" className="text-gray-400 hover:text-cyan transition-colors">Casos de Uso</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-200">Legal y Contacto</h3>
            <ul className="space-y-2">
              <li><a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@antartidalabs.com'}`} className="text-gray-400 hover:text-cyan transition-colors">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@antartidalabs.com'}</a></li>
              <li><Link href="/privacidad" className="text-gray-400 hover:text-cyan transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/legales" className="text-gray-400 hover:text-cyan transition-colors">Aviso Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} Antartida Labs. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
