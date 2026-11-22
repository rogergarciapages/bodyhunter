'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCaseStore } from '../lib/store/useCaseStore';
import { ORIGIN_LEON_XIII } from '../lib/data/itinerariesData';
import { ItineraryWaypoint } from '../lib/types/itinerary';
import { CELL_TOWERS, MOBILE_PINGS } from '../lib/data/telecomData';

// Auto-bounds adjuster when waypoints change
function MapBoundsUpdater({ waypoints }: { waypoints: ItineraryWaypoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (waypoints.length === 1) {
      map.setView([waypoints[0].lat, waypoints[0].lng], 14, { animate: true });
    } else if (waypoints.length > 1) {
      const bounds = L.latLngBounds(waypoints.map((w) => [w.lat, w.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
    }
  }, [waypoints, map]);

  return null;
}

// Swiss waypoint marker icon
const createWaypointIcon = (order: number, isOrigin: boolean, isFinal: boolean) => {
  let bg = '#ffffff';
  let border = '#09090b';
  let textColor = '#09090b';
  let labelText = `${order}`;

  if (isOrigin) {
    border = '#e11d48'; // Swiss Red
    textColor = '#e11d48';
    labelText = '01';
  } else if (isFinal) {
    bg = '#e11d48';
    border = '#09090b';
    textColor = '#ffffff';
    labelText = '★';
  }

  return L.divIcon({
    className: 'swiss-waypoint-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md transition-transform hover:scale-110" style="background-color: ${bg}; border-color: ${border};">
        <span class="text-[11px] font-mono font-bold" style="color: ${textColor};">${labelText}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Minimalist cell tower marker icon
const createCellTowerIcon = () => {
  return L.divIcon({
    className: 'cell-tower-marker',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-400 shadow-xs hover:scale-110 transition-transform">
        <span class="text-[11px] leading-none">🗼</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Suspect mobile ping marker icon
const createMobilePingIcon = (color: string) => {
  return L.divIcon({
    className: 'mobile-ping-marker',
    html: `
      <div class="relative flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 shadow-xs transition-transform hover:scale-125" style="border-color: ${color};">
        <span class="w-2 h-2 rounded-full" style="background-color: ${color};"></span>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface MapViewProps {
  isHypothesisB?: boolean;
}

export default function MapViewInner({ isHypothesisB = false }: MapViewProps) {
  const activeWaypoints = useCaseStore((state) => state.activeWaypoints);
  const finalSearchRadiusMeters = useCaseStore((state) => state.finalSearchRadiusMeters);
  const mapTheme = useCaseStore((state) => state.mapTheme);
  const showCellTowers = useCaseStore((state) => state.showCellTowers);
  const selectedSuspect = useCaseStore((state) => state.selectedSuspect);
  const activeTimelineHour = useCaseStore((state) => state.activeTimelineHour);

  // Fallback to origin if empty
  const waypoints = activeWaypoints.length > 0 ? activeWaypoints : [ORIGIN_LEON_XIII];
  const origin = waypoints[0];
  const finalWaypoint = waypoints.length > 1 ? waypoints[waypoints.length - 1] : null;

  // Filter mobile pings by selected suspect and optional hour filter
  const visiblePings = useMemo(() => {
    return MOBILE_PINGS.filter((p) => {
      if (selectedSuspect !== 'all' && p.suspectId !== selectedSuspect) return false;
      if (activeTimelineHour !== 'all') {
        const hourPrefix = p.timeFormatted.split(':')[0];
        if (hourPrefix !== activeTimelineHour) return false;
      }
      return true;
    });
  }, [selectedSuspect, activeTimelineHour]);

  // Tower coordinate lookup helper
  const towerMap = useMemo(() => {
    const map = new Map<string, typeof CELL_TOWERS[0]>();
    CELL_TOWERS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  // Polyline path coordinates
  const polylineCoords = useMemo(() => {
    return waypoints.map((w) => [w.lat, w.lng] as [number, number]);
  }, [waypoints]);

  const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_5dxr_1_e80dd0a9dc15b563c7d5e61a';
  const tileUrl =
    mapTheme === 'dark'
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`
      : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;

  return (
    <div className="relative w-full h-full min-h-[520px] bg-zinc-100">
      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapBoundsUpdater waypoints={waypoints} />

        {/* CARTO Voyager / Light Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url={tileUrl}
          subdomains="abcd"
          maxZoom={19}
        />

        {/* --- CELL TOWERS (BTS) & COVERAGE CIRCLES LAYER --- */}
        {showCellTowers &&
          CELL_TOWERS.map((tower) => {
            const towerPings = MOBILE_PINGS.filter((p) => p.towerId === tower.id);

            return (
              <React.Fragment key={tower.id}>
                {/* Tower Coverage Sector Circle */}
                <Circle
                  center={[tower.lat, tower.lng]}
                  radius={tower.coverageRadiusMeters}
                  pathOptions={{
                    color: '#94a3b8',
                    fillColor: '#94a3b8',
                    fillOpacity: 0.05,
                    weight: 1,
                    dashArray: '3, 4',
                  }}
                />

                {/* Tower Icon Marker */}
                <Marker position={[tower.lat, tower.lng]} icon={createCellTowerIcon()}>
                  <Popup>
                    <div className="p-2.5 space-y-1.5 max-w-xs text-zinc-900">
                      <div className="flex items-center justify-between border-b border-zinc-150 pb-1.5">
                        <span className="font-bold text-xs text-zinc-900">{tower.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                          {tower.operator}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">{tower.address}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Radio de celda: {tower.coverageRadiusMeters} metros
                      </p>

                      {towerPings.length > 0 && (
                        <div className="pt-1.5 border-t border-zinc-150 space-y-1">
                          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                            Conexiones registradas ({towerPings.length}):
                          </span>
                          {towerPings.map((tp) => (
                            <div key={tp.id} className="text-[10px] flex items-center justify-between gap-1">
                              <span className="font-medium" style={{ color: tp.suspectColor }}>
                                {tp.suspectName} ({tp.timeFormatted})
                              </span>
                              <span className="text-zinc-500 truncate">{tp.eventLabel}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* --- CONFIRMED MOBILE PINGS OVERLAY --- */}
        {showCellTowers &&
          visiblePings.map((ping) => {
            const tower = towerMap.get(ping.towerId);
            if (!tower) return null;

            // Slight spatial offset around tower center to differentiate multiple pings
            const pingLat = tower.lat + (Math.sin(ping.id.length * 2.3) * 0.0012);
            const pingLng = tower.lng + (Math.cos(ping.id.length * 2.3) * 0.0012);

            return (
              <Marker
                key={ping.id}
                position={[pingLat, pingLng]}
                icon={createMobilePingIcon(ping.suspectColor)}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div className="p-1 space-y-0.5 text-xs font-sans">
                    <p className="font-bold" style={{ color: ping.suspectColor }}>
                      {ping.suspectName} · {ping.timeFormatted}
                    </p>
                    <p className="text-[11px] text-zinc-700">{ping.eventLabel}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{tower.name}</p>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

        {/* --- 1. TRACED PATH POLYLINE --- */}
        {waypoints.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#09090b',
              weight: 3.5,
              dashArray: '6, 6',
              opacity: 0.85,
            }}
          />
        )}

        {/* --- 2. FINAL SEARCH RADIUS AT DESTINATION --- */}
        {finalWaypoint && (
          <Circle
            center={[finalWaypoint.lat, finalWaypoint.lng]}
            radius={finalSearchRadiusMeters}
            pathOptions={{
              color: '#e11d48',
              fillColor: '#e11d48',
              fillOpacity: 0.16,
              weight: 2,
              dashArray: '4, 4',
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <div className="text-[11px] font-sans p-1">
                <p className="font-bold text-rose-700 uppercase tracking-tight">
                  Radio Final de Ocultación: {finalSearchRadiusMeters} m
                </p>
                <p className="text-zinc-600 font-mono text-[10px]">
                  Área estimada: {(Math.PI * Math.pow(finalSearchRadiusMeters / 1000, 2)).toFixed(2)} km²
                </p>
              </div>
            </Tooltip>
          </Circle>
        )}

        {/* --- 3. ITINERARY WAYPOINT MARKERS --- */}
        {waypoints.map((wp, idx) => {
          const isOrigin = idx === 0;
          const isFinal = idx === waypoints.length - 1 && waypoints.length > 1;

          return (
            <Marker
              key={wp.id}
              position={[wp.lat, wp.lng]}
              icon={createWaypointIcon(idx + 1, isOrigin, isFinal)}
            >
              <Popup>
                <div className="p-3 space-y-2 max-w-xs text-zinc-900">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-150 pb-2">
                    <span className="font-bold text-xs tracking-tight text-zinc-900">
                      #{idx + 1} {wp.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
                      {wp.timeEstimate}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{wp.description}</p>
                  {wp.notes && (
                    <p className="text-[11px] text-zinc-500 bg-zinc-50 p-1.5 rounded border border-zinc-150">
                      {wp.notes}
                    </p>
                  )}
                  {wp.sourceRef && (
                    <p className="text-[10px] text-zinc-400 border-t border-zinc-100 pt-1.5 italic">
                      Fuente: {wp.sourceRef}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Swiss Clean Legend & Status */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 shadow-sm text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border-2 border-rose-600 flex items-center justify-center text-[10px] font-mono font-bold text-rose-600">
            01
          </span>
          <span className="text-[11px] font-medium text-zinc-700">Punto de inicio: León XIII</span>
        </div>
        {waypoints.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-600 border border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">
              ★
            </span>
            <span className="text-[11px] font-medium text-rose-600">
              Punto final ({finalSearchRadiusMeters}m radio)
            </span>
          </div>
        )}
        {showCellTowers && (
          <div className="flex items-center gap-3 pt-1 border-t border-zinc-150 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span>🗼</span> Torres BTS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span> Carcaño
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span> Marta
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span> Samuel
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
