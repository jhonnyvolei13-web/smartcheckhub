import React, { useState, useMemo } from 'react';
import { Search, User, Wrench, Cpu, MapPin, Calendar, ChevronRight, ArrowLeft, Clock, FileText } from 'lucide-react';
import { ResponsibleSummary, MaintenanceActivity } from '../types';
import { normalizeSearchString } from '../utils/searchEngine';

interface ResponsiblesScreenProps {
  responsibles: ResponsibleSummary[];
  selectedResponsibleName: string | null;
  onSelectResponsible: (name: string | null) => void;
  onSelectEquipmentByName: (equipmentName: string) => void;
  onSelectActivity: (activity: MaintenanceActivity) => void;
  onNavigateToFile?: () => void;
}

export const ResponsiblesScreen: React.FC<ResponsiblesScreenProps> = ({
  responsibles,
  selectedResponsibleName,
  onSelectResponsible,
  onSelectEquipmentByName,
  onSelectActivity,
  onNavigateToFile
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // If a responsible is selected, show their full profile view
  const selectedResponsible = useMemo(() => {
    if (!selectedResponsibleName) return null;
    return responsibles.find(
      r => normalizeSearchString(r.name) === normalizeSearchString(selectedResponsibleName)
    ) || null;
  }, [responsibles, selectedResponsibleName]);

  // Filter list of responsibles
  const filteredResponsibles = useMemo(() => {
    if (!searchTerm.trim()) return responsibles;
    const norm = normalizeSearchString(searchTerm);
    return responsibles.filter(r =>
      normalizeSearchString(r.name).includes(norm) ||
      r.equipments.some(eq => normalizeSearchString(eq).includes(norm)) ||
      r.areas.some(ar => normalizeSearchString(ar).includes(norm))
    );
  }, [responsibles, searchTerm]);

  // Detailed view of a responsible
  if (selectedResponsible) {
    return (
      <div id="responsible-detail-container" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto">
        {/* Back navigation */}
        <button
          id="responsible-back-to-list-btn"
          type="button"
          onClick={() => onSelectResponsible(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#323130] hover:text-[#0078D4] bg-white border border-[#EDEBE9] px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={15} />
          <span>Todos os Responsáveis</span>
        </button>

        {/* Responsible Profile Card */}
        <div className="bg-white rounded-3xl border border-[#EDEBE9] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#0078D4] text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              {selectedResponsible.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold text-white bg-[#0078D4] uppercase tracking-wider px-2 py-0.5 rounded">
                Responsável Técnico
              </span>
              <h2 className="text-xl font-bold text-[#323130] tracking-tight leading-tight mt-1">
                {selectedResponsible.name}
              </h2>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EDEBE9]">
            <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
              <span className="text-[10px] font-bold text-[#A19F9D] block uppercase tracking-wider">
                Equipamentos
              </span>
              <span className="text-xl font-bold text-[#323130]">
                {selectedResponsible.equipmentsCount}
              </span>
            </div>
            <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
              <span className="text-[10px] font-bold text-[#A19F9D] block uppercase tracking-wider">
                Atividades
              </span>
              <span className="text-xl font-bold text-[#0078D4]">
                {selectedResponsible.activitiesCount}
              </span>
            </div>
          </div>

          {/* Equipamentos Atribuídos Badges */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-[#A19F9D] block mb-1.5 uppercase tracking-wider">
              Equipamentos Atribuídos:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedResponsible.equipments.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => onSelectEquipmentByName(eq)}
                  className="text-xs font-bold bg-[#F3F2F1] text-[#323130] hover:bg-[#0078D4] hover:text-white px-3 py-1.5 rounded-xl border border-[#EDEBE9] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Cpu size={12} />
                  <span>{eq}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of Assigned Activities */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-[#323130] uppercase tracking-wider">
              Todas as Atividades Atribuídas ({selectedResponsible.activities.length})
            </h3>
            <span className="text-[11px] text-[#A19F9D]">
              Toque para ver detalhes
            </span>
          </div>

          {selectedResponsible.activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-[#EDEBE9] border-l-4 border-l-[#0078D4] hover:shadow-md p-5 shadow-sm space-y-3 transition-all"
            >
              {/* Equipment & Periodicity Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#EDEBE9] pb-2.5">
                <button
                  type="button"
                  onClick={() => onSelectEquipmentByName(act.equipment)}
                  className="text-left font-bold text-xs text-[#0078D4] hover:underline flex items-center gap-1.5"
                >
                  <Cpu size={14} />
                  <span>{act.equipment}</span>
                </button>
                <span className="text-[10px] font-bold text-[#323130] bg-[#F3F2F1] px-2.5 py-1 rounded uppercase flex items-center gap-1 shrink-0">
                  <Clock size={11} className="text-[#0078D4]" />
                  {act.periodicity}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-[#323130] leading-snug">
                {act.activityTitle}
              </h4>

              {/* Area & Subarea */}
              <div className="flex items-center gap-1 text-xs text-[#605E5C]">
                <MapPin size={13} className="text-[#A19F9D] shrink-0" />
                <span className="truncate">{act.area}</span>
                {act.subarea && act.subarea !== act.area && (
                  <span className="text-[#A19F9D] truncate">• {act.subarea}</span>
                )}
              </div>

              {/* Short Description */}
              {act.description && (
                <p className="text-xs text-[#605E5C] line-clamp-2 bg-[#F3F2F1] p-2.5 rounded-xl border border-[#EDEBE9]">
                  {act.description}
                </p>
              )}

              {/* Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectActivity(act)}
                  className="w-full h-10 bg-[#F3F2F1] hover:bg-[#0078D4] hover:text-white text-[#323130] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Ver Detalhes da Atividade</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Master List View of all Responsibles
  return (
    <div id="responsibles-screen-container" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#323130] tracking-tight">
          Responsáveis por Equipamentos
        </h2>
        <p className="text-xs text-[#605E5C]">
          Supervisores e técnicos cadastrados no SmartCheck.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center bg-white rounded-xl border border-[#EDEBE9] shadow-sm focus-within:border-[#0078D4] focus-within:ring-2 focus-within:ring-[#0078D4]/20 transition-all">
        <div className="pl-3.5 text-[#605E5C]">
          <Search size={18} />
        </div>
        <input
          id="responsibles-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por nome ou equipamento..."
          className="w-full py-3.5 pl-3 pr-4 text-sm font-medium text-[#323130] placeholder:text-[#A19F9D] bg-transparent focus:outline-none"
        />
      </div>

      {/* List of cards */}
      <div className="space-y-3">
        {responsibles.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#EDEBE9] shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center mx-auto">
              <User size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#323130]">Nenhum Responsável Cadastrado</h3>
              <p className="text-xs text-[#605E5C] max-w-xs mx-auto leading-relaxed">
                O catálogo está limpo. Suba sua planilha real do SmartCheck na aba Arquivo para visualizar os técnicos e supervisores.
              </p>
            </div>
            {onNavigateToFile && (
              <button
                type="button"
                onClick={onNavigateToFile}
                className="w-full h-11 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Carregar Planilha Real
              </button>
            )}
          </div>
        ) : filteredResponsibles.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#EDEBE9] shadow-sm">
            <p className="text-xs text-[#605E5C]">Nenhum responsável encontrado para &quot;{searchTerm}&quot;.</p>
          </div>
        ) : (
          filteredResponsibles.map((resp) => (
            <div
              key={resp.name}
              id={`resp-card-${resp.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelectResponsible(resp.name)}
              className="group bg-white rounded-2xl border border-[#EDEBE9] hover:border-[#0078D4] shadow-sm p-4 cursor-pointer transition-all hover:shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#0078D4]/10 text-[#0078D4] group-hover:bg-[#0078D4] group-hover:text-white flex items-center justify-center font-bold text-base transition-colors shrink-0">
                  {resp.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#323130] group-hover:text-[#0078D4] truncate transition-colors">
                    {resp.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#605E5C] mt-0.5">
                    <span>
                      <strong className="text-[#323130]">{resp.equipmentsCount}</strong> equipamentos
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#323130]">{resp.activitiesCount}</strong> atividades
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#F3F2F1] group-hover:bg-[#0078D4]/10 text-[#A19F9D] group-hover:text-[#0078D4] flex items-center justify-center transition-colors shrink-0 ml-2">
                <ChevronRight size={18} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
