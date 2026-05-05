"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/contact-schema";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      serviceInterest: undefined,
      message: "",
      _hp: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Detectamos demasiados envíos desde tu conexión. Probá nuevamente en unos minutos.");
        }
        if (response.status === 502) {
          throw new Error("No pudimos enviar tu mensaje en este momento. Probá de nuevo en unos minutos o escribinos a contacto@antartidalabs.com.");
        }
        throw new Error(result.error === "validation" ? "Verificá los datos ingresados." : "Hubo un error al procesar tu solicitud.");
      }

      setStatus("success");
      reset();
    } catch (error: any) {
      console.error("Form error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Hubo un problema de conexión. Verificá tu red y volvé a intentar.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-navy mb-2">¡Gracias!</h3>
        <p className="text-navy/70 mb-8 max-w-sm">
          Recibimos tu mensaje y te contactaremos a la brevedad.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="text-cyan font-medium hover:text-blue transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {status === "error" && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Honeypot field - hidden from users */}
      <input type="text" {...register("_hp")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">Nombre y Apellido *</label>
        <input
          id="name"
          type="text"
          className={`w-full px-4 py-2.5 rounded-md border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
          {...register("name")}
          disabled={status === "submitting"}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">Email corporativo *</label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2.5 rounded-md border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            {...register("email")}
            disabled={status === "submitting"}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1">Teléfono</label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-4 py-2.5 rounded-md border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            {...register("phone")}
            disabled={status === "submitting"}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-navy mb-1">Empresa</label>
        <input
          id="company"
          type="text"
          className={`w-full px-4 py-2.5 rounded-md border ${errors.company ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
          {...register("company")}
          disabled={status === "submitting"}
        />
        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
      </div>

      <div>
        <label htmlFor="serviceInterest" className="block text-sm font-medium text-navy mb-1">Servicio de interés *</label>
        <select
          id="serviceInterest"
          className={`w-full px-4 py-2.5 rounded-md border ${errors.serviceInterest ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}
          {...register("serviceInterest")}
          disabled={status === "submitting"}
        >
          <option value="">Seleccioná una opción...</option>
          <option value="recepcionista-digital">Recepcionista Digital</option>
          <option value="qa-agent">QA Agent</option>
          <option value="refactoring-agent">Refactoring Agent</option>
          <option value="otro">Otro</option>
        </select>
        {errors.serviceInterest && <p className="mt-1 text-sm text-red-500">{errors.serviceInterest.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy mb-1">Mensaje *</label>
        <textarea
          id="message"
          rows={4}
          className={`w-full px-4 py-2.5 rounded-md border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan'} focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
          {...register("message")}
          disabled={status === "submitting"}
        ></textarea>
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptsPrivacy"
            type="checkbox"
            className="w-4 h-4 text-cyan border-gray-300 rounded focus:ring-cyan"
            {...register("acceptsPrivacy")}
            disabled={status === "submitting"}
          />
        </div>
        <label htmlFor="acceptsPrivacy" className="ml-2 text-sm text-navy/70">
          He leído y acepto la <Link href="/privacidad" className="text-cyan hover:underline" target="_blank">política de privacidad</Link>. *
        </label>
      </div>
      {errors.acceptsPrivacy && <p className="mt-1 text-sm text-red-500">{errors.acceptsPrivacy.message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-navy hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan transition-colors disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Enviando...
          </>
        ) : (
          "Enviar mensaje"
        )}
      </button>
    </form>
  );
}
