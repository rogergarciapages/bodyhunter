'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import VersionSelector from '../components/VersionSelector';
import SwissTransportControl from '../components/SwissTransportControl';
import TestimoniesPanel from '../components/TestimoniesPanel';
import AdvancedSettingsModal from '../components/AdvancedSettingsModal';
import { useCaseStore } from '../lib/store/useCaseStore';
import { SlidersHorizontal, MapPin, Compass } from 'lucide-react';

const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 font-sans text-xs space-y-2">
      <div className="w-6 h-6 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium text-zinc-600">Cargando cartografía suiza...</p>
    </div>
  ),
});

export default function DashboardPage() {
  const setIsSettingsOpen = useCaseStore((state) => state.setIsSettingsOpen);
  const activeCase = useCaseStore((state) => state.activeCase);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);
  const selectedTransportProfileId = useCaseStore((state) => state.selectedTransportProfileId);

  const activeProfile =
    activeCase.transportProfiles.find((p) => p.id === selectedTransportProfileId) ||
    activeCase.transportProfiles[0];

  const approxRadiusKm = Math.round(((activeProfile.speedKmh * (selectedMinutes / 60)) / 1.35) * 10) / 10;
  const approxAreaKm2 = Math.round(Math.PI * Math.pow(approxRadiusKm, 2));

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
                  SEVILLA · 2009
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Espacio de movilidad criminal, radios de desplazamiento e hipótesis testimoniales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 text-xs font-medium transition shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ajustes y Ponderaciones</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Área de Controles Esenciales y Mapa */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 sm:p-6 space-y-4">
        {/* Barra superior de controles esenciales (Pocas opciones, máxima claridad) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Selector de Versiones y Testimonios */}
          <div className="flex-1">
            <VersionSelector />
          </div>

          {/* Selector de Transporte y Tiempos */}
          <div>
            <SwissTransportControl />
          </div>
        </div>

        {/* Grilla Principal del Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Columna Izquierda: Mapa Principal (Protagonista 70%) */}
          <div className="lg:col-span-8 flex flex-col gap-2">
            <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xs">
              <MapView />
            </div>

            {/* Ficha técnica mínima al pie del mapa */}
            <div className="flex flex-wrap items-center justify-between px-2 text-[11px] text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" /> Origen: León XIII, Sevilla
                </span>
                <span>•</span>
                <span>Ventana judicial: 21:00h – 22:15h</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Radio teórico: ~{approxRadiusKm} km</span>
                <span>•</span>
                <span>Cobertura: ~{approxAreaKm2} km²</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Testimonios y Cronología (30%) */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-4">
            <TestimoniesPanel />

            {/* Resumen Forense Rápido */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-150 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-800 text-[11px] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-zinc-600" />
                Resumen de Movilidad ({activeProfile.label})
              </div>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                En un intervalo de <strong>{selectedMinutes} minutos</strong> a una velocidad media estimada de{' '}
                <strong>{activeProfile.speedKmh} km/h</strong>, el radio alcanzable desde el núcleo de la Macarena es de hasta{' '}
                <strong>~{approxRadiusKm} km</strong>, abarcando una superficie de <strong>~{approxAreaKm2} km²</strong> sobre la red viaria metropolitana.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Modal de Ajustes Avanzados */}
      <AdvancedSettingsModal />
    </div>
  );
}
