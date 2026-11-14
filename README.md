# MOTORES M. — Concesionaria premium (demo)

Sitio de demostración de una concesionaria automotriz **ficticia**, desarrollado por **GAP Programming**.
Identidad visual *Midnight Lime*: negro petróleo, lima eléctrico, grafito, blanco hielo y gris secundario, con tipografías Bebas Neue (títulos) e Inter (texto).

> Todo el contenido es de demostración: marcas y modelos reales se usan solo como datos de ejemplo, sin relación comercial. Precios, kilometrajes, testimonios, estadísticas e historia de la marca son ficticios. Los formularios **no envían datos** y la calculadora es **orientativa**.

## Stack

- React 19 + Vite 6 + TypeScript (strict)
- Tailwind CSS 4 (plugin `@tailwindcss/vite`, tokens en `src/index.css`)
- GSAP 3 + ScrollTrigger (animaciones, con `gsap.matchMedia` y soporte de `prefers-reduced-motion`)
- React Router 7 (rutas con carga diferida por página)
- Lucide React (iconos)
- Vitest (pruebas unitarias de filtros y cálculos)

Sin backend ni base de datos: los datos están tipados en `src/data/`.

## Requisitos

- Node.js 20 o superior (probado con Node 22.18 y npm 10.9)

## Cómo ejecutarlo

```bash
npm install
npm run dev        # servidor de desarrollo → http://localhost:5173
npm test           # pruebas unitarias (filtros, ordenamiento, URL, financiación)
npm run build      # chequeo de tipos + build de producción en dist/
npm run preview    # sirve el build de producción → http://localhost:4173
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio: hero, buscador, destacados (carrusel), editorial, beneficios, tasación, cifras demo, testimonios demo, CTA |
| `/catalogo` | Catálogo con filtros combinables, búsqueda, orden y sincronización con la URL |
| `/vehiculos/:slug` | Detalle: galería, ficha técnica, equipamiento, relacionados y consulta demo |
| `/vende-tu-auto` | Proceso de venta y formulario de tasación demo |
| `/financiacion` | Contenido informativo y simulador de cuotas (sistema francés) |
| `/nosotros` | Historia ficticia, valores |
| `/contacto` | Formulario de contacto demo |
| `*` | Página 404 (también para slugs inexistentes) |

### Parámetros de URL del catálogo

`q`, `marca`, `modelo`, `precioMax`, `anioDesde`, `combustible`, `transmision`, `kmMax`, `orden` (`precio-asc`, `precio-desc`, `anio-desc`, `km-asc`).
Ejemplo: `/catalogo?marca=Porsche&precioMax=300000000&orden=precio-asc`

`/financiacion?capital=50000000` precarga el capital (lo usa el botón "Simular financiación" de cada ficha).

## Estructura

```
src/
  components/   Header, Footer, Layout, SmartImage, VehicleCard, VehicleSearch,
                FeaturedCarousel, PageHero, ui (botones, campos, avisos)
  pages/        Home, Catalog, VehicleDetail, SellCar, Financing, About, Contact, NotFound
  data/         types.ts, vehicles.ts (12 unidades), content.ts
  hooks/        useScrollAnimations (revelados, parallax, contadores), usePageMeta (SEO)
  lib/          filters, finance, validation, format, images, gsap (+ *.test.ts)
```

## Imágenes

Fotografías remotas de Unsplash, verificadas (respuesta HTTP 200 y revisión visual) y servidas con `srcset` responsive. Fuera del hero se cargan de forma diferida (`loading="lazy"`). Si una imagen falla, `SmartImage` muestra un fallback visual con el aviso "Imagen no disponible". Las galerías combinan la foto principal con encuadres de detalle de la misma fotografía.

## Fórmula de la calculadora

Sistema francés: `cuota = C × i ÷ (1 − (1 + i)^−n)`, con `i = TNA ÷ 12 ÷ 100`. Con tasa 0, `cuota = C ÷ n`. No incluye IVA sobre intereses, seguros, gastos ni impuestos.

## Despliegue en Netlify

El archivo `netlify.toml` ya define:

- comando de build `npm run build` y carpeta de publicación `dist`
- redirección SPA `/* → /index.html (200)` para que React Router resuelva todas las rutas
- caché de larga duración para `/assets/*`

Para desplegar: conectar el repositorio en Netlify (o `netlify deploy` con la CLI). No requiere variables de entorno.

---

Demo desarrollada por GAP Programming.
