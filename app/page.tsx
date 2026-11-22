'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ItineraryBuilder from '../components/ItineraryBuilder';
import TelecomGamificationPanel from '../components/TelecomGamificationPanel';
import AdvancedSettingsModal from '../components/AdvancedSettingsModal';
import { useCaseStore } from '../lib/store/useCaseStore';
import { SlidersHorizontal, MapPin, Route, RotateCcw, Radio } from 'lucide-react';

const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[560px] bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 font-sans text-xs space-y-2">
      <div className="w-6 h-6 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium text-zinc-600">Cargando cartografía y antenas BTS...</p>
    </div>
  ),
});

export default function DashboardPage() {
  const setIsSettingsOpen = useCaseStore((state) => state.setIsSettingsOpen);
  const activeWaypoints = useCaseStore((state) => state.activeWaypoints);
  const resetToOrigin = useCaseStore((state) => state.resetToOrigin);
  const finalSearchRadiusMeters = useCaseStore((state) => state.finalSearchRadiusMeters);
  const showCellTowers = useCaseStore((state) => state.showCellTowers);

  const isInitialState = activeWaypoints.length === 1;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* 1. Header Minimalista Suizo */}
      <header className="border-b border-zinc-200/90 bg-white sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-full inline-block"></span>
                <h1 className="font-bold text-sm tracking-tight text-zinc-900 uppercase">
                  MARTA DEL CASTILLO
                </h1>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  INVESTIGACIÓN CELULAR & RUTAS
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Solapamiento de torres de telefonía, registros móviles de sospechosos y trazado concordante desde León XIII
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isInitialState ? (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                Punto inicial: 1 solo marcador
              </span>
            ) : (
              <button
                onClick={resetToOrigin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 text-xs font-medium transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar a León XIII</span>
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 text-xs font-medium transition shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ajustes Avanzados</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Cuerpo Principal */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Mapa Principal (62% ancho en desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-2">
            <div className="relative w-full h-[760px] rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xs">
              <MapView />
            </div>

            {/* Ficha técnica mínima al pie del mapa */}
            <div className="flex flex-wrap items-center justify-between px-2 text-[11px] text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-600" />
                  <strong>Origen:</strong> Piso C/ León XIII, Bajo C (20:28h)
                </span>
                <span>•</span>
                <span>
                  Hitos activos: <strong>{activeWaypoints.length}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-zinc-400" />
                  Capa BTS: {showCellTowers ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div>
                <span>
                  Radio final destino: <strong>{finalSearchRadiusMeters} m</strong> (
                  {(Math.PI * Math.pow(finalSearchRadiusMeters / 1000, 2)).toFixed(2)} km²)
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Telefonía Forense & Constructor de Itinerarios (38% ancho) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            {/* Panel de Gamificación y Validación Celular */}
            <TelecomGamificationPanel />

            {/* Constructor y Selector de Itinerarios */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-150 pb-3">
                <Route className="w-4 h-4 text-zinc-800" />
                <h2 className="font-bold text-xs tracking-tight text-zinc-900 uppercase">
                  Constructor de Itinerario & Testimonios
                </h2>
              </div>

              <ItineraryBuilder />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Modal de Ajustes */}
      <AdvancedSettingsModal />
    </div>
  );
}
