# Especificación Técnica — Web Antartida Labs

> **Versión:** 1.0
> **Fecha:** 2026-05-05
> **Autor:** Arquitectura / Tech Lead
> **Estado:** Borrador para revisión
> **Audiencia:** Stakeholders de negocio + equipo de desarrollo

---

## 1. Resumen ejecutivo

Antartida Labs es una empresa que ofrece **AAAS (Agent As A Service)**: agentes de IA empaquetados como servicio, bajo el lema **"Inteligencia Artificial del Sur"**. El portafolio inicial incluye tres agentes verticales: **Recepcionista Digital**, **QA Agent** y **Refactoring Agent**.

Esta especificación describe la **web institucional/comercial** que servirá como punto de entrada digital de la empresa. El objetivo es disponer de un sitio simple, performante, mantenible y de bajo costo operativo, capaz de comunicar la propuesta de valor, presentar los tres servicios y captar leads mediante un formulario de contacto cuyos datos se enviarán a una plataforma externa vía **webhook**.

| Aspecto | Decisión |
|---|---|
| Tipo de sitio | Web institucional + lead capture (1 página principal + páginas internas opcionales) |
| Stack recomendado | **Next.js 14+ (App Router) + TypeScript + Tailwind CSS**, desplegado como contenedor Node.js |
| Backend | Route Handler de Next.js (API endpoint propio) que recibe el formulario y reenvía al webhook |
| Hosting | VPS Ubuntu con EasyPanel (contenedor gestionado, HTTPS automático vía Traefik) |
| Repositorio | GitHub, despliegue por integración nativa de EasyPanel |
| Costo objetivo | Bajo: una sola VPS, sin BD, sin servicios de terceros pagos |

**Público objetivo**

- PyMEs y empresas medianas que quieren incorporar IA sin construir un equipo interno.
- Áreas de TI, QA y Atención al Cliente que buscan automatizar tareas concretas.
- Decisores técnicos (CTO, Tech Lead) y de negocio (Gerente de Operaciones, Dueños de PyME).

**Propuesta de valor**

Antartida Labs entrega agentes de IA productivos "llave en mano", enfocados en problemas concretos, con un modelo de servicio (no de licencia) que evita a los clientes la complejidad de construir, entrenar y operar agentes propios.

---

## 2. Contexto y objetivos

**Contexto.** Antartida Labs está iniciando operaciones y necesita presencia digital institucional para validar mercado y captar interesados antes de invertir en estructuras más grandes (CRM, marketing automation, blog, etc.).

**Objetivos del producto web**

1. Comunicar quién es Antartida Labs y qué hace.
2. Presentar los tres servicios iniciales con claridad.
3. Generar leads cualificados a través de un único formulario de contacto.
4. Enviar cada lead a una plataforma externa por webhook (CRM, automation, hoja de cálculo, etc., a definir).
5. Soportar SEO básico y compartibilidad en redes (Open Graph, Twitter Cards).
6. Operar con costo bajo y mantenimiento mínimo.

**No-objetivos (en esta versión)**

- No es un portal de clientes, no hay login.
- No es un blog ni CMS.
- No incluye ecommerce ni cobros.
- No incluye panel administrativo propio.

---

## 3. Alcance

### 3.1 In scope

- Diseño visual coherente con el logo (pingüino + estrella polar, paleta cian/azul) y el lema "Inteligencia Artificial del Sur".
- Web responsive (mobile-first), accesible (WCAG 2.1 AA en lo razonable).
- Una página principal (home) con todas las secciones requeridas y, opcionalmente, páginas individuales por servicio (`/servicios/recepcionista-digital`, `/servicios/qa-agent`, `/servicios/refactoring-agent`).
- Formulario de contacto con validación cliente y servidor, envío vía webhook a una URL configurable por variable de entorno.
- Mecanismos antispam básicos (honeypot + rate limiting por IP).
- Metadatos SEO (title, description, Open Graph, Twitter Card, sitemap.xml, robots.txt).
- Despliegue automatizado en VPS Ubuntu con EasyPanel desde repositorio GitHub.
- HTTPS con certificado emitido por Let's Encrypt (gestionado por EasyPanel/Traefik).
- Logging básico de envíos del formulario (éxito/error) en stdout del contenedor.

### 3.2 Out of scope

- Login, registro de usuarios, áreas privadas.
- Panel administrativo propio o CMS headless.
- Base de datos persistente (los leads viven en la plataforma externa que recibe el webhook).
- Pagos en línea, suscripciones.
- Internacionalización completa (i18n). El sitio será **en español** en su primera versión; se deja la arquitectura preparada por si se agrega inglés en el futuro.
- Chat en vivo, chatbot, integración con WhatsApp.
- Analítica avanzada (más allá de un script de Plausible/Umami opcional).

### 3.3 Supuestos

- **S-01.** El webhook destino acepta `POST` con `Content-Type: application/json` y devuelve `2xx` ante éxito. La URL será provista antes del despliegue.
- **S-02.** El dominio (ej. `antartidalabs.com` o similar) será adquirido por el cliente y apuntará al VPS.
- **S-03.** El idioma de la web es **español**. Cualquier traducción al inglés es trabajo posterior.
- **S-04.** No se requiere cumplimiento normativo específico (GDPR/LOPD) más allá de las buenas prácticas (aviso de privacidad, consentimiento explícito en formulario).
- **S-05.** El equipo de desarrollo tiene acceso al servidor VPS y a la cuenta de GitHub donde vivirá el repositorio.
- **S-06.** El logo se entrega como PNG con fondo blanco; se solicitará versión SVG y/o transparente para uso óptimo (ver Preguntas Abiertas).

---

## 4. Stack tecnológico recomendado

### 4.1 Stack propuesto

| Capa | Tecnología | Versión sugerida |
|---|---|---|
| Framework web | **Next.js** (App Router) | 14.x o superior |
| Lenguaje | **TypeScript** | 5.x |
| Estilos | **Tailwind CSS** | 3.x |
| Componentes UI | **shadcn/ui** (opcional) + **lucide-react** (iconos) | — |
| Validación de formulario | **Zod** + **React Hook Form** | — |
| Runtime | **Node.js** | 20 LTS |
| Empaquetado | **Docker** (Dockerfile multi-stage) | — |
| Despliegue | **EasyPanel** sobre Ubuntu LTS (22.04/24.04) | — |
| Reverse proxy / TLS | **Traefik** (gestionado por EasyPanel) | — |
| CI / Build | EasyPanel build desde GitHub (App "From GitHub") | — |

