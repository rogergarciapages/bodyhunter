import { CaseData } from '../types/case';

export const MARTA_DEL_CASTILLO_CASE: CaseData = {
  id: 'marta-del-castillo-2009',
  name: 'Marta del Castillo',
  description: 'Análisis geoespacial de movilidad, radios de transporte e hipótesis testimoniales (Sevilla, 2009).',
  status: 'JUDICIAL_OPEN',
  createdAt: '2009-01-24T00:00:00.000Z',
  anchorPoints: [
    {
      id: 'anchor-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      label: 'Escena del Crimen (Calle León XIII, Bajo C)',
      type: 'CRIME_SCENE',
      lat: 37.4042,
      lng: -5.9861,
      weight: 1.0,
      notes: 'Piso donde ocurrieron los hechos según la sentencia judicial firme. Nodo de origen para todas las hipótesis de traslado.',
      sourceRef: 'Sentencia de la Audiencia Provincial de Sevilla (Sección 7ª)'
    },
    {
      id: 'anchor-marta-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Domicilio de Marta (Tartessos / San Carlos)',
      type: 'HOME',
      lat: 37.3995,
      lng: -5.9721,
      weight: 0.7,
      notes: 'Domicilio habitual de Marta del Castillo y punto de partida a las 17:30h en ciclomotor.',
      sourceRef: 'Sumario judicial'
    },
    {
      id: 'anchor-miguel-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Domicilio de Miguel Carcaño (Camas)',
      type: 'HOME',
      lat: 37.4011,
      lng: -6.0335,
      weight: 0.8,
      notes: 'Vivienda de la pareja de Miguel Carcaño en Camas. Nodo de conexión metropolitana frecuente.',
      sourceRef: 'Declaraciones e informes de antenas'
    },
    {
      id: 'anchor-dseda',
      caseId: 'marta-del-castillo-2009',
      label: 'Bar DSeda (Distrito Macarena)',
      type: 'LEISURE',
      lat: 37.3958,
      lng: -5.9812,
      weight: 0.5,
      notes: 'Lugar de reunión mencionado en declaraciones durante la madrugada del 25 de enero.',
      sourceRef: 'Testimonios en sala judicial'
    },
    {
      id: 'anchor-samuel-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Entorno de Samuel Benítez (Montequinto / Sevilla)',
      type: 'OTHER',
      lat: 37.3920,
      lng: -5.9780,
      weight: 0.4,
      notes: 'Punto ancla de desplazamientos durante las horas posteriores a los hechos.',
      sourceRef: 'Declaraciones de instrucción'
    }
  ],
  timelineEvents: [
    {
      id: 'event-recogida',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T17:30:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Marta sale de su casa en San Carlos y es recogida por Miguel Carcaño en su ciclomotor.',
      personsInvolved: ['Marta del Castillo', 'Miguel Carcaño'],
      locationRefId: 'anchor-marta-home',
      sourceRef: 'Testimonio de familiares / Sumario',
      versionId: 'judicial'
    },
    {
      id: 'event-crimen-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T20:28:00.000Z',
      timeConfidence: 'confirmed',
      description: 'Llegada y agresión en el piso de la calle León XIII. Hora fijada por posicionamiento telefónico.',
      personsInvolved: ['Marta del Castillo', 'Miguel Carcaño'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Informes periciales de telefonía móvil',
      versionId: 'judicial'
    },
    {
      id: 'event-traslado-sentencia',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T21:45:00.000Z',
      timeConfidence: 'confirmed',
      description: 'Ventana de traslado del cuerpo establecida en sentencia: entre las 21:00h y las 22:15h a bordo de un vehículo de 4 ruedas.',
      personsInvolved: ['Miguel Carcaño', 'Terceros no determinados'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Sentencia firme Audiencia Provincial de Sevilla',
      versionId: 'judicial'
    },
    {
      id: 'event-version-rio',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T22:30:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Versión 1 (Feb 2009): Declaración confesional inicial de arrojamiento al río Guadalquivir desde la pasarela.',
      personsInvolved: ['Miguel Carcaño', 'Samuel Benítez'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Primera declaración confesional (13 Feb 2009)',
      versionId: 'river'
    },
    {
      id: 'event-version-vertedero',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T22:00:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Versión 2 (Marzo 2009): Declaración de depósito en contenedor de basuras próximo en León XIII con destino a Utrera.',
      personsInvolved: ['Miguel Carcaño'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Segunda declaración de Miguel Carcaño',
      versionId: 'waste'
    },
    {
      id: 'event-version-majaloba',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T23:15:00.000Z',
      timeConfidence: 'hypothesis',
      description: 'Versión 7 (2013): Acusación a Francisco Javier Delgado y traslado a una zanja agrícola en la Finca Majaloba.',
      personsInvolved: ['Miguel Carcaño', 'Francisco Javier Delgado'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Declaración judicial voluntaria (Abril 2013)',
      versionId: 'majaloba'
    },
    {
      id: 'event-version-camas',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-25T01:00:00.000Z',
      timeConfidence: 'hypothesis',
      description: 'Ruta hacia Camas: Declaración de desplazamientos nocturnos en el entorno de la Cañada Real y zanja de La Algaba.',
      personsInvolved: ['Miguel Carcaño'],
      locationRefId: 'anchor-miguel-home',
      sourceRef: 'Diligencias complementarias de búsqueda',
      versionId: 'camas'
    }
  ],
  pointsOfInterest: [
    {
      id: 'poi-guadalquivir',
      caseId: 'marta-del-castillo-2009',
      label: 'Río Guadalquivir (Pasarela Cartuja / Charco de la Pava)',
      type: 'RIVER',
      lat: 37.3950,
      lng: -6.0020,
      notes: 'Primera zona de búsqueda exhaustiva (Feb-Mar 2009). Rastreo con buzos GEO y sonar.',
      sourceRef: 'Versión 1 de Miguel Carcaño',
      versionId: 'river'
    },
    {
      id: 'poi-contenedores-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      label: 'Contenedores de basuras C/ León XIII',
      type: 'CONTAINER',
      lat: 37.4044,
      lng: -5.9863,
      notes: 'Contenedores a 40 metros del portal. Recogida municipal registrada entre 22:30 y 23:00h.',
      sourceRef: 'Diligencias de reconstrucción y rutas Lipasam',
      versionId: 'waste'
    },
    {
      id: 'poi-vertedero-utrera',
      caseId: 'marta-del-castillo-2009',
      label: 'Vertedero Montemarta-Corda (Utrera)',
      type: 'WASTE',
      lat: 37.2150,
      lng: -5.7920,
      notes: 'Centro de tratamiento donde convergen los residuos. Búsqueda de miles de toneladas de basura.',
      sourceRef: 'Versión 2 de Miguel Carcaño (Marzo 2009)',
      versionId: 'waste'
    },
    {
      id: 'poi-majaloba',
      caseId: 'marta-del-castillo-2009',
      label: 'Finca Majaloba (La Rinconada)',
      type: 'OPEN_FIELD',
      lat: 37.4520,
      lng: -5.9620,
      notes: 'Terreno agrícola junto a la carretera A-8002. Rastrillada con georradar y excavadoras en 2013.',
      sourceRef: 'Versión 7 de Miguel Carcaño (2013)',
      versionId: 'majaloba'
    },
    {
      id: 'poi-camas-zanja',
      caseId: 'marta-del-castillo-2009',
      label: 'Zanja / Descampado de Camas (Ruta de la Algaba)',
      type: 'OPEN_FIELD',
      lat: 37.4125,
      lng: -6.0310,
      notes: 'Área cercana a la vía del tren y canalización de obras donde la policía realizó excavaciones en 2011.',
      sourceRef: 'Testimonio de la menor y actuaciones 2011',
      versionId: 'camas'
    }
  ],
  transportProfiles: [
    {
      id: 'trans-walking',
      caseId: 'marta-del-castillo-2009',
      mode: 'WALKING',
      label: 'A pie (con carga)',
      speedKmh: 4.5,
      notes: 'Alcance muy reducido (~1-2 km). Compatible con contenedores o descampados contiguos.'
    },
    {
      id: 'trans-motorcycle',
      caseId: 'marta-del-castillo-2009',
      mode: 'MOTORCYCLE',
      label: 'En moto / ciclomotor',
      speedKmh: 30.0,
      notes: 'Ciclomotor habitual de Carcaño. Alcance urbano ágil entre León XIII, Camas y puentes.'
    },
    {
      id: 'trans-car',
      caseId: 'marta-del-castillo-2009',
      mode: 'CAR',
      label: 'En coche / furgoneta',
      speedKmh: 50.0,
      notes: 'Vehículo de 4 ruedas (turismo o furgoneta). Acceso rápido a rondas SE-30, autovías y campos.'
    }
  ]
};
