/** Utilidades para fotografías remotas de Unsplash (CDN imgix). */
const BASE = 'https://images.unsplash.com/photo-';

export interface ImageFocus {
  /** Punto focal horizontal 0–1 */
  x: number;
  /** Punto focal vertical 0–1 */
  y: number;
  /** Zoom sobre el punto focal (1 = sin zoom) */
  zoom: number;
}

export interface ImgOptions {
  w?: number;
  h?: number;
  q?: number;
  focus?: ImageFocus;
}

export function unsplashUrl(id: string, { w = 1200, h, q = 72, focus }: ImgOptions = {}): string {
  const p = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(w), q: String(q) });
  if (h) p.set('h', String(h));
  if (focus) {
    p.set('crop', 'focalpoint');
    p.set('fp-x', String(focus.x));
    p.set('fp-y', String(focus.y));
    p.set('fp-z', String(focus.zoom));
  }
  return `${BASE}${id}?${p.toString()}`;
}

/** Genera un srcset respetando la proporción indicada (ratio = alto / ancho). */
export function unsplashSrcSet(
  id: string,
  ratio: number | undefined,
  widths: number[] = [480, 768, 1080, 1440, 1920],
  focus?: ImageFocus,
): string {
  return widths
    .map((w) => `${unsplashUrl(id, { w, h: ratio ? Math.round(w * ratio) : undefined, focus })} ${w}w`)
    .join(', ');
}

/** Fotografías editoriales verificadas (respuesta 200 y revisión visual). */
export const PHOTOS = {
  hero: '1485291571150-772bcfc10da5',
  road: '1568605117036-5fe5e7bab0b7',
  workshop: '1615906655593-ad0386982a0f',
  sellHero: '1556189250-72ba954cfc2b',
  financeHero: '1620891549027-942fdc95d3f5',
  aboutHero: '1590362891991-f776e747a588',
  garage: '1626668893632-6f3a4466d22f',
  contactHero: '1493238792000-8113da705763',
} as const;
