import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(80, "El nombre es demasiado largo"),
  company: z.string().max(100, "El nombre de la empresa es demasiado largo").optional(),
  email: z.string().email("Ingresá un email válido").max(120, "El email es demasiado largo"),
  phone: z.string().max(30, "El teléfono es demasiado largo").regex(/^[\d\s\+\-\(\)]*$/, "El teléfono contiene caracteres inválidos").optional(),
  serviceInterest: z.enum(["recepcionista-digital", "qa-agent", "refactoring-agent", "consultoria-ia", "capacitacion-ia", "otro"], {
    errorMap: () => ({ message: "Seleccioná un servicio de interés" }),
  }),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000, "El mensaje es demasiado largo"),
  acceptsPrivacy: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
  _hp: z.string().max(0, "Invalid field").optional(), // Honeypot
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
