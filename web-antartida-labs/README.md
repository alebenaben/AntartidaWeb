# Antartida Labs - Web Institucional

Este es el repositorio para la página web institucional de **Antartida Labs**. Está construida siguiendo las especificaciones técnicas solicitadas, utilizando **Next.js 14**, **Tailwind CSS**, y **TypeScript**.

## Tecnologías Principales

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** lucide-react
- **Formulario y Validación:** React Hook Form + Zod
- **Despliegue:** Preparado para EasyPanel y VPS vía Docker

## Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 20 LTS o superior
- npm o pnpm

### Pasos

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd web-antartida-labs
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia `.env.example` a `.env.local`
   - Configura las variables necesarias (principalmente `CONTACT_WEBHOOK_URL` para probar el formulario).

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Configuración y Variables de Entorno

- `CONTACT_WEBHOOK_URL` (Requerido): URL destino para los envíos del formulario de contacto.
- `CONTACT_WEBHOOK_SECRET`: Token opcional a incluir en los headers (X-Webhook-Secret) si la plataforma destino lo requiere.
- `NEXT_PUBLIC_SITE_URL`: URL canónica para generación de sitemap y SEO.
- `IP_HASH_SALT` (Requerido en prod): String para ofuscar las IPs de los visitantes en los logs.
- `RATE_LIMIT_MAX` y `RATE_LIMIT_WINDOW_MS`: Configuración del límite de envíos por IP.

## Instrucciones de Despliegue en EasyPanel (VPS Ubuntu)

El proyecto está diseñado para funcionar en un VPS Ubuntu utilizando **EasyPanel**.

### Opción 1: Desde GitHub (Recomendado)

1. En tu panel de EasyPanel, ve a **Create App** > **From GitHub**.
2. Conecta tu cuenta y selecciona este repositorio.
3. Configura la aplicación:
   - **Build path:** `/`
   - **Build method:** Selecciona `Dockerfile` (el archivo ya se incluye en la raíz).
   - **Port:** `3000`.
   - **Health check path:** `/api/health`
4. Pestaña **Environment**: Agrega todas las variables definidas en `.env.example`.
5. Pestaña **Domains**: Agrega tu dominio (ej. `antartidalabs.com`) y habilita HTTPS (Let's Encrypt).
6. Activa el **Auto Deploy** para desplegar automáticamente al pushear a `main`.
7. Haz clic en **Deploy**.

### Opción 2: Imagen Docker Manual
1. Construye la imagen: `docker build -t web-antartida-labs .`
2. Súbela a tu registry (Docker Hub, GHCR, etc.).
3. Despliégala en EasyPanel seleccionando "From Docker Image".

## Supuestos y Decisiones Técnicas
- **Despliegue Standalone:** Se habilitó `output: 'standalone'` en la configuración de Next.js. El Dockerfile lo utiliza para reducir sustancialmente el peso final de la imagen en producción.
- **Formulario y Seguridad:** Se implementó Rate Limiting básico (en memoria) que soporta un despliegue de instancia única. Además se incluyó un honeypot para mitigar el spam de bots básicos.
- **Node Environment:** Se requiere Node 20+; el Dockerfile está configurado con `node:20-alpine`.
- **Assets Gráficos:** Para que el despliegue final esté 100% listo, se deben subir las versiones finales del logotipo (SVG, PNG) en la carpeta `/public` y el `og-image.png`.
