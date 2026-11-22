'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AnchorPoint, PointOfInterest, IsochroneResult, HeatmapResult } from '../lib/types/case';
import { useCaseStore } from '../lib/store/useCaseStore';
import { generateGeographicProfile } from '../lib/geo/decayModel';
import { calculateIsochrone } from '../lib/geo/isochroneClient';

// Helper component to auto-recenter map when active case or version focus changes
function MapRecenter({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom ?? map.getZoom(), { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Swiss minimalist circular DivIcon
const createSwissMarkerIcon = (type: string, isSelected: boolean, label?: string) => {
  let borderColor = '#09090b';
  let dotColor = '#09090b';
  let badgeLetter = '•';

  switch (type) {
    case 'CRIME_SCENE':
      borderColor = '#e11d48'; // Swiss Red
      dotColor = '#e11d48';
      badgeLetter = '01';
      break;
    case 'HOME':
      borderColor = '#2563eb'; // Technical Blue
      dotColor = '#2563eb';
      badgeLetter = 'H';
      break;
    case 'LEISURE':
    case 'OTHER':
      borderColor = '#64748b'; // Slate Neutral
      dotColor = '#64748b';
      badgeLetter = 'A';
      break;
    case 'RIVER':
      borderColor = '#0284c7'; // Sky/River
      dotColor = '#0284c7';
      badgeLetter = 'R';
      break;
    case 'WASTE':
    case 'CONTAINER':
      borderColor = '#d97706'; // Amber
      dotColor = '#d97706';
      badgeLetter = 'W';
      break;
    case 'OPEN_FIELD':
      borderColor = '#059669'; // Emerald Field
      dotColor = '#059669';
      badgeLetter = 'F';
      break;
    default:
      borderColor = '#09090b';
      dotColor = '#09090b';
      badgeLetter = '•';
  }

  const ringStyle = isSelected
    ? 'ring-3 ring-zinc-900 ring-offset-2 scale-110 shadow-md'
    : 'shadow-xs hover:scale-105';

  return L.divIcon({
    className: 'swiss-marker-icon',
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 transition-transform duration-150 ${ringStyle}" style="border-color: ${borderColor};">
        <span class="text-[10px] font-mono font-bold" style="color: ${dotColor};">${badgeLetter}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

interface MapViewProps {
  isHypothesisB?: boolean;
}

export default function MapViewInner({ isHypothesisB = false }: MapViewProps) {
  const activeCase = useCaseStore((state) => state.activeCase);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);
  const mathParameters = useCaseStore((state) =>
    isHypothesisB ? state.mathParametersHypothesisB : state.mathParameters
  );
  const timeSensitivityShift = useCaseStore((state) => state.timeSensitivityShift);
  const selectedTransportProfileId = useCaseStore((state) => state.selectedTransportProfileId);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);
  const selectedAnchorId = useCaseStore((state) => state.selectedAnchorId);
  const selectedPOIId = useCaseStore((state) => state.selectedPOIId);
  const selectedVersion = useCaseStore((state) => state.selectedVersion);
  const mapTheme = useCaseStore((state) => state.mapTheme);

  const setSelectedAnchor = useCaseStore((state) => state.setSelectedAnchor);
  const setSelectedPOI = useCaseStore((state) => state.setSelectedPOI);

  const [isochrone, setIsochrone] = useState<IsochroneResult | null>(null);

  // Filter POIs by active version
  const visiblePOIs = useMemo(() => {
    if (selectedVersion === 'all') return activeCase.pointsOfInterest;
    return activeCase.pointsOfInterest.filter(
      (poi) => poi.versionId === selectedVersion || poi.versionId === undefined
    );
  }, [activeCase.pointsOfInterest, selectedVersion]);

  // Compute map center from focused POI, anchor or default scene
  const mapCenter: [number, number] = useMemo(() => {
    if (selectedPOIId) {
      const p = activeCase.pointsOfInterest.find((item) => item.id === selectedPOIId);
      if (p) return [p.lat, p.lng];
    }
    if (selectedVersion !== 'all') {
      const matchedPOI = activeCase.pointsOfInterest.find((p) => p.versionId === selectedVersion);
      if (matchedPOI) return [matchedPOI.lat, matchedPOI.lng];
    }
    if (selectedAnchorId) {
      const a = activeCase.anchorPoints.find((item) => item.id === selectedAnchorId);
      if (a) return [a.lat, a.lng];
    }
    const mainAnchor = activeCase.anchorPoints.find((a) => a.type === 'CRIME_SCENE') || activeCase.anchorPoints[0];
    return mainAnchor ? [mainAnchor.lat, mainAnchor.lng] : [37.4042, -5.9861];
  }, [activeCase, selectedPOIId, selectedAnchorId, selectedVersion]);

  // Active anchor points considering weight > 0
  const activeAnchors = useMemo(() => {
    return activeCase.anchorPoints.filter(
      (a) => (mathParameters.anchorWeights[a.id] ?? a.weight) > 0
    );
  }, [activeCase.anchorPoints, mathParameters.anchorWeights]);

  // Compute spatial probability profile heatmap
  const heatmapProfile: HeatmapResult = useMemo(() => {
    return generateGeographicProfile(activeAnchors, {
      bufferMeters: mathParameters.bufferMeters,
      decayExponent: mathParameters.decayExponent,
      customWeights: mathParameters.anchorWeights,
    });
  }, [activeAnchors, mathParameters]);

  // Fetch or calculate isochrone when transport, time or selected anchor changes
  useEffect(() => {
    const mainAnchor =
      (selectedAnchorId && activeCase.anchorPoints.find((a) => a.id === selectedAnchorId)) ||
      activeCase.anchorPoints.find((a) => a.type === 'CRIME_SCENE') ||
      activeCase.anchorPoints[0];

    const profile =
      activeCase.transportProfiles.find((p) => p.id === selectedTransportProfileId) ||
      activeCase.transportProfiles[0];

    if (mainAnchor && profile) {
      const effectiveMinutes = Math.max(5, selectedMinutes + timeSensitivityShift);
      calculateIsochrone(mainAnchor, profile, effectiveMinutes).then((res) => setIsochrone(res));
    }
  }, [activeCase, selectedAnchorId, selectedTransportProfileId, selectedMinutes, timeSensitivityShift]);

  const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_5dxr_1_e80dd0a9dc15b563c7d5e61a';
  const tileUrl =
    mapTheme === 'dark'
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`
      : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;

  return (
    <div className="relative w-full h-full min-h-[480px] bg-zinc-100">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapRecenter center={mapCenter} />

        {/* CARTO Voyager / Light Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url={tileUrl}
          subdomains="abcd"
          maxZoom={19}
        />

        {/* 1. Isochrone Mobility Layer */}
        {layerVisibility.isochrones && isochrone && isochrone.coordinates.map((ring, idx) => (
          <Polygon
            key={`iso-${idx}`}
            positions={ring}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#2563eb',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '4, 4',
            }}
          >
            <Tooltip sticky>
              <div className="text-xs p-1 space-y-0.5">
                <p className="font-semibold text-zinc-900">
                  Radio de alcance: {isochrone.minutes} min ({isochrone.transportMode.toLowerCase()})
                </p>
                <p className="text-zinc-600 font-mono text-[11px]">Superficie estimada: {isochrone.areaKm2} km²</p>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* 2. Heatmap Grid (if enabled in settings) */}
        {layerVisibility.heatmap &&
          heatmapProfile.cells
            .filter((cell) => cell.probability > 25)
            .map((cell, idx) => (
              <CircleMarker
                key={`grid-${idx}`}
                center={[cell.lat, cell.lng]}
                radius={cell.probability > 70 ? 12 : 7}
                pathOptions={{
                  fillColor: cell.probability > 75 ? '#e11d48' : '#2563eb',
                  fillOpacity: cell.probability / 180 + 0.1,
                  stroke: false,
                }}
              />
            ))}

        {/* 3. Anchor Points Markers */}
        {layerVisibility.anchors &&
          activeCase.anchorPoints.map((anchor) => {
            const isSelected = selectedAnchorId === anchor.id;
            return (
              <Marker
                key={anchor.id}
                position={[anchor.lat, anchor.lng]}
                icon={createSwissMarkerIcon(anchor.type, isSelected, anchor.label)}
                eventHandlers={{
                  click: () => setSelectedAnchor(anchor.id),
                }}
              >
                <Popup>
                  <div className="p-3 space-y-2 max-w-xs text-zinc-900">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-150 pb-2">
                      <span className="font-semibold text-xs tracking-tight text-zinc-900">
                        {anchor.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {anchor.type}
                      </span>
                    </div>
                    {anchor.notes && (
                      <p className="text-xs text-zinc-600 leading-relaxed">{anchor.notes}</p>
                    )}
                    {anchor.sourceRef && (
                      <p className="text-[10px] text-zinc-400 border-t border-zinc-100 pt-1.5 italic">
                        {anchor.sourceRef}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 4. Points of Interest (POIs) Markers filtered by version */}
        {layerVisibility.pois &&
          visiblePOIs.map((poi) => {
            const isSelected = selectedPOIId === poi.id;
            return (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                icon={createSwissMarkerIcon(poi.type, isSelected, poi.label)}
                eventHandlers={{
                  click: () => setSelectedPOI(poi.id),
                }}
              >
                <Popup>
                  <div className="p-3 space-y-2 max-w-xs text-zinc-900">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-150 pb-2">
                      <span className="font-semibold text-xs tracking-tight text-zinc-900">
                        {poi.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {poi.type}
                      </span>
                    </div>
                    {poi.notes && (
                      <p className="text-xs text-zinc-600 leading-relaxed">{poi.notes}</p>
                    )}
                    {poi.sourceRef && (
                      <p className="text-[10px] text-zinc-400 border-t border-zinc-100 pt-1.5 italic">
                        {poi.sourceRef}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Minimalist Swiss Floating Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-xs px-3 py-2.5 rounded-xl border border-zinc-200 shadow-sm text-xs space-y-1.5 font-medium text-zinc-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
          <span className="text-[11px] text-zinc-600">Escena principal (León XIII)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span className="text-[11px] text-zinc-600">Punto ancla / Domicilio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
          <span className="text-[11px] text-zinc-600">Zona de búsqueda / Testimonio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm border border-blue-600 bg-blue-500/20 inline-block"></span>
          <span className="text-[11px] text-zinc-600">Radio de transporte</span>
        </div>
      </div>
    </div>
  );
}
