import { useState, type CSSProperties } from 'react';
import { CarFront } from 'lucide-react';
import { unsplashSrcSet, unsplashUrl, type ImageFocus } from '../lib/images';

interface SmartImageProps {
  photoId: string;
  alt: string;
  /** Proporción alto/ancho del recorte solicitado al CDN (ej.: 0.625 = 16:10) */
  ratio?: number;
  sizes?: string;
  focus?: ImageFocus;
  eager?: boolean;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  widths?: number[];
  /** Atributos data-* para animaciones (ej.: parallax) */
  parallax?: number;
}

/**
 * Imagen remota con carga diferida, srcset responsive y fallback visual
 * si la fotografía no carga. El contenedor define el tamaño (evita layout shift).
 */
export function SmartImage({
  photoId,
  alt,
  ratio,
  sizes = '100vw',
  focus,
  eager = false,
  className = '',
  imgClassName = '',
  style,
  widths,
  parallax,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-graphite ${className}`} style={style}>
      {status !== 'error' ? (
        <img
          src={unsplashUrl(photoId, { w: 1440, h: ratio ? Math.round(1440 * ratio) : undefined, focus })}
          srcSet={unsplashSrcSet(photoId, ratio, widths, focus)}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          data-parallax={parallax}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' || eager ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      ) : (
        <div role="img" aria-label={`${alt} (imagen no disponible)`} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-graphite text-steel">
          <div aria-hidden className="absolute inset-0 hairline-grid opacity-60" />
          <CarFront aria-hidden className="relative size-10 text-lime/70" strokeWidth={1.25} />
          <span className="eyebrow relative">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}
