export interface MonteCarloParticle {
  id: string;
  lat: number;
  lng: number;
  probabilityScore: number; // 0 to 100
  distanceMeters: number;
}

export interface MonteCarloConfidenceRing {
  label: string;
  percentile: number; // 50, 75, 90
  radiusMeters: number;
  probabilityLabel: string;
  color: string;
}

export interface MonteCarloResult {
  waypointId: string;
  waypointLabel: string;
  centerLat: number;
  centerLng: number;
  iterations: number;
  particles: MonteCarloParticle[];
  confidenceRings: MonteCarloConfidenceRing[];
  peakZone: {
    lat: number;
    lng: number;
    label: string;
    probabilityScore: number;
  };
}
