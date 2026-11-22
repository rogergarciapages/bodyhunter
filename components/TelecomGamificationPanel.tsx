'use client';

import React, { useMemo } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { evaluateItineraryCoherence } from '../lib/geo/coherenceEngine';
import { Radio, ShieldAlert, CheckCircle2, AlertTriangle, Users, Clock, Eye, EyeOff } from 'lucide-react';
import { SuspectId } from '../lib/types/telecom';

export default function TelecomGamificationPanel() {
  const activeWaypoints = useCaseStore((state) => state.activeWaypoints);
  const showCellTowers = useCaseStore((state) => state.showCellTowers);
  const selectedSuspect = useCaseStore((state) => state.selectedSuspect);
  const activeTimelineHour = useCaseStore((state) => state.activeTimelineHour);

  const toggleCellTowers = useCaseStore((state) => state.toggleCellTowers);
  const setSelectedSuspect = useCaseStore((state) => state.setSelectedSuspect);
  const setActiveTimelineHour = useCaseStore((state) => state.setActiveTimelineHour);

  // Evaluate itinerary compatibility against confirmed telecom BTS pings
  const coherenceResult = useMemo(() => {
    return evaluateItineraryCoherence(activeWaypoints, selectedSuspect);
  }, [activeWaypoints, selectedSuspect]);

  const suspectsList: { id: SuspectId; label: string; color: string }[] = [
    { id: 'all', label: 'Todos', color: '#09090b' },
    { id: 'miguel', label: 'Carcaño', color: '#2563eb' },
    { id: 'marta', label: 'Marta', color: '#ec4899' },
    { id: 'samuel', label: 'Samuel', color: '#d97706' },
    { id: 'delgado', label: 'Delgado', color: '#7c3aed' },
  ];

  const hourSlots = [
    { id: 'all', label: 'Noche completa' },
    { id: '20', label: '20h (Crimen)' },
    { id: '21', label: '21h (Apagado)' },
    { id: '22', label: '22h (Traslado)' },
    { id: '23', label: '23h (Camas)' },
    { id: '00', label: '00h+ (Coartadas)' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-4 shadow-xs">
      {/* 1. Header con Toggle de Antenas */}
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-tight">
              Torres BTS & Geoposicionamiento Móvil
            </h3>
            <p className="text-[11px] text-zinc-500">
              Validación y concordancia celular del itinerario
            </p>
          </div>
        </div>

        <button
          onClick={toggleCellTowers}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
            showCellTowers
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
          }`}
        >
          {showCellTowers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showCellTowers ? 'Antenas visibles' : 'Ocultas'}</span>
        </button>
      </div>

      {/* 2. Medidor de Concordancia Forense (Gamificación) */}
      <div className={`p-3.5 rounded-xl border space-y-2 ${getScoreColor(coherenceResult.score)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {coherenceResult.score >= 80 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-bold text-xs uppercase tracking-tight">
              {coherenceResult.statusLabel}
            </span>
          </div>
          <span className="font-mono font-bold text-base">
            {coherenceResult.score}%
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden border border-black/5">
          <div
            className={`h-full transition-all duration-300 ${
              coherenceResult.score >= 80
                ? 'bg-emerald-600'
                : coherenceResult.score >= 50
                ? 'bg-amber-500'
                : 'bg-rose-600'
            }`}
            style={{ width: `${coherenceResult.score}%` }}
          ></div>
        </div>

        {/* Resumen de concordancias / discrepancias */}
        <div className="text-[11px] space-y-1 pt-1">
          {coherenceResult.matchingPings.length > 0 && (
            <p className="font-medium">
              ✓ <strong>{coherenceResult.matchingPings.length} conexiones confirmadas</strong> respaldan geográficamente los hitos de esta ruta.
            </p>
          )}

          {coherenceResult.discrepancies.map((disc, idx) => (
            <p key={idx} className="text-rose-700 bg-white/80 p-1.5 rounded border border-rose-200/60 leading-tight">
              ⚠️ {disc}
            </p>
          ))}
        </div>
      </div>

      {/* 3. Selector de Sospechosos */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Users className="w-3 h-3" />
          Filtrar por terminal telefónico
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {suspectsList.map((s) => {
            const isSelected = selectedSuspect === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSuspect(s.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {s.id !== 'all' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  ></span>
                )}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Barra Temporal de la Noche */}
      <div className="space-y-1.5 pt-1 border-t border-zinc-150">
        <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Franja horaria nocturna (24-25 Ene 2009)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {hourSlots.map((slot) => {
            const isSelected = activeTimelineHour === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setActiveTimelineHour(slot.id)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition text-center truncate ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
