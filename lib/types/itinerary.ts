export type EvidenceType = 'proven_fact' | 'antenna' | 'confession' | 'witness' | 'hypothesis';

export type WaypointType = 'CRIME_SCENE' | 'ANTENNA' | 'TESTIMONY' | 'CONTAINER' | 'RIVER' | 'FIELD' | 'FINAL_LOCATION';

export interface ItineraryWaypoint {
  id: string;
  order: number;
  label: string;
  type: WaypointType;
  lat: number;
  lng: number;
  timeEstimate: string; // ej. "20:28h"
  evidenceType: EvidenceType;
  description: string;
  notes?: string;
  sourceRef?: string;
  transportModeFromPrevious?: 'WALKING' | 'MOTORCYCLE' | 'CAR';
}

export interface PresetItinerary {
  id: string;
  title: string;
  subtitle: string;
  transportMode: 'WALKING' | 'MOTORCYCLE' | 'CAR';
  transportLabel: string;
  finalSearchRadiusMeters: number;
  color: string;
  summary: string;
  waypoints: ItineraryWaypoint[];
}
