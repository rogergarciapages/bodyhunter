'use client';

import React, { useMemo } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { MapPin, ArrowRight, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import { TimeConfidence } from '../lib/types/case';

export default function TestimoniesPanel() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const selectedVersion = useCaseStore((state) => state.selectedVersion);
  const selectedEventId = useCaseStore((state) => state.selectedEventId);
  const setSelectedEvent = useCaseStore((state) => state.setSelectedEvent);
  const setSelectedAnchor = useCaseStore((state) => state.setSelectedAnchor);
  const setSelectedPOI = useCaseStore((state) => state.setSelectedPOI);

  const filteredEvents = useMemo(() => {
    if (selectedVersion === 'all') return activeCase.timelineEvents;
    return activeCase.timelineEvents.filter(
      (ev) => ev.versionId === selectedVersion || ev.versionId === 'judicial'
    );
  }, [activeCase.timelineEvents, selectedVersion]);

  const handleSelectEvent = (ev: typeof activeCase.timelineEvents[0]) => {
    setSelectedEvent(ev.id);
    if (ev.locationRefId) {
      setSelectedAnchor(ev.locationRefId);
    }
    // Also try matching POI if version corresponds
    if (ev.versionId && ev.versionId !== 'judicial') {
      const poi = activeCase.pointsOfInterest.find((p) => p.versionId === ev.versionId);
      if (poi) {
        setSelectedPOI(poi.id);
      }
    }
  };

  const getConfidenceBadge = (confidence: TimeConfidence) => {
    switch (confidence) {
      case 'confirmed':
        return {
          label: 'Firme / Judicial',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-600" />,
        };
      case 'testimonial':
        return {
          label: 'Declaración Testimonial',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <HelpCircle className="w-3 h-3 text-amber-600" />,
        };
      case 'hypothesis':
      default:
        return {
          label: 'Hipótesis de Búsqueda',
          bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          icon: <FileText className="w-3 h-3 text-zinc-500" />,
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
          Versiones y Testimonios ({filteredEvents.length})
        </h3>
        <span className="text-[11px] text-zinc-400 font-mono">Cronología 24-25 Ene</span>
      </div>

      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {filteredEvents.map((ev) => {
          const badge = getConfidenceBadge(ev.timeConfidence);
          const isSelected = selectedEventId === ev.id;
          const d = new Date(ev.timestamp);
          const timeFormatted = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}h`;

          return (
            <div
              key={ev.id}
              onClick={() => handleSelectEvent(ev)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-1 ring-zinc-900'
                  : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-zinc-200' : 'text-zinc-900'}`}>
                    {timeFormatted}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${
                      isSelected ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : badge.bg
                    }`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`} />
              </div>

              <p className={`text-xs leading-relaxed mb-2.5 ${isSelected ? 'text-zinc-200' : 'text-zinc-700'}`}>
                {ev.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-150 text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ev.personsInvolved.map((person, pIdx) => (
                    <span
                      key={pIdx}
                      className={`px-1.5 py-0.2 rounded font-medium text-[10px] ${
                        isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {person}
                    </span>
                  ))}
                </div>
                {ev.sourceRef && (
                  <span className={`italic text-[10px] truncate max-w-[180px] ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {ev.sourceRef}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