### 4.2 Justificación

- **Next.js (App Router).** Permite combinar **páginas estáticas** (home, secciones de servicios, casos de uso) con **route handlers de servidor** (para el endpoint que recibe el formulario y reenvía al webhook). Esto evita exponer la URL del webhook al cliente y permite añadir validación/rate limiting del lado servidor sin desplegar un backend separado.
- **TypeScript.** Reduce defectos en validaciones, payloads y formularios. Es el estándar moderno y mejora mantenibilidad para futuros desarrolladores.
- **Tailwind CSS.** Permite construir UI rápida, consistente y responsive sin CSS custom disperso. Combina muy bien con la estética minimalista/lineal del logo.
- **Zod + React Hook Form.** Validación tipada compartida entre cliente y servidor (mismo schema), bajo coste, alto retorno en calidad.
- **Node 20 LTS + Docker.** Imagen reproducible, compatible con cualquier VPS y nativa en EasyPanel.
- **EasyPanel.** Cumple el requerimiento del cliente, gestiona Traefik + Let's Encrypt automáticamente, integra GitHub para CI/CD básico y simplifica variables de entorno.

### 4.3 Alternativas consideradas y por qué se descartan

| Alternativa | Por qué se descarta |
|---|---|
| Sitio 100% estático (Astro/Hugo) sin backend | Requiere exponer la URL del webhook al cliente o usar un servicio externo (ej. Formspree). Pierde control sobre rate limiting, validación servidor y secretos. |
| WordPress | Sobredimensionado, mayor superficie de ataque, requiere DB y mantenimiento de plugins. |
| Backend separado (Express/Nest) + frontend estático | Innecesariamente complejo para una landing con un único endpoint. Next.js cubre ambos roles con menos código. |
| Serverless puro (Vercel) | El cliente exige despliegue en VPS Ubuntu con EasyPanel; queda fuera de alcance. |

---

## 5. Arquitectura propuesta

### 5.1 Diagrama lógico

```
┌─────────────────────────────────────────────────────────────────┐
│                         Navegador (Cliente)                      │
│   - Renderiza páginas Next.js (estáticas o SSR)                  │
│   - Valida formulario en cliente (Zod + React Hook Form)         │
│   - POST /api/contact con JSON                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  VPS Ubuntu  (EasyPanel + Traefik)               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Contenedor Docker: web-antartida-labs                    │  │
│  │  - Next.js 14 (Node 20)                                   │  │
│  │  - Sirve páginas estáticas (ISR/SSG)                      │  │
│  │  - Route Handler: /api/contact                            │  │
│  │      · Valida payload (Zod)                               │  │
│  │      · Aplica rate limit por IP                           │  │
│  │      · Reenvía POST al webhook externo                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS, JSON
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│       Plataforma externa (CRM / Automation / Webhook URL)        │
│       - URL definida por variable de entorno CONTACT_WEBHOOK_URL │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Estrategia de renderizado

- **SSG (Static Site Generation)** para todas las páginas de contenido: home, servicios, casos de uso, política de privacidad. Las páginas se construyen en build-time → máxima performance, mínimo costo de CPU.
- **Route Handler dinámico** únicamente en `/api/contact`. Es el único punto que ejecuta lógica en cada request.
- No se usa SSR completo porque no hay contenido personalizado por usuario.

### 5.3 Decisión: backend propio vs webhook directo

Se elige **endpoint propio (`/api/contact`) que reenvía al webhook**, no llamada directa desde el navegador. Razones:

1. **No exponer la URL del webhook** ni sus posibles secretos en el cliente.
2. Permitir **validación de servidor** además de la del cliente (la del cliente es bypasseable).
3. Permitir **rate limiting por IP** y **honeypot antispam** sin depender de la plataforma externa.
4. Permitir **enriquecer el payload** con timestamp, IP enmascarada, fuente, etc.
5. Permitir **respuestas de error consistentes** al usuario aun si el webhook falla o cambia.

---

## 6. Mapa del sitio

### 6.1 Estructura

```
/                                   (Home - one-page con anclas + secciones)
├── #servicios
├── #como-funciona
├── #beneficios
├── #casos-de-uso
└── #contacto

/servicios/recepcionista-digital     (opcional, fase 2)
/servicios/qa-agent                  (opcional, fase 2)
/servicios/refactoring-agent         (opcional, fase 2)

/privacidad                          (Política de privacidad - obligatoria)
/legales                             (Aviso legal - opcional)

/sitemap.xml
/robots.txt
```

### 6.2 Orden recomendado de navegación en la home

1. **Hero** — Logo + nombre + lema + CTA principal "Hablemos".
2. **Qué es AAAS** — Explicación breve del modelo "Agent as a Service".
3. **Servicios** — Tres tarjetas (Recepcionista, QA Agent, Refactoring Agent).
4. **Cómo funciona** — Pasos del proceso (Diagnóstico → Diseño → Implementación → Operación).
5. **Beneficios** — Bullets de valor (reducción de costos, time-to-value, especialización).
6. **Casos de uso** — Ejemplos concretos por agente.
7. **Contacto** — Formulario.
8. **Footer** — Logo, contacto, links legales, redes (si aplica).

---

## 7. Diseño funcional por sección

### 7.1 Lineamientos visuales generales

- **Paleta** (derivada del logo): blanco `#FFFFFF` (fondo principal), azul marino `#0A1F44` (textos), cian eléctrico `#00C2FF` (acentos primarios), azul medio `#1E63D6` (links/CTA secundario). El equipo de diseño puede afinar tonos exactos.
- **Tipografía**: sans-serif moderna y legible (sugerencia: **Inter** o **Manrope**, vía `next/font/google` para no bloquear el render).
- **Estilo gráfico**: minimalista, líneas finas, mucho espacio en blanco, acentos con gradientes cian → azul (consistente con el logo).
- **Iconos**: librería **lucide-react** (estilo lineal coherente con el logo).
- **Tema oscuro**: opcional, no crítico en V1.

### 7.2 Secciones

