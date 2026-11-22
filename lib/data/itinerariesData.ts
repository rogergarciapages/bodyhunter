import { ItineraryWaypoint, PresetItinerary } from '../types/itinerary';

export const ORIGIN_LEON_XIII: ItineraryWaypoint = {
  id: 'wp-origin-leon-xiii',
  order: 1,
  label: 'Escena del Crimen (Piso C/ León XIII)',
  type: 'CRIME_SCENE',
  lat: 37.4042,
  lng: -5.9861,
  timeEstimate: '20:28h',
  evidenceType: 'proven_fact',
  description: 'Punto de partida inamovible. Agresión y hecho crítico en el piso. Posicionamiento confirmado por antenas y confesión.',
  notes: 'Calle León XIII, Bajo C, Sevilla. Origen de todos los desplazamientos.',
  sourceRef: 'Hechos probados en sentencia y posicionamiento pericial telefónico'
};

export const PRESET_ITINERARIES: PresetItinerary[] = [
  {
    id: 'itinerary-river',
    title: 'Itinerario 1: Pasarela del Río Guadalquivir',
    subtitle: 'En moto · Primera declaración confesional (Febrero 2009)',
    transportMode: 'MOTORCYCLE',
    transportLabel: 'En ciclomotor / moto (~30 km/h)',
    finalSearchRadiusMeters: 1400,
    color: '#0284c7', // Sky Blue
    summary: 'Ruta desde León XIII cruzando la Ronda y puente hacia la Pasarela de la Cartuja / Charco de la Pava en ciclomotor.',
    waypoints: [
      ORIGIN_LEON_XIII,
      {
        id: 'wp-river-antena-macarena',
        order: 2,
        label: 'Antena Macarena / Cruz Roja',
        type: 'ANTENNA',
        lat: 37.4015,
        lng: -5.9875,
        timeEstimate: '21:15h',
        evidenceType: 'antenna',
        description: 'Registro de tráfico de red y repetidores en la zona norte antes de la salida.',
        transportModeFromPrevious: 'MOTORCYCLE'
      },
      {
        id: 'wp-river-puente-barqueta',
        order: 3,
        label: 'Cruce Puente Barqueta / Torneo',
        type: 'TESTIMONY',
        lat: 37.4055,
        lng: -5.9980,
        timeEstimate: '21:35h',
        evidenceType: 'confession',
        description: 'Paso declarado hacia el cauce del río por el acceso de la Cartuja en ciclomotor.',
        transportModeFromPrevious: 'MOTORCYCLE'
      },
      {
        id: 'wp-river-final-guadalquivir',
        order: 4,
        label: 'Punto Final: Pasarela de la Cartuja / Charco de la Pava',
        type: 'RIVER',
        lat: 37.3950,
        lng: -6.0020,
        timeEstimate: '21:55h',
        evidenceType: 'confession',
        description: 'Lugar donde se declaró inicialmente haber arrojado el cuerpo al río Guadalquivir.',
        notes: 'Zona de corriente hídrica. Radio final de búsqueda abarca el margen del río y áreas de retención fluvial.',
        sourceRef: 'Primera declaración confesional de Carcaño y Samuel (Feb 2009)',
        transportModeFromPrevious: 'MOTORCYCLE'
      }
    ]
  },
  {
    id: 'itinerary-camas',
    title: 'Itinerario 2: Ruta hacia Camas y Zanja de La Algaba',
    subtitle: 'En moto · Antenas móviles activas y testimonios de Camas (2011)',
    transportMode: 'MOTORCYCLE',
    transportLabel: 'En ciclomotor / moto (~30 km/h)',
    finalSearchRadiusMeters: 850,
    color: '#059669', // Emerald
    summary: 'Desplazamiento documentado por antenas hacia el municipio de Camas y descampados de canalización en la ruta de La Algaba.',
    waypoints: [
      ORIGIN_LEON_XIII,
      {
        id: 'wp-camas-alamillo',
        order: 2,
        label: 'Nudo Puente del Alamillo / SE-30',
        type: 'ANTENNA',
        lat: 37.4140,
        lng: -5.9930,
        timeEstimate: '21:40h',
        evidenceType: 'antenna',
        description: 'Vía rápida de conexión metropolitana entre el distrito Macarena y la comarca del Aljarafe.',
        transportModeFromPrevious: 'MOTORCYCLE'
      },
      {
        id: 'wp-camas-domicilio',
        order: 3,
        label: 'Domicilio / Entorno de Camas',
        type: 'ANTENNA',
        lat: 37.4011,
        lng: -6.0335,
        timeEstimate: '22:15h',
        evidenceType: 'antenna',
        description: 'Antena repetidora de Camas registra conexión del terminal de Carcaño en la franja nocturna.',
        transportModeFromPrevious: 'MOTORCYCLE'
      },
      {
        id: 'wp-camas-final-zanja',
        order: 4,
        label: 'Punto Final: Zanja / Descampado de La Algaba (Camas)',
        type: 'FIELD',
        lat: 37.4125,
        lng: -6.0310,
        timeEstimate: '23:30h',
        evidenceType: 'witness',
        description: 'Zona de obras junto a la vía del tren y canalizaciones donde se investigó la ocultación del cuerpo.',
        notes: 'Terreno irregular de descampados y zanjas de tubería. Radio final de búsqueda terrestre.',
        sourceRef: 'Declaraciones de la menor de Camas e inspecciones policiales 2011',
        transportModeFromPrevious: 'MOTORCYCLE'
      }
    ]
  },
  {
    id: 'itinerary-containers',
    title: 'Itinerario 3: Hipótesis Contenedores C/ León XIII',
    subtitle: 'A pie · Depósito a 40 metros y ruta camión Lipasam (Marzo 2009)',
    transportMode: 'WALKING',
    transportLabel: 'A pie (con carga pesada, 4.5 km/h)',
    finalSearchRadiusMeters: 250,
    color: '#d97706', // Amber
    summary: 'Traslado pedestre inmediato de 40 metros hasta la batería de contenedores de basura contigua al portal.',
    waypoints: [
      ORIGIN_LEON_XIII,
      {
        id: 'wp-containers-final-bateria',
        order: 2,
        label: 'Punto Final: Contenedores C/ León XIII (Portal 78)',
        type: 'CONTAINER',
        lat: 37.4045,
        lng: -5.9864,
        timeEstimate: '21:15h',
        evidenceType: 'confession',
        description: 'Batería de contenedores de basura orgánica situada a menos de 40 metros del portal.',
        notes: 'Recogida municipal por camión compactador Lipasam registrada entre 22:30h y 23:00h hacia Utrera.',
        sourceRef: 'Segunda declaración de Miguel Carcaño (Marzo 2009)',
        transportModeFromPrevious: 'WALKING'
      }
    ]
  },
  {
    id: 'itinerary-majaloba',
    title: 'Itinerario 4: Finca Majaloba (La Rinconada)',
    subtitle: 'En moto / coche · Declaración voluntaria de enterramiento (2013)',
    transportMode: 'MOTORCYCLE',
    transportLabel: 'En ciclomotor / vehículo (~40 km/h)',
    finalSearchRadiusMeters: 750,
    color: '#7c3aed', // Purple
    summary: 'Ruta hacia el norte de Sevilla por la carretera A-8002 hasta terrenos agrícolas de La Rinconada.',
    waypoints: [
      ORIGIN_LEON_XIII,
      {
        id: 'wp-majaloba-san-jeronimo',
        order: 2,
        label: 'Salida San Jerónimo / A-8002',
        type: 'ANTENNA',
        lat: 37.4250,
        lng: -5.9780,
        timeEstimate: '22:30h',
        evidenceType: 'antenna',
        description: 'Vía de salida septentrional hacia las fincas agrícolas de La Rinconada.',
        transportModeFromPrevious: 'MOTORCYCLE'
      },
      {
        id: 'wp-majaloba-final-finca',
        order: 3,
        label: 'Punto Final: Finca Majaloba (Zanja de riego)',
        type: 'FIELD',
        lat: 37.4520,
        lng: -5.9620,
        timeEstimate: '23:15h',
        evidenceType: 'confession',
        description: 'Finca agrícola rastreada con georradar en 2013 tras la declaración sobre enterramiento en zanja.',
        notes: 'Entorno rústico de cultivos de secano e infraestructuras de riego.',
        sourceRef: 'Séptima declaración judicial de Miguel Carcaño (Abril 2013)',
        transportModeFromPrevious: 'MOTORCYCLE'
      }
    ]
  }
];

