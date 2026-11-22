'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCaseStore } from '../lib/store/useCaseStore';
import { ORIGIN_LEON_XIII } from '../lib/data/itinerariesData';
import { ItineraryWaypoint } from '../lib/types/itinerary';

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

interface MapViewProps {
  isHypothesisB?: boolean;
}

export default function MapViewInner({ isHypothesisB = false }: MapViewProps) {
  const activeWaypoints = useCaseStore((state) => state.activeWaypoints);
  const finalSearchRadiusMeters = useCaseStore((state) => state.finalSearchRadiusMeters);
  const itineraryTransportMode = useCaseStore((state) => state.itineraryTransportMode);
  const mapTheme = useCaseStore((state) => state.mapTheme);

  // Fallback to origin if empty
  const waypoints = activeWaypoints.length > 0 ? activeWaypoints : [ORIGIN_LEON_XIII];
  const origin = waypoints[0];
  const finalWaypoint = waypoints.length > 1 ? waypoints[waypoints.length - 1] : null;

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

        {/* 1. Traced Path Polyline (if 2 or more waypoints) */}
        {waypoints.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#09090b',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.8,
            }}
          />
        )}

        {/* 2. Final Search Radius at the End of the Itinerary */}
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

        {/* 3. Waypoint Markers */}
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
          <>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 border-t-2 border-dashed border-zinc-900 inline-block"></span>
              <span className="text-[11px] font-medium text-zinc-700">Itinerario seguido ({waypoints.length} hitos)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 border border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">
                ★
              </span>
              <span className="text-[11px] font-medium text-rose-600">
                Punto final & Radio de búsqueda ({finalSearchRadiusMeters}m)
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
