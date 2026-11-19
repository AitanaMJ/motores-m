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

ogramming.