**Hero**
- Logo a la izquierda, "Antartida Labs" como wordmark a la derecha o debajo.
- H1: "Inteligencia Artificial del Sur"
- Subtítulo (1-2 líneas): explicación breve de AAAS.
- CTA primario: "Hablemos" → ancla a `#contacto`.
- CTA secundario: "Ver servicios" → ancla a `#servicios`.
- En desktop, todo visible sin scroll (above the fold).

**Qué es AAAS**
- Bloque corto (~3 líneas) explicando el modelo de servicio.
- Diferenciación: "No vendemos licencias de software, entregamos agentes operando".

**Servicios** (`#servicios`)
- Tres tarjetas en grid (1 columna mobile, 3 desktop).
- Cada tarjeta: ícono + título + descripción (2-3 líneas) + link "Saber más" (si existe la página de detalle).

| Servicio | Descripción base |
|---|---|
| **Recepcionista Digital** | Agente que atiende llamadas, agenda citas y entrega información útil al cliente. |
| **QA Agent** | Agente que ejecuta tareas de testing a partir de especificaciones funcionales. |
| **Refactoring Agent** | Agente que recodifica aplicaciones legacy para homologarlas a un nuevo software de base. No desarrolla nuevas funcionalidades; solo adapta/homologa. |

**Cómo funciona AAAS**
- 4 pasos numerados con íconos: Diagnóstico → Diseño del agente → Implementación → Operación y mejora continua.

**Beneficios**
- Lista de 4-6 bullets: time-to-value corto, modelo OPEX, sin equipo interno de IA, especialización por dominio, escalabilidad, etc.

**Casos de uso**
- Por cada agente, 2-3 escenarios reales y concretos. Texto comercial definitivo lo provee el cliente.

**Formulario de contacto** (`#contacto`)
- Ver sección 10 para el detalle.

**Footer**
- Logo en blanco/negativo, nombre, lema.
- Datos de contacto (email, eventualmente teléfono/redes).
- Enlaces a `/privacidad` y `/legales`.
- Copyright dinámico (año actual).

### 7.3 Uso recomendado del logo

- **Header**: logo a 40-48px de altura, nombre "Antartida Labs" al lado en wordmark.
- **Hero**: versión más grande del logo (centrado o a la derecha, según diseño final).
- **Footer**: logo en versión monocromática o con fondo oscuro (requiere variante).
- **Favicon**: derivado del logo (silueta del pingüino o estrella).
- **OG image**: composición 1200×630 con logo + nombre + lema.
- **Solicitar versión SVG** para escalado nítido (ver Preguntas Abiertas).

---

## 8. Requisitos funcionales

| ID | Requisito | Prioridad | Criterio de validación |
|---|---|---|---|
| RF-001 | La home debe mostrar en el hero el logo de Antartida Labs, el nombre "Antartida Labs", el lema "Inteligencia Artificial del Sur" y un CTA visible hacia el formulario de contacto. | Alta | Al cargar `/` en desktop (≥1280px) el usuario ve los 4 elementos sin hacer scroll. |
| RF-002 | La home debe presentar los tres servicios (Recepcionista Digital, QA Agent, Refactoring Agent) cada uno con título, descripción y un ícono representativo. | Alta | Las tres tarjetas son visibles en la sección `#servicios` con los textos definidos en §7.2. |
| RF-003 | La navegación principal debe contener enlaces ancla a Servicios, Cómo funciona, Beneficios, Casos de uso y Contacto. | Alta | Cada link lleva al usuario al inicio de la sección correspondiente. |
| RF-004 | Todo CTA "Hablemos" / "Contactar" debe enlazar al formulario de contacto. | Alta | Click en cualquier CTA primario hace scroll a `#contacto`. |
| RF-005 | El sitio debe ser responsive y mostrar correctamente las secciones en breakpoints de 360px, 768px, 1024px y 1440px. | Alta | Inspección visual en cada breakpoint sin scroll horizontal ni elementos cortados. |
| RF-006 | El formulario de contacto debe contener los campos: nombre, empresa, email, teléfono, servicio de interés, mensaje y aceptación de privacidad. | Alta | Renderizado del formulario muestra los 7 campos. |
| RF-007 | El campo "servicio de interés" debe ser un select con las opciones: Recepcionista Digital, QA Agent, Refactoring Agent, Otro. | Alta | Inspección del DOM muestra las 4 opciones. |
| RF-008 | El formulario debe validar en cliente que los campos obligatorios (nombre, email, servicio, mensaje, aceptación de privacidad) estén completos y con formato correcto antes de permitir el envío. | Alta | Intentar enviar con un campo obligatorio vacío muestra el error correspondiente y bloquea el submit. |
| RF-009 | El formulario debe validar el email con expresión regular o validador estándar (RFC 5322 simplificado). | Alta | "abc" es rechazado; "user@dominio.com" es aceptado. |
| RF-010 | Al enviar el formulario, los datos deben transmitirse mediante POST JSON al endpoint propio `/api/contact`. | Alta | Inspector de red muestra una request POST a `/api/contact` con `Content-Type: application/json`. |
| RF-011 | El endpoint `/api/contact` debe revalidar el payload en servidor con el mismo schema usado en cliente. | Alta | Una request manual con payload inválido devuelve 400 y un mensaje de error JSON. |
| RF-012 | El endpoint `/api/contact` debe reenviar los datos validados, en formato JSON, al webhook configurado en `CONTACT_WEBHOOK_URL`. | Alta | Verificación: el servicio externo recibe el payload con la estructura definida en §11. |
| RF-013 | El endpoint `/api/contact` debe enriquecer el payload con `submittedAt` (ISO 8601 UTC) y `source: "web-antartida-labs"`. | Alta | El webhook recibe estos dos campos correctamente formateados. |
| RF-014 | El endpoint `/api/contact` debe aplicar rate limiting de **5 envíos por IP cada 10 minutos**. | Alta | El sexto envío desde la misma IP en menos de 10 minutos devuelve HTTP 429. |
| RF-015 | El formulario debe incluir un campo honeypot oculto. Cualquier envío con el honeypot relleno debe descartarse silenciosamente devolviendo HTTP 200. | Alta | Test manual: rellenar el honeypot y enviar; el webhook NO recibe la solicitud, el cliente recibe 200 (para no avisar al bot). |
| RF-016 | Tras un envío exitoso, el usuario debe ver un mensaje de confirmación visible y el formulario debe deshabilitarse o resetearse. | Alta | Inspección visual: aparece "Gracias, te contactaremos a la brevedad" tras un envío válido. |
| RF-017 | Tras un envío fallido (error de red o 5xx del webhook), el usuario debe ver un mensaje de error claro con instrucción de reintento. | Alta | Simulación: con webhook caído, el formulario muestra "No pudimos enviar tu mensaje, intentá de nuevo en unos minutos". |
| RF-018 | El sitio debe contener una página `/privacidad` con la política de privacidad y enlazada desde el footer y desde el formulario. | Alta | Click en el link lleva a la página y el contenido se renderiza correctamente. |
| RF-019 | El sitio debe servir un `sitemap.xml` y un `robots.txt` accesibles públicamente. | Media | `GET /sitemap.xml` y `GET /robots.txt` devuelven 200 con contenido válido. |
| RF-020 | Cada página debe definir metadatos: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `twitter:card`. | Media | Inspección del HTML renderizado contiene los seis tags. |
| RF-021 | El logo debe estar disponible en favicon (16×16, 32×32) y como `apple-touch-icon` (180×180). | Media | Inspección de `<head>` y verificación visual en navegador y mobile. |
| RF-022 | El footer debe mostrar el año actual de forma dinámica. | Baja | Renderización en 2026 muestra "© 2026"; en 2027 muestra "© 2027" sin redeploy si se usa render dinámico, o se actualiza en cada build si es estático. |
| RF-023 | (Fase 2) Cada servicio debe contar con una página de detalle accesible en `/servicios/{slug}` con descripción extendida, casos de uso y CTA al formulario. | Media (fase 2) | Cada URL devuelve 200 y muestra contenido específico del servicio. |

