import { ItineraryWaypoint } from '../types/itinerary';
import { MobilePing, CellTower, ItineraryCoherenceCheck } from '../types/telecom';
import { CELL_TOWERS, MOBILE_PINGS } from '../data/telecomData';
import { point } from '@turf/helpers';
import distance from '@turf/distance';

export function evaluateItineraryCoherence(
  waypoints: ItineraryWaypoint[],
  selectedSuspect: string = 'all'
): ItineraryCoherenceCheck {
  if (waypoints.length <= 1) {
    return {
      score: 100,
      status: 'HIGHLY_COMPATIBLE',
      statusLabel: 'Punto inicial confirmado (León XIII coincide 100% con torre)',
      matchingPings: MOBILE_PINGS.filter((p) => p.towerId === 'tower-leon-xiii'),
      discrepancies: []
    };
  }

  const relevantPings = selectedSuspect === 'all'
    ? MOBILE_PINGS
    : MOBILE_PINGS.filter((p) => p.suspectId === selectedSuspect);

  const matchingPings: MobilePing[] = [];
  const discrepancies: string[] = [];
  let supportedCount = 0;

  // Tower lookup map
  const towerMap = new Map<string, CellTower>();
  CELL_TOWERS.forEach((t) => towerMap.set(t.id, t));

  // Check each waypoint against towers and pings
  waypoints.forEach((wp, idx) => {
    const wpPt = point([wp.lng, wp.lat]);
    let hasTowerSupport = false;

    for (const ping of relevantPings) {
      const tower = towerMap.get(ping.towerId);
      if (!tower) continue;

      const towerPt = point([tower.lng, tower.lat]);
      const distKm = distance(wpPt, towerPt, { units: 'kilometers' });
      const towerRadiusKm = tower.coverageRadiusMeters / 1000;

      // Check spatial proximity to ping's cell tower
      if (distKm <= towerRadiusKm * 1.5) {
        hasTowerSupport = true;
        if (!matchingPings.some((m) => m.id === ping.id)) {
          matchingPings.push(ping);
        }
      }
    }

    if (hasTowerSupport) {
      supportedCount++;
    } else if (idx > 0) {
      // Waypoint has no nearby cell tower ping
      discrepancies.push(
        `Hito #${idx + 1} (${wp.label}): No existen antenas registradas que justifiquen este desplazamiento en esa franja horaria.`
      );
    }
  });

  // Specific historical sanity checks
  const isCamasRoute = waypoints.some((w) => w.id.includes('camas'));
  const isMajalobaRoute = waypoints.some((w) => w.id.includes('majaloba'));
  const isRiverRoute = waypoints.some((w) => w.id.includes('river'));
  const isContainersRoute = waypoints.some((w) => w.id.includes('containers'));

  if (isMajalobaRoute) {
    discrepancies.push(
      'Alerta pericial: A las 22:48h el teléfono de Carcaño conectó con la BTS de Camas (a 14 km al sur de Majaloba), haciendo altamente inverosímil el enterramiento en La Rinconada a esa hora.'
    );
  }

  // Calculate score
  const baseRatio = supportedCount / waypoints.length;
  let score = Math.round(baseRatio * 100);

  if (isCamasRoute) {
    score = Math.max(score, 92); // Camas has strong confirmed antenna support (22:48h and 01:20h)
  } else if (isContainersRoute) {
    score = Math.max(score, 95); // Immediate 40m proximity to León XIII
  } else if (isRiverRoute) {
    score = Math.min(score, 78); // Partial compatibility (Torneo tower proximity)
  } else if (isMajalobaRoute) {
    score = Math.min(score, 35); // Contradicted by Camas mobile connection
  }

  let status: ItineraryCoherenceCheck['status'] = 'HIGHLY_COMPATIBLE';
  let statusLabel = 'Altamente Coherente con Telefonía';

  if (score < 50) {
    status = 'INCOMPATIBLE';
    statusLabel = 'Incompatible con los Datos de Telefonía';
  } else if (score < 80) {
    status = 'PARTIALLY_COMPATIBLE';
    statusLabel = 'Parcialmente Coherente (Soporte Débil)';
  }

  return {
    score,
    status,
    statusLabel,
    matchingPings,
    discrepancies
  };
}
