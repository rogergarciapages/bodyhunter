'use client';

import React, { useMemo } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { PRESET_ITINERARIES, AVAILABLE_WAYPOINTS_POOL, ORIGIN_LEON_XIII } from '../lib/data/itinerariesData';
import { ItineraryWaypoint, PresetItinerary } from '../lib/types/itinerary';
import { Footprints, Bike as Motorbike, Car, RotateCcw, Plus, Trash2, MapPin, Compass, Navigation } from 'lucide-react';
import { point } from '@turf/helpers';
import distance from '@turf/distance';

export default function ItineraryBuilder() {
  const activeWaypoints = useCaseStore((state) => state.activeWaypoints);
  const activeItineraryId = useCaseStore((state) => state.activeItineraryId);
  const finalSearchRadiusMeters = useCaseStore((state) => state.finalSearchRadiusMeters);
  const itineraryTransportMode = useCaseStore((state) => state.itineraryTransportMode);

  const selectPresetItinerary = useCaseStore((state) => state.selectPresetItinerary);
  const resetToOrigin = useCaseStore((state) => state.resetToOrigin);
  const addWaypoint = useCaseStore((state) => state.addWaypoint);
  const removeWaypoint = useCaseStore((state) => state.removeWaypoint);
  const setFinalSearchRadiusMeters = useCaseStore((state) => state.setFinalSearchRadiusMeters);
  const setItineraryTransportMode = useCaseStore((state) => state.setItineraryTransportMode);

  // Compute total itinerary distance
  const totalDistanceKm = useMemo(() => {
    if (activeWaypoints.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < activeWaypoints.length - 1; i++) {
      const p1 = point([activeWaypoints[i].lng, activeWaypoints[i].lat]);
      const p2 = point([activeWaypoints[i + 1].lng, activeWaypoints[i + 1].lat]);
      total += distance(p1, p2, { units: 'kilometers' });
    }
    return Math.round(total * 10) / 10;
  }, [activeWaypoints]);

  // Compute estimated travel time based on transport mode
  const estimatedTimeMins = useMemo(() => {
    if (totalDistanceKm === 0) return 0;
    const speed =
      itineraryTransportMode === 'WALKING'
        ? 4.5
        : itineraryTransportMode === 'MOTORCYCLE'
        ? 30.0
        : 50.0;
    const circuitousFactor = 1.35; // Urban road network factor
    return Math.round(((totalDistanceKm * circuitousFactor) / speed) * 60);
  }, [totalDistanceKm, itineraryTransportMode]);

  // Available waypoints not yet added to current itinerary
  const unselectedWaypoints = useMemo(() => {
    const currentIds = new Set(activeWaypoints.map((w) => w.id));
    return AVAILABLE_WAYPOINTS_POOL.filter((wp) => !currentIds.has(wp.id));
  }, [activeWaypoints]);

  const finalWaypoint = activeWaypoints[activeWaypoints.length - 1];
  const finalAreaKm2 = (Math.PI * Math.pow(finalSearchRadiusMeters / 1000, 2)).toFixed(2);

  return (
    <div className="space-y-5">
      {/* 1. Selector de Itinerarios Testimoniales Predefinidos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider">
            Itinerarios Testimoniales e Hipótesis
          </label>
          <button
            onClick={resetToOrigin}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar a León XIII
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_ITINERARIES.map((preset) => {
            const isSelected = activeItineraryId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => selectPresetItinerary(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                    {preset.title.split(':')[1] || preset.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                      isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {preset.transportMode === 'WALKING' ? 'A pie' : 'En moto'}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {preset.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selector de Medio de Transporte y Radio Final */}
      <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setItineraryTransportMode('WALKING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                itineraryTransportMode === 'WALKING'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>A pie (4.5 km/h)</span>
            </button>

            <button
              onClick={() => setItineraryTransportMode('MOTORCYCLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                itineraryTransportMode === 'MOTORCYCLE'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Motorbike className="w-3.5 h-3.5" />
              <span>En moto (30 km/h)</span>
            </button>

            <button
              onClick={() => setItineraryTransportMode('CAR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                itineraryTransportMode === 'CAR'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>En coche (50 km/h)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Radio Final</span>
              <span className="text-xs font-mono font-bold text-rose-600">{finalSearchRadiusMeters} m</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={finalSearchRadiusMeters}
              onChange={(e) => setFinalSearchRadiusMeters(parseInt(e.target.value))}
              className="w-24 accent-rose-600 h-1.5 bg-zinc-200 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Resumen numérico del trayecto */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200/80 text-center">
          <div className="bg-white p-2 rounded-lg border border-zinc-200">
            <span className="text-[10px] text-zinc-400 font-mono block uppercase">Distancia Ruta</span>
            <span className="text-xs font-bold text-zinc-900">{totalDistanceKm} km</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-zinc-200">
            <span className="text-[10px] text-zinc-400 font-mono block uppercase">Tiempo Desplazamiento</span>
            <span className="text-xs font-bold text-zinc-900">{estimatedTimeMins} min</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-zinc-200">
            <span className="text-[10px] text-zinc-400 font-mono block uppercase">Área de Búsqueda</span>
            <span className="text-xs font-bold text-rose-600">{finalAreaKm2} km²</span>
          </div>
        </div>
      </div>

      {/* 3. Cadena de Hitos del Itinerario Activo */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider">
            Secuencia del Itinerario ({activeWaypoints.length} {activeWaypoints.length === 1 ? 'hito' : 'hitos'})
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">Punto final determina radio</span>
        </div>

        <div className="space-y-2">
          {activeWaypoints.map((wp, index) => {
            const isOrigin = index === 0;
            const isFinal = index === activeWaypoints.length - 1 && activeWaypoints.length > 1;

            return (
              <div
                key={wp.id}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                  isFinal
                    ? 'bg-rose-50/60 border-rose-300 ring-1 ring-rose-200'
                    : isOrigin
                    ? 'bg-white border-zinc-200 shadow-xs'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                      isFinal
                        ? 'bg-rose-600 text-white'
                        : isOrigin
                        ? 'bg-white border-2 border-rose-600 text-rose-600'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {isFinal ? '★' : `${index + 1}`}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-900">{wp.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-medium">
                        {wp.timeEstimate}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 leading-snug">{wp.description}</p>
                    {isFinal && (
                      <p className="text-[10px] font-bold text-rose-700 pt-1">
                        🎯 Punto Final de Destino · Radio de localización activo: {finalSearchRadiusMeters} metros
                      </p>
                    )}
                  </div>
                </div>

                {!isOrigin && (
                  <button
                    onClick={() => removeWaypoint(wp.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 rounded transition shrink-0"
                    title="Quitar hito del itinerario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Selector para Añadir el Siguiente Hito Temporal */}
      {unselectedWaypoints.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-200">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
            + Añadir Siguiente Evento Temporal al Itinerario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unselectedWaypoints.map((poolWp) => (
              <button
                key={poolWp.id}
                onClick={() => addWaypoint(poolWp)}
                className="p-2.5 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 text-left transition flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="text-xs font-medium text-zinc-800 block truncate">{poolWp.label}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{poolWp.timeEstimate}</span>
                </div>
                <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