---

## 9. Requisitos no funcionales

| ID | Categoría | Requisito | Métrica / Criterio |
|---|---|---|---|
| RNF-001 | Performance | La home debe alcanzar al menos 90 en Performance en Lighthouse mobile (modo simulado, throttling 4G rápido). | Lighthouse ≥ 90. |
| RNF-002 | Performance | LCP (Largest Contentful Paint) ≤ 2.5 s en mobile, CLS ≤ 0.1, INP ≤ 200 ms. | Medido con PageSpeed Insights. |
| RNF-003 | Performance | Tamaño total transferido en home ≤ 500 KB (excluyendo logo y fuentes). | Medido con DevTools / Lighthouse. |
| RNF-004 | SEO | Lighthouse SEO ≥ 95. Cada página tiene title y description únicos, headings jerárquicos (un solo `<h1>`), `lang="es"` en `<html>`, sitemap y robots. | Auditoría Lighthouse + inspección HTML. |
| RNF-005 | Accesibilidad | Cumplimiento WCAG 2.1 nivel AA en componentes críticos (contraste, navegación con teclado, labels en formulario, foco visible). | Lighthouse Accessibility ≥ 95 + revisión manual con teclado y screen reader. |
| RNF-006 | Compatibilidad mobile | Diseño mobile-first, sin scroll horizontal en viewports desde 360px. | Pruebas manuales en Chrome DevTools y dispositivos reales. |
| RNF-007 | Compatibilidad de navegadores | Soporte para versiones actuales y última versión anterior de Chrome, Firefox, Edge y Safari (incluyendo Safari iOS). | Smoke test manual en cada navegador. |
| RNF-008 | Seguridad | Todo tráfico HTTPS, certificado válido emitido por Let's Encrypt, redirección automática HTTP→HTTPS. | `curl -I http://...` devuelve 301/308 a HTTPS. |
| RNF-009 | Seguridad | Headers de seguridad presentes: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy` mínima. | Verificable con `securityheaders.com` ≥ B. |
| RNF-010 | Seguridad | La URL del webhook NUNCA está presente en HTML, JS de cliente o respuestas al navegador. | Inspección de bundle y respuestas de red. |
| RNF-011 | Seguridad | Los secretos (URL de webhook, tokens si los hay) viven en variables de entorno gestionadas por EasyPanel, no en el repositorio. | Revisión del repo y configuración EasyPanel. |
| RNF-012 | Mantenibilidad | Código en TypeScript con `strict: true`, lint con ESLint y formateo con Prettier, pre-commit hooks (Husky + lint-staged) opcionales pero recomendados. | `tsc --noEmit` y `eslint .` pasan sin errores en CI. |
| RNF-013 | Mantenibilidad | Componentes UI desacoplados, contenidos textuales centralizados en archivos de configuración o constantes para edición sin tocar lógica. | Revisión de estructura del repo. |
| RNF-014 | Observabilidad | Logs estructurados (JSON) en stdout para envíos del formulario: `{ timestamp, level, ip_hash, status, error? }`. Sin loguear contenido del mensaje en plano. | Revisión manual de `docker logs` en el contenedor. |
| RNF-015 | Observabilidad | Endpoint `/api/health` devuelve 200 OK con `{ status: "ok" }` para health checks de EasyPanel. | `curl /api/health` devuelve 200. |
| RNF-016 | Despliegue | El despliegue debe realizarse desde el branch `main` de GitHub mediante integración nativa de EasyPanel, con rebuild automático en cada push. | Push a `main` dispara rebuild visible en EasyPanel. |
| RNF-017 | Despliegue | El tiempo de build + deploy completo no debe superar los 5 minutos en condiciones normales. | Medición en EasyPanel logs. |
| RNF-018 | Costo | El sitio debe correr en una VPS con ≥ 1 vCPU y ≥ 1 GB RAM sin saturarse en cargas normales. | Monitoreo de uso de recursos. |
| RNF-019 | Privacidad | El formulario debe incluir checkbox de aceptación de la política de privacidad antes de habilitar el envío. | Verificación funcional. |

---

## 10. Formulario de contacto e integración webhook

### 10.1 Campos

| Campo | Tipo UI | Obligatorio | Validación |
|---|---|---|---|
| `name` | input text | Sí | 2–80 caracteres, no vacío. |
| `company` | input text | No | 0–100 caracteres. |
| `email` | input email | Sí | Formato email válido (RFC 5322 simplificado). Máx. 120 caracteres. |
| `phone` | input tel | No | 0–30 caracteres, solo dígitos, espacios, `+`, `-`, `(`, `)`. |
| `serviceInterest` | select | Sí | Uno de: `recepcionista-digital`, `qa-agent`, `refactoring-agent`, `otro`. |
| `message` | textarea | Sí | 10–2000 caracteres. |
| `acceptsPrivacy` | checkbox | Sí | Debe estar marcado. |
| `_hp` (honeypot) | input hidden | — | Debe estar vacío en envíos legítimos. |

### 10.2 Flujo de envío

1. El usuario completa el formulario.
2. **Validación cliente** con Zod / React Hook Form. Si falla, se muestran errores inline y no se envía.
3. **POST** `/api/contact` con `Content-Type: application/json` y el payload definido en §11.
4. **Servidor**:
   a. Revalida con el mismo schema Zod.
   b. Verifica honeypot vacío. Si no, retorna 200 silenciosamente.
   c. Aplica rate limiting (5 req / 10 min por IP, en memoria).
   d. Construye el payload final agregando `source` y `submittedAt`.
   e. Hace `fetch` POST al `CONTACT_WEBHOOK_URL` con timeout de 8 s.
   f. Si la respuesta del webhook es 2xx → devuelve 200 al cliente. Si no → devuelve 502 con mensaje genérico.
5. **Cliente** muestra mensaje de éxito o error según respuesta.

### 10.3 Mensajes al usuario

| Situación | Mensaje |
|---|---|
| Validación cliente falla | Error inline en el campo afectado. Ejemplo: "Ingresá un email válido". |
| Envío exitoso (HTTP 200) | "¡Gracias! Recibimos tu mensaje y te contactaremos a la brevedad." |
| Rate limit (HTTP 429) | "Detectamos demasiados envíos desde tu conexión. Probá nuevamente en unos minutos." |
| Error de servidor / webhook (HTTP 5xx) | "No pudimos enviar tu mensaje en este momento. Probá de nuevo en unos minutos o escribinos a contacto@antartidalabs.com." |
| Error de red (sin respuesta) | "Hubo un problema de conexión. Verificá tu red y volvé a intentar." |

### 10.4 Seguridad y antiabuso

- **Honeypot.** Campo `_hp` invisible al usuario; si se llena, se asume bot.
- **Rate limiting.** En memoria (Map con timestamps) suficiente para una sola instancia. Si se escala a multi-instancia, migrar a Redis.
- **Validación servidor obligatoria.** No confiar en validación de cliente.
- **No exponer URL del webhook.** El cliente nunca la ve; vive en `process.env.CONTACT_WEBHOOK_URL`.
- **Timeout de 8 s** en el fetch al webhook para evitar requests colgadas.
- **Sanitización.** Strings se trimean y se rechazan si exceden longitudes máximas. No se renderiza el contenido del mensaje en HTML del propio sitio (se envía a webhook), por lo que el riesgo de XSS interno es bajo.
- **CSRF.** No aplica de forma crítica porque el endpoint solo reenvía a un webhook externo y no manipula sesión. Aun así, el endpoint solo acepta `Content-Type: application/json` y método POST.
- **Logging seguro.** No loguear el contenido del mensaje ni el email completo. Sí loguear timestamp, IP hasheada (SHA-256 con salt), status final.

---

## 11. Modelo de datos

### 11.1 Schema lógico (compartido cliente/servidor)

```ts
// schema conceptual (Zod)
ContactFormSchema = {
  name:            string  (2..80, required)
  company:         string  (0..100, optional)
  email:           string  (email, max 120, required)
  phone:           string  (0..30, optional, regex telefónico)
  serviceInterest: enum    ["recepcionista-digital","qa-agent","refactoring-agent","otro"] (required)
  message:         string  (10..2000, required)
  acceptsPrivacy:  boolean (must be true)
  _hp:             string  (must be empty)
}
```

### 11.2 Payload enviado al webhook

```json
{
  "name": "Juan Pérez",
  "company": "Empresa Demo",
  "email": "juan@empresa.com",
  "phone": "+54 11 1234 5678",
  "serviceInterest": "qa-agent",
  "serviceInterestLabel": "QA Agent",
  "message": "Queremos automatizar pruebas a partir de especificaciones funcionales.",
  "acceptsPrivacy": true,
  "source": "web-antartida-labs",
  "submittedAt": "2026-05-05T18:42:11.000Z",
  "meta": {
    "userAgent": "Mozilla/5.0 ...",
    "ipHash": "a3f1c9...e2",
    "locale": "es-AR"
  }
}
```

### 11.3 Respuestas del endpoint `/api/contact`

| HTTP | Body | Cuándo |
|---|---|---|
| 200 | `{ "ok": true }` | Envío correcto (o honeypot disparado, intencionalmente). |
| 400 | `{ "ok": false, "error": "validation", "fields": { ... } }` | Payload inválido. |
| 429 | `{ "ok": false, "error": "rate_limited" }` | IP excedió el límite. |
| 502 | `{ "ok": false, "error": "webhook_unavailable" }` | Webhook devolvió 5xx o timeout. |
| 500 | `{ "ok": false, "error": "internal" }` | Error inesperado. |

---

## 12. Integraciones y variables de entorno

### 12.1 Webhook externo

- **Único integración externa** del sistema.
- URL provista por el cliente (CRM, Make, n8n, Zapier, Google Apps Script u otra plataforma — a confirmar).
- Método: `POST`, `Content-Type: application/json`.
- Timeout: 8 s.
- Reintentos: **no automáticos** en V1; ante fallo se notifica al usuario y se loguea el error. Reintentos en cola se evalúan si el cliente lo requiere (ver Preguntas Abiertas).

### 12.2 Variables de entorno

| Variable | Obligatoria | Descripción | Ejemplo |
|---|---|---|---|
| `CONTACT_WEBHOOK_URL` | Sí | URL del webhook externo. | `https://hook.example.com/abc123` |
| `CONTACT_WEBHOOK_SECRET` | Opcional | Token a enviar como header `X-Webhook-Secret` si la plataforma lo soporta. | `s3cr3t...` |
| `RATE_LIMIT_MAX` | No (default 5) | Máximo de envíos por ventana. | `5` |
| `RATE_LIMIT_WINDOW_MS` | No (default 600000) | Ventana del rate limit en ms. | `600000` |
| `IP_HASH_SALT` | Sí | Salt para hashear IPs en logs. | `cambiar-en-prod-...` |
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública canónica para SEO/sitemap. | `https://antartidalabs.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Sí | Email mostrado en footer. | `contacto@antartidalabs.com` |
| `NODE_ENV` | Sí | `production` en VPS. | `production` |

### 12.3 Manejo de secretos

- Definidos en EasyPanel → App → Environment.
- Nunca commiteados al repositorio. Existe un `.env.example` con keys vacías.
- `.env.local` está en `.gitignore`.

---

## 13. Estructura sugerida del proyecto

```
web-antartida-labs/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Lint + typecheck (opcional)
├── public/
│   ├── logo.svg                   # Solicitar al cliente
│   ├── logo.png
│   ├── og-image.png               # 1200x630 para social
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout raíz, fuentes, metadata base
│   │   ├── page.tsx               # Home (one-page con secciones)
│   │   ├── globals.css            # Tailwind + tokens de color
│   │   ├── sitemap.ts             # Generación dinámica de sitemap
│   │   ├── privacidad/
│   │   │   └── page.tsx
│   │   ├── legales/
│   │   │   └── page.tsx
│   │   ├── servicios/
│   │   │   ├── recepcionista-digital/page.tsx   # Fase 2
│   │   │   ├── qa-agent/page.tsx                # Fase 2
│   │   │   └── refactoring-agent/page.tsx       # Fase 2
│   │   └── api/
│   │       ├── contact/route.ts   # Route handler del formulario
│   │       └── health/route.ts    # Health check
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── UseCases.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── forms/
│   │   │   └── ContactForm.tsx
│   │   └── ui/                    # Botones, inputs, cards, etc.
│   ├── lib/
│   │   ├── contact-schema.ts      # Schema Zod compartido
│   │   ├── rate-limit.ts          # Rate limiting in-memory
│   │   ├── webhook.ts             # Cliente del webhook externo
│   │   ├── logger.ts              # Logger estructurado
│   │   └── env.ts                 # Validación de env con Zod
│   ├── content/
│   │   ├── services.ts            # Datos de los 3 servicios
│   │   ├── benefits.ts
│   │   ├── how-it-works.ts
│   │   └── use-cases.ts
│   └── types/
│       └── contact.ts
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── Dockerfile
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### 13.1 Componentes principales

