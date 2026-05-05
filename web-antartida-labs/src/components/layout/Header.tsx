"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/#servicios", label: "Servicios" },
    { href: "/#como-funciona", label: "Cómo Funciona" },
    { href: "/#beneficios", label: "Beneficios" },
    { href: "/#casos-de-uso", label: "Casos de Uso" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-navy hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center text-white font-bold">AL</div>
              <span className="font-bold text-xl tracking-tight">Antartida Labs</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-navy/80 hover:text-cyan font-medium text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center">
            <Link href="/#contacto" className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors">
              Hablemos
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy hover:text-cyan focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-navy/80 hover:text-cyan hover:bg-gray-50 rounded-md"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contacto"
              onClick={() => setIsOpen(false)}
              className="block mt-4 px-3 py-2 text-base font-medium text-white bg-navy hover:bg-navy/90 rounded-md text-center"
            >
              Hablemos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
