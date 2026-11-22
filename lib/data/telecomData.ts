import { CellTower, MobilePing } from '../types/telecom';

export const CELL_TOWERS: CellTower[] = [
  {
    id: 'tower-leon-xiii',
    name: 'BTS Macarena - León XIII',
    address: 'C/ Conde de Halcón / León XIII, Sevilla',
    lat: 37.4048,
    lng: -5.9858,
    coverageRadiusMeters: 600,
    operator: 'Telefónica Movistar'
  },
  {
    id: 'tower-cruz-roja',
    name: 'BTS San Juan de la Salle / Cruz Roja',
    address: 'Avda. Cruz Roja, Sevilla',
    lat: 37.4012,
    lng: -5.9868,
    coverageRadiusMeters: 750,
    operator: 'Vodafone'
  },
  {
    id: 'tower-torneo',
    name: 'BTS Torneo / Pasarela Cartuja',
    address: 'C/ Torneo (Ribera del Guadalquivir)',
    lat: 37.3970,
    lng: -5.9990,
    coverageRadiusMeters: 800,
    operator: 'Telefónica Movistar'
  },
  {
    id: 'tower-alamillo',
    name: 'BTS Puente del Alamillo / SE-30',
    address: 'Acceso Norte Isla de la Cartuja',
    lat: 37.4145,
    lng: -5.9935,
    coverageRadiusMeters: 1100,
    operator: 'Amena/Orange'
  },
  {
    id: 'tower-camas',
    name: 'BTS Camas Centro / Cañada Real',
    address: 'C/ Santa María de Gracia, Camas',
    lat: 37.4015,
    lng: -6.0330,
    coverageRadiusMeters: 1200,
    operator: 'Telefónica Movistar'
  },
  {
    id: 'tower-triana-dseda',
    name: 'BTS Triana / Macarena Sur',
    address: 'Sector Los Remedios / Triana',
    lat: 37.3945,
    lng: -5.9825,
    coverageRadiusMeters: 800,
    operator: 'Vodafone'
  },
  {
    id: 'tower-san-jeronimo',
    name: 'BTS San Jerónimo / Carretera La Rinconada',
    address: 'Salida Norte A-8002',
    lat: 37.4255,
    lng: -5.9775,
    coverageRadiusMeters: 1300,
    operator: 'Amena/Orange'
  },
  {
    id: 'tower-montequinto',
    name: 'BTS Montequinto / Dos Hermanas',
    address: 'Entorno residencial Montequinto',
    lat: 37.3450,
    lng: -5.9320,
    coverageRadiusMeters: 1500,
    operator: 'Telefónica Movistar'
  }
];

