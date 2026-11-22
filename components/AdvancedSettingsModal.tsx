'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { X, Sliders, RotateCcw, ShieldCheck, MapPin, Layers, Clock } from 'lucide-react';

export default function AdvancedSettingsModal() {
  const isSettingsOpen = useCaseStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useCaseStore((state) => state.setIsSettingsOpen);
  const activeCase = useCaseStore((state) => state.activeCase);
  const mathParameters = useCaseStore((state) => state.mathParameters);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);
  const timeSensitivityShift = useCaseStore((state) => state.timeSensitivityShift);
  const mapTheme = useCaseStore((state) => state.mapTheme);

  const setBufferMeters = useCaseStore((state) => state.setBufferMeters);
  const setDecayExponent = useCaseStore((state) => state.setDecayExponent);
  const setAnchorWeight = useCaseStore((state) => state.setAnchorWeight);
  const setTimeSensitivityShift = useCaseStore((state) => state.setTimeSensitivityShift);
  const toggleLayer = useCaseStore((state) => state.toggleLayer);
  const setMapTheme = useCaseStore((state) => state.setMapTheme);

  if (!isSettingsOpen) return null;

  const handleResetDefaults = () => {
    setBufferMeters(300);
    setDecayExponent(1.5);
    setTimeSensitivityShift(0);
    activeCase.anchorPoints.forEach((a) => {
      setAnchorWeight(a.id, a.weight);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              <h2 className="font-semibold text-base text-zinc-900 tracking-tight">
                Ajustes Avanzados del Modelo
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Calibración de pesos por punto ancla, parámetros de decaimiento y capas forenses
            </p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-zinc-100">
          {/* Section 1: Pesos de Puntos Ancla */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                  Pesos de Puntos Ancla (φ)
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Modifica la relevancia de cada ubicación en la función de probabilidad de búsqueda.
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150">
              {activeCase.anchorPoints.map((anchor) => {
                const currentWeight = mathParameters.anchorWeights[anchor.id] ?? anchor.weight;
                return (
                  <div key={anchor.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-800">{anchor.label}</span>
                      <span className="font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 text-[11px]">
                        {(currentWeight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentWeight}
                        onChange={(e) => setAnchorWeight(anchor.id, parseFloat(e.target.value))}
                        className="flex-1 accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Parámetros Rossmo */}
          <div className="pt-5 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-zinc-700" />
                Modelo Probabilístico Rossmo
              </h3>
              <p className="text-[11px] text-zinc-500">
                Ajuste del buffer de seguridad criminal y exponente de caída por distancia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Buffer B */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">Buffer de Confort (B)</span>
                  <span className="font-mono font-medium text-zinc-700">{mathParameters.bufferMeters} m</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  value={mathParameters.bufferMeters}
                  onChange={(e) => setBufferMeters(parseInt(e.target.value))}
                  className="w-full accent-zinc-900 h-1.5 bg-zinc-100 rounded cursor-pointer"
                />
                <p className="text-[10px] text-zinc-400">
                  Zona de descarte inmediato por proximidad visible a la escena.
                </p>
              </div>

              {/* Decay Exponent g */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">Exponente de Caída (g)</span>
                  <span className="font-mono font-medium text-zinc-700">{mathParameters.decayExponent.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.05"
                  value={mathParameters.decayExponent}
                  onChange={(e) => setDecayExponent(parseFloat(e.target.value))}
                  className="w-full accent-zinc-900 h-1.5 bg-zinc-100 rounded cursor-pointer"
                />
                <p className="text-[10px] text-zinc-400">
                  A mayor exponente, menor probabilidad a distancias largas.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Desfase y Capas adicionales */}
          <div className="pt-5 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-700" />
                Desfase Temporal & Capas Analíticas
              </h3>
            </div>

            <div className="space-y-3">
              {/* Sensitivity shift */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">Desfase sobre ventana judicial (21:45h)</span>
                  <span className="font-mono font-medium text-zinc-700">
                    {timeSensitivityShift > 0 ? `+${timeSensitivityShift}` : timeSensitivityShift} min
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={timeSensitivityShift}
                  onChange={(e) => setTimeSensitivityShift(parseInt(e.target.value))}
                  className="w-full accent-zinc-900 h-1.5 bg-zinc-100 rounded cursor-pointer"
                />
              </div>

              {/* Additional Layer switches */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-50 transition">
                  <input
                    type="checkbox"
                    checked={layerVisibility.heatmap}
                    onChange={() => toggleLayer('heatmap')}
                    className="accent-zinc-900 rounded"
                  />
                  <span className="text-zinc-700 font-medium">Malla de calor Rossmo</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-50 transition">
                  <input
                    type="checkbox"
                    checked={mapTheme === 'dark'}
                    onChange={(e) => setMapTheme(e.target.checked ? 'dark' : 'voyager')}
                    className="accent-zinc-900 rounded"
                  />
                  <span className="text-zinc-700 font-medium">Mapa en modo noche</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer valores por defecto
          </button>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
