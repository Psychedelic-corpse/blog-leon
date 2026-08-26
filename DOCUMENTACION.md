# 📖 Documentación del Blog · Leon Di Monte (Ready)

Este documento reúne toda la información técnica, configuración, credenciales públicas y comandos del proyecto para futuras modificaciones.

---

## 🌐 Enlaces y Servicios Vinculados

* **Dominio Principal:** [https://leondm.com](https://leondm.com) (DNS gestionado en Cloudflare, desplegado en Vercel)
* **Panel de Redacción (Sanity Studio):** [https://leondm.sanity.studio](https://leondm.sanity.studio)
* **Repositorio en GitHub:** [https://github.com/Psychedelic-corpse/blog-leon](https://github.com/Psychedelic-corpse/blog-leon)
* **Sanity Dashboard:** [https://manage.sanity.io/](https://manage.sanity.io/)
  * **Project ID:** Configurado vía variable de entorno (`NEXT_PUBLIC_SANITY_PROJECT_ID`)
  * **Dataset:** `production` (o el dataset configurado)

---

## 🏗️ Estructura del Monorepo (Turborepo + pnpm)

```text
~/blog/
├── apps/
│   ├── web/                     # Frontend Next.js 15 (App Router + Tailwind CSS)
│   │   ├── app/
│   │   │   ├── page.tsx         # Portada minimalista con escritos recientes
│   │   │   ├── blog/page.tsx    # Archivo completo de escritos con paginación
│   │   │   ├── blog/[slug]/     # Plantilla de lectura individual
│   │   │   ├── layout.tsx       # Configuración global, fuentes y metadatos SEO
│   │   │   └── sitemap.xml/     # Mapa del sitio para indexación en Google
│   │   ├── components/          # Componentes reutilizables (Header, Footer, ThemeProvider)
│   │   └── sanity/              # Conexión al cliente de Sanity (useCdn: false)
│   │
│   └── studio/                  # Panel CMS de Sanity Studio v3
│       ├── schemaTypes/         # Esquemas de datos (post, author, category, blockContent)
│       ├── sanity.config.ts     # Configuración del Studio
│       └── sanity.cli.ts        # Configuración de despliegue a leondm.sanity.studio
│
└── packages/                    # Paquetes compartidos (UI, ESLint, TypeScript config)
```

---

## ⚡ Comandos Útiles

### 1. Iniciar en desarrollo local
Para probar la web y el panel en tu máquina:
```bash
cd ~/blog
pnpm dev
```
* Web: `http://localhost:3000`
* Studio: `http://localhost:3333`

### 2. Compilar el proyecto (Build)
Para verificar que no haya errores de TypeScript ni compilación:
```bash
cd ~/blog
pnpm build
```

### 3. Actualizar el panel de Sanity en la nube
Si en el futuro agregas nuevos campos o tipos de contenido en `apps/studio`:
```bash
cd ~/blog/apps/studio
pnpm run deploy
```

---

## ⚙️ Variables de Entorno Requeridas

En `apps/web/.env.local` y en **Vercel (Settings > Environment Variables)**:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_aqui
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## 🛡️ Seguridad y CORS (Sanity)

Si agregas nuevos dominios o subdominios, asegúrate de habilitarlos en **Sanity Dashboard > API > CORS Origins**:
* `http://localhost:3000`
* `https://leondm.com`
* `https://www.leondm.com`
* `https://*.vercel.app`