export const MOBILE_PINGS: MobilePing[] = [
  {
    id: 'ping-marta-2028',
    timestamp: '2009-01-24T20:28:00.000Z',
    timeFormatted: '20:28h',
    suspectId: 'marta',
    suspectName: 'Marta del Castillo',
    suspectColor: '#ec4899', // Pink
    towerId: 'tower-leon-xiii',
    towerName: 'BTS Macarena - León XIII',
    eventType: 'CALL_IN',
    eventLabel: 'Llamada entrante (Madre)',
    description: 'Llamada de la madre de Marta recibida en el terminal; no es contestada. Celda de León XIII.',
    sourceRef: 'Informe pericial de telefonía / Sumario'
  },
  {
    id: 'ping-miguel-2028',
    timestamp: '2009-01-24T20:28:00.000Z',
    timeFormatted: '20:28h',
    suspectId: 'miguel',
    suspectName: 'Miguel Carcaño',
    suspectColor: '#2563eb', // Blue
    towerId: 'tower-leon-xiii',
    towerName: 'BTS Macarena - León XIII',
    eventType: 'CELL_HANDOVER',
    eventLabel: 'Posicionamiento en León XIII',
    description: 'Terminal de Carcaño enganchado al repetidor de León XIII simultáneamente con el móvil de Marta.',
    sourceRef: 'Peritaje judicial de antenas'
  },
  {
    id: 'ping-marta-2127',
    timestamp: '2009-01-24T21:27:00.000Z',
    timeFormatted: '21:27h',
    suspectId: 'marta',
    suspectName: 'Marta del Castillo',
    suspectColor: '#ec4899',
    towerId: 'tower-leon-xiii',
    towerName: 'BTS Macarena - León XIII',
    eventType: 'SIGNAL_LOST',
    eventLabel: 'Pérdida definitiva de señal',
    description: 'El teléfono móvil de Marta del Castillo pierde toda conexión o se apaga definitivamente en la celda de León XIII.',
    sourceRef: 'Hecho probado en la instrucción policial'
  },
  {
    id: 'ping-miguel-2140',
    timestamp: '2009-01-24T21:40:00.000Z',
    timeFormatted: '21:40h',
    suspectId: 'miguel',
    suspectName: 'Miguel Carcaño',
    suspectColor: '#2563eb',
    towerId: 'tower-cruz-roja',
    towerName: 'BTS San Juan de la Salle / Cruz Roja',
    eventType: 'CALL_OUT',
    eventLabel: 'Llamada saliente corta',
    description: 'Tráfico de red saliente hacia contacto. Movimiento registrado hacia el sector periférico de la Macarena.',
    durationSec: 18,
    sourceRef: 'Registro de llamadas salientes'
  },
  {
    id: 'ping-miguel-2215',
    timestamp: '2009-01-24T22:15:00.000Z',
    timeFormatted: '22:15h',
    suspectId: 'miguel',
    suspectName: 'Miguel Carcaño',
    suspectColor: '#2563eb',
    towerId: 'tower-alamillo',
    towerName: 'BTS Puente del Alamillo / SE-30',
    eventType: 'CELL_HANDOVER',
    eventLabel: 'Tránsito Nudo Alamillo / SE-30',
    description: 'Conexión de antena en el sector del Puente del Alamillo en dirección a la salida hacia el Aljarafe.',
    sourceRef: 'Registro de antenas de operadores'
  },
  {
    id: 'ping-miguel-2248',
    timestamp: '2009-01-24T22:48:00.000Z',
    timeFormatted: '22:48h',
    suspectId: 'miguel',
    suspectName: 'Miguel Carcaño',
    suspectColor: '#2563eb',
    towerId: 'tower-camas',
    towerName: 'BTS Camas Centro / Cañada Real',
    eventType: 'CALL_IN',
    eventLabel: 'Recepción bajo celda de Camas',
    description: 'El teléfono de Miguel Carcaño se registra en la torre repetidora de Camas. Hito clave de presencia metropolitana.',
    durationSec: 35,
    sourceRef: 'Informe pericial de telecomunicaciones'
  },
  {
    id: 'ping-samuel-2315',
    timestamp: '2009-01-24T23:15:00.000Z',
    timeFormatted: '23:15h',
    suspectId: 'samuel',
    suspectName: 'Samuel Benítez',
    suspectColor: '#d97706', // Amber
    towerId: 'tower-montequinto',
    towerName: 'BTS Montequinto / Dos Hermanas',
    eventType: 'CALL_OUT',
    eventLabel: 'Llamada desde Montequinto',
    description: 'Llamada registrada por Samuel Benítez conectando a la celda residencial de Montequinto.',
    sourceRef: 'Declaración y extractos de llamada'
  },
  {
    id: 'ping-delgado-2345',
    timestamp: '2009-01-24T23:45:00.000Z',
    timeFormatted: '23:45h',
    suspectId: 'delgado',
    suspectName: 'Fco. Javier Delgado',
    suspectColor: '#7c3aed', // Purple
    towerId: 'tower-triana-dseda',
    towerName: 'BTS Triana / Macarena Sur',
    eventType: 'CELL_HANDOVER',
    eventLabel: 'Conexión entorno Bar DSeda',
    description: 'Posicionamiento del terminal en la zona de Triana/Macarena Sur coincidiendo con la versión de coartada en local de copas.',
    sourceRef: 'Listado pericial de posicionamiento'
  },
  {
    id: 'ping-miguel-0120',
    timestamp: '2009-01-25T01:20:00.000Z',
    timeFormatted: '01:20h',
    suspectId: 'miguel',
    suspectName: 'Miguel Carcaño',
    suspectColor: '#2563eb',
    towerId: 'tower-camas',
    towerName: 'BTS Camas Centro / Cañada Real',
    eventType: 'SMS',
    eventLabel: 'Mensaje SMS en Camas',
    description: 'Tráfico de red de madrugada bajo la antena de Camas antes del retorno a Sevilla.',
    sourceRef: 'Informe judicial de telefonía'
  }
];