- **`<Hero/>`** — logo + lema + CTAs.
- **`<ServicesGrid/>`** — tres tarjetas alimentadas por `content/services.ts`.
- **`<ContactForm/>`** — formulario con React Hook Form + Zod, manejo de estados (idle/submitting/success/error).
- **`/api/contact/route.ts`** — handler que valida, aplica rate limit, llama al webhook y responde.
- **`/api/health/route.ts`** — endpoint trivial para health checks de EasyPanel.

---

## 14. Estrategia de despliegue en VPS Ubuntu con EasyPanel

### 14.1 Prerrequisitos

- VPS Ubuntu LTS (22.04 o 24.04) con EasyPanel ya instalado.
- Dominio (ej. `antartidalabs.com`) con DNS apuntando a la IP pública del VPS.
- Cuenta GitHub con el repositorio `web-antartida-labs`.
- URL del webhook lista para inyectar como variable de entorno.

### 14.2 Repositorio y branching

- **Repositorio**: `github.com/antartida-labs/web-antartida-labs` (o equivalente).
- **Branches**:
  - `main` → producción (auto-deploy a EasyPanel).
  - `develop` → integración (opcional).
  - `feature/*` → trabajo individual.
- **Pull Requests** obligatorios a `main`. Lint + typecheck en CI antes de merge.

