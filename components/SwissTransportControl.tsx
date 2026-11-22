'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { Footprints, Bike as Motorbike, Car, Clock } from 'lucide-react';

export default function SwissTransportControl() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const selectedTransportProfileId = useCaseStore((state) => state.selectedTransportProfileId);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);

  const setSelectedTransportProfile = useCaseStore((state) => state.setSelectedTransportProfile);
  const setSelectedMinutes = useCaseStore((state) => state.setSelectedMinutes);
  const toggleLayer = useCaseStore((state) => state.toggleLayer);

  const activeProfile =
    activeCase.transportProfiles.find((p) => p.id === selectedTransportProfileId) ||
    activeCase.transportProfiles[0];

  const getIcon = (mode: string) => {
    switch (mode) {
      case 'WALKING':
        return <Footprints className="w-4 h-4" />;
      case 'MOTORCYCLE':
        return <Motorbike className="w-4 h-4" />;
      case 'CAR':
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const minutesOptions = [15, 30, 45, 60];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs">
      {/* 1. Transport Mode Selection */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden sm:inline">
          Modo:
        </span>
        <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/60">
          {activeCase.transportProfiles.map((profile) => {
            const isSelected = profile.id === selectedTransportProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => setSelectedTransportProfile(profile.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {getIcon(profile.mode)}
                <span>{profile.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Minutes Interval Selection */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1 hidden sm:flex">
          <Clock className="w-3 h-3" />
          Tiempo:
        </span>
        <div className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/60">
          {minutesOptions.map((mins) => {
            const isSelected = selectedMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => setSelectedMinutes(mins)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {mins} min
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Layer Quick Toggle */}
      <div className="flex items-center gap-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 font-medium">
          <input
            type="checkbox"
            checked={layerVisibility.isochrones}
            onChange={() => toggleLayer('isochrones')}
            className="w-4 h-4 rounded accent-zinc-900 cursor-pointer"
          />
          <span className="text-xs">Ver radio</span>
        </label>
      </div>
    </div>
  );
}
