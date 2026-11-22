export type SuspectId = 'marta' | 'miguel' | 'samuel' | 'delgado' | 'all';

export interface CellTower {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  coverageRadiusMeters: number;
  operator: 'Telefónica Movistar' | 'Vodafone' | 'Amena/Orange';
}

export interface MobilePing {
  id: string;
  timestamp: string; // ISO 8601
  timeFormatted: string; // "20:28h"
  suspectId: 'marta' | 'miguel' | 'samuel' | 'delgado';
  suspectName: string;
  suspectColor: string;
  towerId: string;
  towerName: string;
  eventType: 'CALL_OUT' | 'CALL_IN' | 'SMS' | 'CELL_HANDOVER' | 'SIGNAL_LOST';
  eventLabel: string;
  description: string;
  durationSec?: number;
  targetPerson?: string;
  sourceRef: string;
}

export interface ItineraryCoherenceCheck {
  score: number; // 0 to 100
  status: 'HIGHLY_COMPATIBLE' | 'PARTIALLY_COMPATIBLE' | 'INCOMPATIBLE';
  statusLabel: string;
  matchingPings: MobilePing[];
  discrepancies: string[];
}
