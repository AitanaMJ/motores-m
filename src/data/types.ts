import type { ImageFocus } from '../lib/images';

export type Brand =
  | 'BMW'
  | 'Audi'
  | 'Mercedes-Benz'
  | 'Porsche'
  | 'Volkswagen'
  | 'Toyota'
  | 'Ford'
  | 'Tesla';

export type Fuel = 'Nafta' | 'Diésel' | 'Híbrido' | 'Eléctrico';
export type Transmission = 'Automática' | 'Manual';
export type BodyType = 'Coupé' | 'Sedán' | 'SUV' | 'Hatchback' | 'Familiar';
export type VehicleStatus = 'Disponible' | 'Reservado' | 'Nuevo ingreso';

export interface VehicleImage {
  /** ID de la foto en Unsplash */
  photoId: string;
  alt: string;
  /** Encuadre de detalle sobre la misma fotografía */
  focus?: ImageFocus;
}

export interface EquipmentGroup {
  group: 'Confort' | 'Seguridad' | 'Tecnología' | 'Performance';
  items: string[];
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: Brand;
  model: string;
  version: string;
  year: number;
  /** Precio de ejemplo en pesos argentinos */
  price: number;
  km: number;
  fuel: Fuel;
  transmission: Transmission;
  gearbox: string;
  body: BodyType;
  /** Potencia en CV */
  power: number;
  engine: string;
  drivetrain: string;
  color: string;
  doors: number;
  status: VehicleStatus;
  featured: boolean;
  tagline: string;
  description: string;
  equipment: EquipmentGroup[];
  images: VehicleImage[];
}