// Pool de hitos adicionales para que el usuario pueda añadir a su itinerario
export const AVAILABLE_WAYPOINTS_POOL: ItineraryWaypoint[] = [
  {
    id: 'pool-bar-dseda',
    order: 0,
    label: 'Bar DSeda (Punto de coartada y llamadas)',
    type: 'TESTIMONY',
    lat: 37.3958,
    lng: -5.9812,
    timeEstimate: '23:00h',
    evidenceType: 'witness',
    description: 'Establecimiento donde se registraron llamadas y encuentros de los implicados durante la medianoche.',
    sourceRef: 'Declaraciones testimoniales de testigos'
  },
  {
    id: 'pool-puente-alamillo',
    order: 0,
    label: 'Puente del Alamillo (SE-30)',
    type: 'ANTENNA',
    lat: 37.4140,
    lng: -5.9930,
    timeEstimate: '21:40h',
    evidenceType: 'antenna',
    description: 'Nudo principal de salida de Sevilla hacia Aljarafe y comarca norte.',
    sourceRef: 'Registros de tráfico y antenas'
  },
  {
    id: 'pool-camas-domicilio',
    order: 0,
    label: 'Domicilio de Camas',
    type: 'ANTENNA',
    lat: 37.4011,
    lng: -6.0335,
    timeEstimate: '22:15h',
    evidenceType: 'antenna',
    description: 'Terminal de Carcaño conectado a repetidor de Camas.',
    sourceRef: 'Informe de telecomunicaciones'
  },
  {
    id: 'pool-camas-zanja',
    order: 0,
    label: 'Zanja / Descampado de Camas',
    type: 'FIELD',
    lat: 37.4125,
    lng: -6.0310,
    timeEstimate: '23:30h',
    evidenceType: 'witness',
    description: 'Zanja de canalización de obras señalada en testimonios de 2011.',
    sourceRef: 'Diligencias de investigación policial'
  },
  {
    id: 'pool-pasarela-rio',
    order: 0,
    label: 'Pasarela del Río Guadalquivir',
    type: 'RIVER',
    lat: 37.3950,
    lng: -6.0020,
    timeEstimate: '21:55h',
    evidenceType: 'confession',
    description: 'Punto de arrojo declarado en febrero de 2009.',
    sourceRef: 'Confesión de Carcaño'
  },
  {
    id: 'pool-finca-majaloba',
    order: 0,
    label: 'Finca Majaloba (La Rinconada)',
    type: 'FIELD',
    lat: 37.4520,
    lng: -5.9620,
    timeEstimate: '23:15h',
    evidenceType: 'confession',
    description: 'Zona de enterramiento indicada en declaración de 2013.',
    sourceRef: 'Declaración judicial voluntaria'
  }
];
