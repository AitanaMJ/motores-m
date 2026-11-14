import type { Brand, Fuel, Transmission, Vehicle, VehicleImage } from './types';

/**
 * Catálogo de DEMOSTRACIÓN.
 * Marcas y modelos reales se usan solo como datos de ejemplo: precios, kilometrajes,
 * estados y descripciones son ficticios. Las fotografías son ilustrativas (Unsplash)
 * y pueden no corresponder exactamente a la versión descripta.
 */

function gallery(name: string, main: string, extra: string[] = []): VehicleImage[] {
  return [
    { photoId: main, alt: `${name} — vista principal (imagen ilustrativa)` },
    ...extra.map((photoId, i) => ({ photoId, alt: `${name} — vista ${i + 2} (imagen ilustrativa)` })),
    {
      photoId: main,
      alt: `${name} — detalle de frente y óptica (imagen ilustrativa)`,
      focus: { x: 0.38, y: 0.58, zoom: 1.7 },
    },
    {
      photoId: main,
      alt: `${name} — detalle de llanta y perfil (imagen ilustrativa)`,
      focus: { x: 0.64, y: 0.66, zoom: 1.8 },
    },
  ];
}

export const vehicles: Vehicle[] = [
  {
    id: 'v01',
    slug: 'porsche-911-turbo-s-2021',
    brand: 'Porsche',
    model: '911',
    version: 'Turbo S',
    year: 2021,
    price: 489_000_000,
    km: 18_500,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'PDK de doble embrague, 8 marchas',
    body: 'Coupé',
    power: 650,
    engine: '3.8 L bóxer 6 cilindros biturbo',
    drivetrain: 'Integral',
    color: 'Plata GT',
    doors: 2,
    status: 'Disponible',
    featured: true,
    tagline: 'El ícono, en su versión más radical.',
    description:
      'Un 911 Turbo S con uso cuidado y servicios al día. Entrega una aceleración brutal sin resignar confort para el día a día. Tapizado en cuero bicolor, escape deportivo y paquete Sport Chrono. Unidad de demostración: los datos son ilustrativos.',
    equipment: [
      { group: 'Performance', items: ['Sport Chrono con modos de manejo', 'Escape deportivo', 'Eje trasero direccional', 'Frenos cerámicos PCCB'] },
      { group: 'Confort', items: ['Butacas deportivas Plus con memoria', 'Climatizador bizona', 'Tapizado en cuero bicolor'] },
      { group: 'Tecnología', items: ['Pantalla táctil de 10,9"', 'Apple CarPlay', 'Audio BOSE Surround'] },
      { group: 'Seguridad', items: ['Control de crucero adaptativo', 'Cámara de retroceso', 'Faros LED Matrix'] },
    ],
    images: gallery('Porsche 911 Turbo S', '1594502184342-2e12f877aa73'),
  },
  {
    id: 'v02',
    slug: 'bmw-m4-competition-2022',
    brand: 'BMW',
    model: 'M4',
    version: 'Competition Coupé',
    year: 2022,
    price: 239_000_000,
    km: 12_400,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'M Steptronic de 8 marchas',
    body: 'Coupé',
    power: 510,
    engine: '3.0 L 6 cilindros en línea biturbo',
    drivetrain: 'Trasera',
    color: 'Rojo Toronto',
    doors: 2,
    status: 'Disponible',
    featured: true,
    tagline: 'Precisión de pista para cada día.',
    description:
      'M4 Competition en un rojo que no pasa desapercibido. Chasis adaptativo, butacas M Carbon y un seis cilindros que responde con contundencia en todo el rango. Precio y kilometraje de ejemplo.',
    equipment: [
      { group: 'Performance', items: ['Diferencial M activo', 'Suspensión adaptativa M', 'Modos M1 / M2 configurables'] },
      { group: 'Confort', items: ['Butacas M Carbon', 'Climatizador trizona', 'Acceso sin llave'] },
      { group: 'Tecnología', items: ['BMW Live Cockpit Professional', 'Head-up display', 'Audio Harman Kardon'] },
      { group: 'Seguridad', items: ['Asistente de estacionamiento', 'Alerta de cambio de carril', 'Faros Laserlight'] },
    ],
    images: gallery('BMW M4 Competition', '1617531653332-bd46c24f2068'),
  },
  {
    id: 'v03',
    slug: 'audi-rs6-avant-2021',
    brand: 'Audi',
    model: 'RS 6',
    version: 'Avant quattro',
    year: 2021,
    price: 285_000_000,
    km: 22_000,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'Tiptronic de 8 marchas',
    body: 'Familiar',
    power: 600,
    engine: '4.0 L V8 TFSI biturbo',
    drivetrain: 'Integral quattro',
    color: 'Negro Mythos',
    doors: 5,
    status: 'Disponible',
    featured: true,
    tagline: 'Espacio familiar, alma de superdeportivo.',
    description:
      'La rural más rápida del catálogo. Practicidad total con un V8 de 600 CV, suspensión neumática y tracción quattro para cualquier condición. Unidad ficticia con fines de demostración.',
    equipment: [
      { group: 'Performance', items: ['Suspensión neumática adaptativa', 'Diferencial deportivo quattro', 'Escape RS'] },
      { group: 'Confort', items: ['Butacas RS con masaje', 'Techo panorámico', 'Portón eléctrico'] },
      { group: 'Tecnología', items: ['Audi virtual cockpit plus', 'MMI con doble pantalla', 'Audio Bang & Olufsen'] },
      { group: 'Seguridad', items: ['Visión nocturna', 'Cámaras 360°', 'Faros HD Matrix LED'] },
    ],
    images: gallery('Audi RS 6 Avant', '1606664515524-ed2f786a0bd6'),
  },
  {
    id: 'v04',
    slug: 'mercedes-amg-gt-r-2019',
    brand: 'Mercedes-Benz',
    model: 'AMG GT',
    version: 'R',
    year: 2019,
    price: 342_000_000,
    km: 15_800,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'AMG Speedshift DCT de 7 marchas',
    body: 'Coupé',
    power: 585,
    engine: '4.0 L V8 biturbo',
    drivetrain: 'Trasera',
    color: 'Gris Selenita',
    doors: 2,
    status: 'Disponible',
    featured: true,
    tagline: 'Nacido en el circuito.',
    description:
      'Un GT R con historia de cuidado obsesivo. Aerodinámica activa, eje trasero direccional y un V8 frontal-central que suena como pocos. Datos de ejemplo para la demo.',
    equipment: [
      { group: 'Performance', items: ['Control de tracción AMG de 9 niveles', 'Aerodinámica activa', 'Eje trasero direccional'] },
      { group: 'Confort', items: ['Butacas AMG Performance', 'Volante AMG en microfibra', 'Climatizador automático'] },
      { group: 'Tecnología', items: ['Track Pace AMG', 'Audio Burmester', 'Navegador integrado'] },
      { group: 'Seguridad', items: ['Frenos carbocerámicos', 'Sensores de estacionamiento', 'Cámara de retroceso'] },
    ],
    images: gallery('Mercedes-AMG GT R', '1618843479313-40f8afb4b4d8'),
  },
  {
    id: 'v05',
    slug: 'ford-mustang-gt-2020',
    brand: 'Ford',
    model: 'Mustang',
    version: 'GT 5.0 V8',
    year: 2020,
    price: 118_000_000,
    km: 24_000,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'Automática de 10 marchas',
    body: 'Coupé',
    power: 459,
    engine: '5.0 L V8 Coyote',
    drivetrain: 'Trasera',
    color: 'Negro Sombra',
    doors: 2,
    status: 'Nuevo ingreso',
    featured: true,
    tagline: 'Un V8 atmosférico. Sin pedir permiso.',
    description:
      'El muscle car por excelencia. V8 de 5 litros, escape activo y una presencia que se impone. Recién ingresado al stock de demostración, con datos ilustrativos.',
    equipment: [
      { group: 'Performance', items: ['Escape activo de válvulas', 'Line Lock y Launch Control', 'Diferencial autoblocante'] },
      { group: 'Confort', items: ['Butacas calefaccionadas y ventiladas', 'Acceso y arranque sin llave'] },
      { group: 'Tecnología', items: ['Tablero digital de 12"', 'SYNC 3 con Apple CarPlay', 'Audio B&O'] },
      { group: 'Seguridad', items: ['8 airbags', 'Alerta de punto ciego', 'Frenado autónomo de emergencia'] },
    ],
    images: gallery('Ford Mustang GT', '1494976388531-d1058494cdd8', ['1611016186353-9af58c69a533']),
  },
  {
    id: 'v06',
    slug: 'tesla-model-3-long-range-2021',
    brand: 'Tesla',
    model: 'Model 3',
    version: 'Long Range AWD',
    year: 2021,
    price: 95_000_000,
    km: 36_000,
    fuel: 'Eléctrico',
    transmission: 'Automática',
    gearbox: 'Reductora de una velocidad',
    body: 'Sedán',
    power: 440,
    engine: 'Doble motor eléctrico',
    drivetrain: 'Integral',
    color: 'Blanco Perla',
    doors: 4,
    status: 'Disponible',
    featured: true,
    tagline: 'Potencia silenciosa.',
    description:
      'Sedán eléctrico con doble motor y tracción integral. Interior minimalista, actualizaciones de software y un torque instantáneo que sorprende. Autonomía y precio expresados solo como ejemplo.',
    equipment: [
      { group: 'Performance', items: ['Tracción integral de doble motor', 'Modo de aceleración rápida'] },
      { group: 'Confort', items: ['Techo de vidrio completo', 'Butacas calefaccionadas', 'Climatizador con filtro HEPA'] },
      { group: 'Tecnología', items: ['Pantalla central de 15"', 'Llave mediante teléfono', 'Actualizaciones remotas'] },
      { group: 'Seguridad', items: ['Piloto automático básico', '8 cámaras perimetrales', 'Modo centinela'] },
    ],
    images: gallery('Tesla Model 3 Long Range', '1560958089-b8a1929cea89', ['1606016159991-dfe4f2746ad5']),
  },
  {
    id: 'v07',
    slug: 'porsche-panamera-4-2020',
    brand: 'Porsche',
    model: 'Panamera',
    version: '4 Sport Design',
    year: 2020,
    price: 268_000_000,
    km: 32_000,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'PDK de 8 marchas',
    body: 'Sedán',
    power: 330,
    engine: '2.9 L V6 biturbo',
    drivetrain: 'Integral',
    color: 'Negro Jet',
    doors: 5,
    status: 'Disponible',
    featured: false,
    tagline: 'Gran turismo para cuatro.',
    description:
      'Panamera 4 con paquete Sport Design: confort de limusina con el ADN deportivo de Porsche. Ideal para viajes largos con estilo. Información de ejemplo.',
    equipment: [
      { group: 'Performance', items: ['Suspensión neumática PASM', 'Sport Chrono'] },
      { group: 'Confort', items: ['Butacas traseras individuales', 'Climatizador de 4 zonas', 'Cierre asistido de puertas'] },
      { group: 'Tecnología', items: ['Porsche Communication Management', 'Audio BOSE'] },
      { group: 'Seguridad', items: ['Asistente de mantenimiento de carril', 'Cámara 360°', 'Faros LED Matrix'] },
    ],
    images: gallery('Porsche Panamera 4', '1503376780353-7e6692767b70', ['1584060622420-0673aad46076']),
  },
  {
    id: 'v08',
    slug: 'bmw-m5-xdrive-2019',
    brand: 'BMW',
    model: 'M5',
    version: 'xDrive',
    year: 2019,
    price: 176_000_000,
    km: 41_000,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: 'M Steptronic de 8 marchas',
    body: 'Sedán',
    power: 600,
    engine: '4.4 L V8 biturbo',
    drivetrain: 'Integral M xDrive',
    color: 'Blanco Alpino',
    doors: 4,
    status: 'Reservado',
    featured: false,
    tagline: 'El ejecutivo que esconde un V8.',
    description:
      'Sedán de lujo con prestaciones de superdeportivo. El sistema M xDrive permite elegir entre tracción integral o trasera pura. Unidad reservada en esta demo.',
    equipment: [
      { group: 'Performance', items: ['M xDrive con modo 2WD', 'Escape deportivo M', 'Frenos M Compound'] },
      { group: 'Confort', items: ['Butacas M multifunción', 'Techo solar', 'Cortinas traseras eléctricas'] },
      { group: 'Tecnología', items: ['iDrive con navegador', 'Head-up display', 'Audio Bowers & Wilkins'] },
      { group: 'Seguridad', items: ['Driving Assistant Plus', 'Cámara de visión nocturna'] },
    ],
    images: gallery('BMW M5 xDrive', '1555215695-3004980ad54e'),
  },
  {
    id: 'v09',
    slug: 'audi-q5-40-tdi-2020',
    brand: 'Audi',
    model: 'Q5',
    version: '40 TDI quattro',
    year: 2020,
    price: 89_500_000,
    km: 58_000,
    fuel: 'Diésel',
    transmission: 'Automática',
    gearbox: 'S tronic de 7 marchas',
    body: 'SUV',
    power: 204,
    engine: '2.0 L TDI turbodiésel',
    drivetrain: 'Integral quattro',
    color: 'Blanco Glaciar',
    doors: 5,
    status: 'Nuevo ingreso',
    featured: false,
    tagline: 'Versatilidad premium para todo terreno.',
    description:
      'SUV mediano con motor diésel eficiente y tracción quattro. Amplio, silencioso y muy bien equipado para la familia. Datos de ejemplo.',
    equipment: [
      { group: 'Confort', items: ['Portón eléctrico con sensor', 'Climatizador trizona', 'Butacas calefaccionadas'] },
      { group: 'Tecnología', items: ['Audi virtual cockpit', 'Carga inalámbrica', 'Apple CarPlay y Android Auto'] },
      { group: 'Seguridad', items: ['Control de crucero adaptativo', 'Cámara de retroceso', 'Pre sense city'] },
    ],
    images: gallery('Audi Q5 40 TDI', '1517524008697-84bbe3c3fd98'),
  },
  {
    id: 'v10',
    slug: 'toyota-rav4-hybrid-2022',
    brand: 'Toyota',
    model: 'RAV4',
    version: 'Hybrid Limited AWD',
    year: 2022,
    price: 72_400_000,
    km: 28_500,
    fuel: 'Híbrido',
    transmission: 'Automática',
    gearbox: 'e-CVT',
    body: 'SUV',
    power: 222,
    engine: '2.5 L nafta + motores eléctricos',
    drivetrain: 'Integral AWD-i',
    color: 'Gris Plata',
    doors: 5,
    status: 'Disponible',
    featured: false,
    tagline: 'Eficiencia híbrida, confianza total.',
    description:
      'El SUV híbrido que combina bajo consumo urbano con tracción integral inteligente. Excelente equipamiento de seguridad. Unidad ficticia.',
    equipment: [
      { group: 'Confort', items: ['Tapizado de cuero', 'Butacas delanteras eléctricas', 'Portón eléctrico'] },
      { group: 'Tecnología', items: ['Pantalla táctil de 9"', 'Cargador inalámbrico', 'Audio JBL'] },
      { group: 'Seguridad', items: ['Toyota Safety Sense', '7 airbags', 'Monitor de punto ciego'] },
    ],
    images: gallery('Toyota RAV4 Hybrid', '1617469767053-d3b523a0b982'),
  },
  {
    id: 'v11',
    slug: 'mercedes-benz-cla-250-2017',
    brand: 'Mercedes-Benz',
    model: 'CLA',
    version: '250 AMG Line',
    year: 2017,
    price: 46_900_000,
    km: 63_000,
    fuel: 'Nafta',
    transmission: 'Automática',
    gearbox: '7G-DCT de doble embrague',
    body: 'Sedán',
    power: 211,
    engine: '2.0 L turbo',
    drivetrain: 'Delantera',
    color: 'Gris Montaña',
    doors: 4,
    status: 'Disponible',
    featured: false,
    tagline: 'Silueta coupé, practicidad de sedán.',
    description:
      'CLA 250 con paquete estético AMG Line. Diseño fluido, buen equipamiento y un motor turbo ágil. Una puerta de entrada al mundo premium. Información de demostración.',
    equipment: [
      { group: 'Confort', items: ['Butacas deportivas', 'Climatizador automático', 'Iluminación ambiental'] },
      { group: 'Tecnología', items: ['Pantalla de 8"', 'Navegador', 'Audio Harman Kardon'] },
      { group: 'Seguridad', items: ['Asistente de frenado activo', 'Sensores de estacionamiento'] },
    ],
    images: gallery('Mercedes-Benz CLA 250', '1570733577524-3a047079e80d'),
  },
  {
    id: 'v12',
    slug: 'volkswagen-golf-gti-2013',
    brand: 'Volkswagen',
    model: 'Golf',
    version: 'GTI 2.0 TSI',
    year: 2013,
    price: 26_900_000,
    km: 89_000,
    fuel: 'Nafta',
    transmission: 'Manual',
    gearbox: 'Manual de 6 marchas',
    body: 'Hatchback',
    power: 211,
    engine: '2.0 L TSI turbo',
    drivetrain: 'Delantera',
    color: 'Negro Profundo',
    doors: 5,
    status: 'Disponible',
    featured: false,
    tagline: 'El hot hatch que definió una categoría.',
    description:
      'Golf GTI con caja manual de seis marchas para quienes disfrutan manejar. Tapizado tartán clásico, mantenimiento documentado (dato ilustrativo) y un equilibrio perfecto entre uso diario y diversión.',
    equipment: [
      { group: 'Performance', items: ['Diferencial electrónico XDS', 'Suspensión deportiva', 'Llantas de 18"'] },
      { group: 'Confort', items: ['Tapizado tartán', 'Climatizador bizona', 'Volante multifunción'] },
      { group: 'Seguridad', items: ['6 airbags', 'Control de estabilidad', 'Sensores de estacionamiento'] },
    ],
    images: gallery('Volkswagen Golf GTI', '1471444928139-48c5bf5173f8'),
  },
];

