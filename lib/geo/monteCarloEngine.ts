import { MonteCarloParticle, MonteCarloConfidenceRing, MonteCarloResult } from '../types/monteCarlo';
import { ItineraryWaypoint } from '../types/itinerary';

/**
 * Fast geodesic destination formula (direct spherical trigonometry)
 */
function destinationPoint(lat: number, lng: number, distanceMeters: number, bearingRad: number): [number, number] {
  const R = 6371000; // Earth radius in meters
  const d = distanceMeters;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lng * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(bearingRad)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(d / R) * Math.cos(lat1),
      Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI];
}

/**
 * Pseudo-random generator with optional deterministic seed
 */
function pseudoGaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Runs a spatial Monte Carlo simulation to compute probability distribution
 * for body deposition around the final itinerary waypoint.
 */
export function runMonteCarloSimulation(
  targetWaypoint: ItineraryWaypoint,
  maxRadiusMeters: number = 800,
  transportMode: 'WALKING' | 'MOTORCYCLE' | 'CAR' = 'MOTORCYCLE',
  iterations: number = 320
): MonteCarloResult {
  const particles: MonteCarloParticle[] = [];
  const distances: number[] = [];

  const isRiver = targetWaypoint.type === 'RIVER' || targetWaypoint.id.includes('river');
  const isContainer = targetWaypoint.type === 'CONTAINER' || targetWaypoint.id.includes('container');
  const isField = targetWaypoint.type === 'FIELD' || targetWaypoint.id.includes('camas') || targetWaypoint.id.includes('majaloba');

  // Adjust effective dispersion scale based on terrain
  const effectiveMaxRadius = isContainer ? Math.min(180, maxRadiusMeters) : maxRadiusMeters;

  for (let i = 0; i < iterations; i++) {
    // Distance model: Log-normal style distribution (most probable deposition is close to stop point)
    let norm = Math.abs(pseudoGaussian());
    let distanceRatio: number;

    if (isContainer) {
      distanceRatio = Math.min(1.0, 0.1 + norm * 0.25);
    } else if (isRiver) {
      // River: elongated distribution along water flow direction
      distanceRatio = Math.min(1.0, 0.2 + norm * 0.35);
    } else if (isField) {
      // Field/ditches: moderate walking carry distance (50m - 350m)
      distanceRatio = Math.min(1.0, 0.15 + norm * 0.3);
    } else {
      distanceRatio = Math.min(1.0, 0.2 + norm * 0.3);
    }

    const distMeters = Math.max(15, distanceRatio * effectiveMaxRadius);
    distances.push(distMeters);

    // Bearing selection:
    let bearingRad: number;
    if (isRiver) {
      // Biased toward south-southwest river current (~200 degrees)
      const riverFlowDeg = 205 + pseudoGaussian() * 35;
      bearingRad = (riverFlowDeg * Math.PI) / 180;
    } else {
      // Uniform 360 degree radial dispersion with slight terrain perturbation
      bearingRad = Math.random() * 2 * Math.PI;
    }

    const [partLat, partLng] = destinationPoint(
      targetWaypoint.lat,
      targetWaypoint.lng,
      distMeters,
      bearingRad
    );

    particles.push({
      id: `mc-part-${i}`,
      lat: partLat,
      lng: partLng,
      probabilityScore: 50, // default, refined below
      distanceMeters: Math.round(distMeters),
    });
  }

  // Calculate local kernel density for each particle
  // Number of neighbor particles within 60 meters
  let maxNeighbors = 1;
  const neighborCounts: number[] = [];

  for (let i = 0; i < particles.length; i++) {
    let count = 0;
    const p1 = particles[i];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const p2 = particles[j];
      const dLat = (p1.lat - p2.lat) * 111000;
      const dLng = (p1.lng - p2.lng) * 111000 * Math.cos((p1.lat * Math.PI) / 180);
      const dDist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dDist <= 65) {
        count++;
      }
    }
    neighborCounts.push(count);
    if (count > maxNeighbors) maxNeighbors = count;
  }

  // Assign normalized probability scores based on local cluster density
  let peakParticleIdx = 0;
  let highestScore = 0;

  particles.forEach((p, idx) => {
    const rawScore = (neighborCounts[idx] / maxNeighbors) * 100;
    // Blend with distance proximity
    const proximityBonus = (1 - p.distanceMeters / effectiveMaxRadius) * 20;
    const finalScore = Math.min(99, Math.round(rawScore * 0.8 + proximityBonus));
    p.probabilityScore = Math.max(12, finalScore);

    if (finalScore > highestScore) {
      highestScore = finalScore;
      peakParticleIdx = idx;
    }
  });

  // Calculate empirical percentiles for confidence rings
  distances.sort((a, b) => a - b);
  const p50Dist = distances[Math.floor(distances.length * 0.5)];
  const p75Dist = distances[Math.floor(distances.length * 0.75)];
  const p90Dist = distances[Math.floor(distances.length * 0.9)];

  const confidenceRings: MonteCarloConfidenceRing[] = [
    {
      label: 'P50 · Núcleo de Alta Probabilidad',
      percentile: 50,
      radiusMeters: Math.round(p50Dist),
      probabilityLabel: '50% de las simulaciones Monte Carlo',
      color: '#e11d48', // Red
    },
    {
      label: 'P75 · Dispersión Media',
      percentile: 75,
      radiusMeters: Math.round(p75Dist),
      probabilityLabel: '75% de las simulaciones',
      color: '#f59e0b', // Amber
    },
    {
      label: 'P90 · Perímetro de Búsqueda Forense',
      percentile: 90,
      radiusMeters: Math.round(p90Dist),
      probabilityLabel: '90% de límite de confianza',
      color: '#2563eb', // Blue
    },
  ];

  const peakParticle = particles[peakParticleIdx];

  return {
    waypointId: targetWaypoint.id,
    waypointLabel: targetWaypoint.label,
    centerLat: targetWaypoint.lat,
    centerLng: targetWaypoint.lng,
    iterations,
    particles,
    confidenceRings,
    peakZone: {
      lat: peakParticle.lat,
      lng: peakParticle.lng,
      label: `Foco de Probabilidad Monte Carlo (${highestScore}%)`,
      probabilityScore: highestScore,
    },
  };
}