### 14.3 Build y despliegue en EasyPanel

**Opción A — App "From GitHub" con detección automática (recomendada):**

1. EasyPanel → Create App → **From GitHub**.
2. Conectar la cuenta y seleccionar el repo.
3. Configurar:
   - **Build path**: `/` (raíz).
   - **Build method**: Dockerfile (incluido en el repo). Alternativamente, Heroku Buildpacks o Nixpacks (Next.js detectado automáticamente).
   - **Port**: `3000`.
   - **Health check**: `/api/health`.
4. Cargar variables de entorno (sección 12.2).
5. Configurar dominio en la pestaña **Domains** → activar HTTPS (Let's Encrypt automático vía Traefik).
6. Activar **Auto Deploy** desde el branch `main`.

**Opción B — Imagen Docker pre-construida** (si se requiere control fino):

1. Build local o en CI: `docker build -t registry/web-antartida-labs:tag .`
2. Push al registry.
3. EasyPanel → App → From Docker Image, configurar la imagen y variables.

### 14.4 Dockerfile recomendado (esqueleto, no código aún)

Multi-stage:
1. **deps**: instala dependencias desde `package.json` (con `npm ci` o `pnpm i --frozen-lockfile`).
2. **builder**: copia el código y ejecuta `next build`. Usa `output: "standalone"` en `next.config.mjs` para reducir el bundle final.
3. **runner**: imagen `node:20-alpine`, copia el output standalone, expone `3000`, comando `node server.js`.

### 14.5 Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias | `npm ci` |
| Build | `npm run build` |
| Start | `npm start` |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

### 14.6 Dominio, HTTPS y reverse proxy

- EasyPanel + Traefik gestionan automáticamente:
  - Routing por host.
  - Certificado Let's Encrypt.
  - Redirección HTTP → HTTPS.
- Configurar también el subdominio `www` con redirección 301 al apex (o viceversa, según preferencia).

### 14.7 Rollback

- EasyPanel mantiene historial de deploys; rollback a un build previo en un click.
- Como respaldo, etiquetar releases en GitHub (`v1.0.0`, `v1.0.1`, etc.) para reproducibilidad.

---

## 15. Criterios de aceptación

**CA-001 — Hero visible al cargar la home**
*Given* un usuario accede a `/` en una pantalla desktop ≥ 1280px,
*When* la página termina de cargar,
*Then* el usuario ve el logo, el nombre "Antartida Labs", el lema "Inteligencia Artificial del Sur" y un CTA "Hablemos" sin necesidad de hacer scroll.

**CA-002 — Servicios presentes y completos**
*Given* el usuario está en la home,
*When* navega a la sección "Servicios",
*Then* visualiza las tres tarjetas (Recepcionista Digital, QA Agent, Refactoring Agent) con título, descripción e ícono.

**CA-003 — Envío exitoso del formulario**
*Given* el usuario completó todos los campos obligatorios con datos válidos y aceptó la política de privacidad,
*When* presiona el botón "Enviar",
*Then* el sistema envía el payload al webhook configurado
*And* el usuario ve el mensaje "¡Gracias! Recibimos tu mensaje y te contactaremos a la brevedad".

**CA-004 — Validación cliente bloquea envío**
*Given* el usuario deja vacío el campo "email",
*When* intenta enviar el formulario,
*Then* el envío no se ejecuta
*And* aparece un mensaje de error inline en el campo email.

**CA-005 — Validación servidor**
*Given* un actor envía un POST manual a `/api/contact` con un payload inválido (email malformado),
*When* el endpoint procesa la request,
*Then* responde HTTP 400 con `{ "ok": false, "error": "validation" }` y no llama al webhook.

**CA-006 — Webhook no disponible**
*Given* el webhook externo está caído o devuelve 5xx,
*When* el usuario envía el formulario,
*Then* el endpoint responde 502
*And* el usuario ve el mensaje de error con instrucción de reintento
*And* no se pierde el contenido escrito antes del intento (los campos siguen rellenos).

**CA-007 — Rate limiting**
*Given* una IP envía 5 formularios válidos en menos de 10 minutos,
*When* envía el sexto,
*Then* el endpoint responde 429
*And* el usuario ve el mensaje "Detectamos demasiados envíos…".

**CA-008 — Honeypot detecta bot**
*Given* un envío llega con el campo `_hp` no vacío,
*When* el endpoint lo procesa,
*Then* responde 200 sin invocar al webhook
*And* registra un log con `status: "honeypot"`.

**CA-009 — Mobile responsive**
*Given* un usuario accede al sitio desde un dispositivo móvil de 375×667,
*When* navega por todas las secciones,
*Then* no aparece scroll horizontal
*And* todos los textos son legibles sin zoom
*And* todos los CTA son tappables (≥ 44×44 px).

**CA-010 — SEO básico**
*Given* un crawler accede a la home,
*When* parsea el HTML,
*Then* encuentra `<title>`, `<meta name="description">`, `og:title`, `og:image`, `<link rel="canonical">`, `lang="es"` en `<html>`
*And* `/sitemap.xml` y `/robots.txt` devuelven 200.

**CA-011 — Despliegue automático**
*Given* un desarrollador hace push a `main`,
*When* EasyPanel detecta el cambio,
*Then* se ejecuta build + deploy automáticamente
*And* en menos de 5 minutos el sitio está actualizado en producción
*And* `/api/health` responde 200.

**CA-012 — HTTPS forzado**
*Given* un usuario accede vía `http://antartidalabs.com`,
*When* el servidor responde,
*Then* redirige con 301/308 a `https://antartidalabs.com`
*And* el certificado es válido (Let's Encrypt).

**CA-013 — Política de privacidad accesible**
*Given* el usuario está en cualquier página,
*When* hace click en el link "Privacidad" del footer o del formulario,
*Then* navega a `/privacidad`
*And* la página renderiza el texto completo de la política.

**CA-014 — Variables de entorno aisladas**
*Given* el bundle de cliente está construido,
*When* se inspecciona el JavaScript servido al navegador,
*Then* no aparece la URL del webhook ni el `IP_HASH_SALT` ni el `CONTACT_WEBHOOK_SECRET`.

---

## 16. Riesgos y mitigaciones

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-001 | URL del webhook no provista o incorrecta al momento del deploy. | Media | Alto (formulario no funcional). | Variable de entorno obligatoria validada al boot con Zod; el contenedor falla rápido si falta. Documentar en README. |
| R-002 | Plataforma externa del webhook cae o cambia formato sin aviso. | Baja-Media | Alto. | Logging detallado, mensaje al usuario claro y email de contacto como fallback en el footer. Considerar cola de reintentos en V2. |
| R-003 | Spam masivo en el formulario. | Alta | Medio. | Honeypot + rate limiting por IP. Si se vuelve un problema, agregar reCAPTCHA invisible o Cloudflare Turnstile. |
| R-004 | Exposición de la URL del webhook en el cliente. | Baja (con la arquitectura propuesta) | Alto. | Endpoint propio `/api/contact`; nunca usar `NEXT_PUBLIC_*` para la URL del webhook. Test CA-014 valida esto. |
| R-005 | Performance degradada por imágenes grandes (logo, OG image). | Media | Medio. | Usar `next/image`, formatos modernos (WebP/AVIF), versión SVG del logo, OG image optimizada ≤ 200 KB. |
| R-006 | El equipo pierde acceso al VPS o EasyPanel. | Baja | Alto. | Documentar credenciales en gestor de secretos del cliente. Usuarios con MFA. Backups del VPS. |
| R-007 | Mantenimiento abandonado: dependencias quedan desactualizadas. | Media | Medio | Política de actualización trimestral + Dependabot/Renovate. |
| R-008 | El cliente quiere agregar funcionalidades complejas (chat, login, blog) que no caben en este stack mínimo. | Media | Medio | El stack propuesto (Next.js) escala bien a esos casos; aun así, dejar documentado que cada nueva feature requiere planificación adicional. |
| R-009 | Logo provisto solo en PNG, escalado pierde calidad. | Alta | Bajo-Medio | Solicitar SVG al cliente (Pregunta Abierta). Usar PNG en alta resolución como fallback. |
| R-010 | Falta de claridad sobre cumplimiento legal (privacidad, cookies). | Media | Medio | Política de privacidad mínima; banner de cookies solo si se incluye analítica con tracking. Por defecto no incluir cookies de tracking. |
| R-011 | Rate limit en memoria insuficiente al escalar a múltiples instancias. | Baja (V1 corre en una sola) | Medio | Documentado: migrar a Redis si se escala horizontalmente. |
| R-012 | DNS mal configurado retrasa la emisión del certificado Let's Encrypt. | Media | Bajo | Verificar propagación DNS antes de activar dominio en EasyPanel. |

---

## 17. Preguntas abiertas

| # | Pregunta | Bloquea desarrollo |
|---|---|---|
| Q-01 | ¿Cuál es la URL del webhook destino y qué plataforma es (Make, n8n, Zapier, CRM propio, otra)? ¿Requiere autenticación (API key, header, firma HMAC)? | Sí, para integración funcional. |
| Q-02 | ¿Cuál es el dominio definitivo? ¿Se usa apex (`antartidalabs.com`), `www`, o un subdominio? | Sí, para configurar EasyPanel. |
| Q-03 | ¿Existe versión SVG del logo? ¿Y variantes para fondo oscuro / monocromático? | No bloquea pero degrada calidad. |
| Q-04 | ¿El idioma de la web será solo español, o se planea inglés desde V1? | No bloquea V1; impacta arquitectura si es desde el inicio. |
| Q-05 | ¿Se requiere algún cumplimiento normativo específico (GDPR, ley argentina 25.326 de protección de datos)? | No bloquea pero impacta política de privacidad y consentimiento. |
| Q-06 | ¿Quién provee el contenido textual definitivo (descripciones extendidas, casos de uso, beneficios, copy del hero)? ¿Hay guía de estilo de marca? | No bloquea esqueleto; bloquea release final. |
| Q-07 | ¿Se quiere analítica web? ¿Cuál (Plausible, Umami, GA4)? Si sí, ¿se acepta el banner de cookies asociado? | No bloquea V1. |
| Q-08 | ¿Se requiere notificación adicional al envío (ej. email automático de confirmación al lead)? | No bloquea V1. |
| Q-09 | ¿Habrá páginas de detalle por servicio en V1 o se posponen a V2? | Define el alcance V1. |
| Q-10 | ¿Qué email institucional se mostrará en el footer y en mensajes de error? (`contacto@antartidalabs.com` es el supuesto.) | No bloquea pero requiere confirmación. |
| Q-11 | ¿Hay redes sociales (LinkedIn, X, Instagram) para enlazar desde el footer? | No bloquea V1. |
| Q-12 | ¿Se quieren reintentos automáticos al webhook si falla, o un sistema de cola? | No bloquea V1; mejora robustez en V2. |

---

## 18. Plan de implementación

Plan en **5 fases**, pensado para un único desarrollador full-stack o un equipo pequeño. Las estimaciones son orientativas.

### Fase 0 — Preparación (1-2 días)

**Entregables**
- Repositorio GitHub creado con `README.md`, `LICENSE`, `.gitignore`.
- VPS con EasyPanel verificado, dominio apuntando.
- Logo en SVG y variantes solicitadas al cliente.
- Confirmación de URL del webhook.
- `.env.example` definido.

### Fase 1 — Esqueleto técnico (1-2 días)

**Entregables**
- Proyecto Next.js + TypeScript + Tailwind inicializado según estructura de §13.
- Configuración de ESLint, Prettier, Husky (opcional).
- Layout raíz, Header, Footer placeholder.
- Página `/privacidad` con texto base.
- `/api/health` operativo.
- Dockerfile multi-stage funcional.
- Primer deploy a EasyPanel (aunque solo muestre "Hello world").
- HTTPS verificado.

### Fase 2 — UI y contenido (3-5 días)

**Entregables**
- Hero con logo, nombre, lema, CTAs (RF-001).
- Sección Servicios con 3 tarjetas (RF-002).
- Sección Cómo funciona AAAS.
- Sección Beneficios.
- Sección Casos de uso.
- Footer completo (RF-022).
- Estilos responsive (RF-005).
- Metadatos SEO base + favicon + OG image (RF-020, RF-021).
- Sitemap y robots (RF-019).

### Fase 3 — Formulario y webhook (2-3 días)

**Entregables**
- Componente `<ContactForm/>` con React Hook Form + Zod.
- Endpoint `/api/contact` con validación, honeypot, rate limit, llamada al webhook.
- Estados de UI: idle / submitting / success / error.
- Logging estructurado (RNF-014).
- Pruebas end-to-end manuales contra un webhook de prueba (ej. webhook.site).

### Fase 4 — Hardening y QA (2-3 días)

**Entregables**
- Lighthouse Performance, SEO y Accesibilidad cumpliendo umbrales (RNF-001, RNF-004, RNF-005).
- Security headers configurados (RNF-009).
- Pruebas de los criterios de aceptación CA-001 a CA-014.
- Revisión cruzada de seguridad: secretos no expuestos (CA-014), HTTPS forzado (CA-012).
- Documentación final en README: cómo correr local, cómo desplegar, cómo cambiar contenidos.

### Fase 5 — Go-live (1 día)

**Entregables**
- Deploy final a producción con dominio definitivo.
- Verificación end-to-end del webhook con la plataforma real (no la de prueba).
- Handover al cliente: credenciales, accesos, mini-guía de mantenimiento.
- Cierre de Preguntas Abiertas residuales.

**Total estimado:** 9–14 días de trabajo efectivo, según disponibilidad de respuestas a Preguntas Abiertas.

---

## 19. Checklist final para desarrollo

**Pre-desarrollo**
- [ ] URL del webhook confirmada y testeada con `curl`.
- [ ] Dominio comprado y DNS apuntando al VPS.
- [ ] Logo SVG + variantes recibidas.
- [ ] Texto definitivo (o aprobación para usar texto base de la spec) confirmado.
- [ ] Email institucional confirmado.
- [ ] Repositorio GitHub creado y accesible para el equipo.

**Implementación**
- [ ] Estructura de carpetas según §13.
- [ ] TypeScript en `strict: true`.
- [ ] Variables de entorno validadas con Zod al boot.
- [ ] Schema Zod del formulario compartido cliente/servidor.
- [ ] Honeypot + rate limit + timeout implementados.
- [ ] URL del webhook NO presente en el bundle del cliente.
- [ ] Logs estructurados sin información sensible.
- [ ] Health check `/api/health` operativo.
- [ ] Sitemap + robots + metadatos SEO + favicon + OG image.
- [ ] Política de privacidad publicada en `/privacidad`.

**Pre-deploy**
- [ ] Lighthouse Performance ≥ 90 mobile.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Security headers verificados con `securityheaders.com` (≥ B).
- [ ] Pruebas manuales en Chrome, Firefox, Safari y mobile.
- [ ] Test de los 14 criterios de aceptación.

**Deploy**
- [ ] Variables de entorno cargadas en EasyPanel.
- [ ] Dominio configurado, HTTPS activo, redirección HTTP→HTTPS.
- [ ] Auto-deploy desde `main` activo.
- [ ] Health check apuntando a `/api/health`.
- [ ] Rollback probado al menos una vez.

**Post-deploy**
- [ ] Envío real del formulario verificado en la plataforma del webhook.
- [ ] Logs revisados durante 24-48 h.
- [ ] Handover al cliente firmado.
- [ ] Política de actualización de dependencias acordada.

---

*Fin de la Especificación Técnica v1.0 — Web Antartida Labs.*