export const BRANDS: Brand[] = ['Audi', 'BMW', 'Ford', 'Mercedes-Benz', 'Porsche', 'Tesla', 'Toyota', 'Volkswagen'];
export const FUELS: Fuel[] = ['Nafta', 'Diésel', 'Híbrido', 'Eléctrico'];
export const TRANSMISSIONS: Transmission[] = ['Automática', 'Manual'];

export const PRICE_OPTIONS = [30_000_000, 50_000_000, 100_000_000, 150_000_000, 250_000_000, 350_000_000];
export const KM_OPTIONS = [15_000, 30_000, 50_000, 75_000, 100_000];

export function getYearOptions(list: Vehicle[] = vehicles): number[] {
  return [...new Set(list.map((v) => v.year))].sort((a, b) => b - a);
}

export function getModelsByBrand(brand: string, list: Vehicle[] = vehicles): string[] {
  return [...new Set(list.filter((v) => !brand || v.brand === brand).map((v) => v.model))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function getVehicleBySlug(slug: string | undefined): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

/** Relacionados: misma carrocería o marca primero, luego precio más cercano. */
export function getRelatedVehicles(vehicle: Vehicle, count = 3, list: Vehicle[] = vehicles): Vehicle[] {
  return list
    .filter((v) => v.id !== vehicle.id)
    .map((v) => {
      let score = Math.abs(v.price - vehicle.price) / vehicle.price;
      if (v.body === vehicle.body) score -= 1;
      if (v.brand === vehicle.brand) score -= 0.6;
      return { v, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ v }) => v);
}
