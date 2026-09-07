import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Wrench, User, Calendar, ChevronRight, Share2, Check } from 'lucide-react';
import { EquipmentSummary, MaintenanceActivity } from '../types';

interface EquipmentDetailViewProps {
  equipment: EquipmentSummary;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (equipmentName: string) => void;
  onSelectActivity: (activity: MaintenanceActivity) => void;
  onSelectResponsible?: (responsibleName: string) => void;
}

export const EquipmentDetailView: React.FC<EquipmentDetailViewProps> = ({
  equipment,
  isFavorite,
  onBack,
  onToggleFavorite,
  onSelectActivity,
  onSelectResponsible
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `Equipamento: ${equipment.name}\nÁrea: ${equipment.area}\nSubárea: ${equipment.subarea}\nAtividades: ${equipment.activitiesCount}\nResponsáveis: ${equipment.responsibles.join(', ')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="equipment-detail-container" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between py-1">
        <button
          id="equipment-detail-back-btn"
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#323130] hover:text-[#0078D4] bg-white border border-[#EDEBE9] px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={15} />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            id="equipment-share-btn"
            type="button"
            onClick={handleShare}
            title="Copiar dados do equipamento"
            className="w-9 h-9 rounded-xl bg-white border border-[#EDEBE9] flex items-center justify-center text-[#605E5C] hover:text-[#0078D4] shadow-sm transition-all"
          >
            {copied ? <Check size={16} className="text-[#107C41]" /> : <Share2 size={16} />}
          </button>
          <button
            id="equipment-toggle-fav-btn"
            type="button"
            onClick={() => onToggleFavorite(equipment.name)}
            aria-label="Favoritar"
            className="w-9 h-9 rounded-xl bg-white border border-[#EDEBE9] flex items-center justify-center text-[#F2C811] shadow-sm transition-all"
          >
            <Star
              size={18}
              className={isFavorite ? 'fill-[#F2C811] text-[#F2C811]' : 'text-[#EDEBE9] stroke-[#A19F9D]'}
            />
          </button>
        </div>
      </div>

      {/* Equipment Main Header Card (Geometric Balance Style) */}
      <div className="bg-white rounded-3xl border border-[#EDEBE9] p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#0078D4] text-white text-[10px] font-bold rounded uppercase">
                EQUIPAMENTO
              </span>
              <span className="text-[#605E5C] text-xs font-semibold">
                TAG ATIVA
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#323130] tracking-tight">
              {equipment.name}
            </h2>
          </div>
          {/* Circular Activity Badge as in Geometric Balance mockup */}
          <div
            title={`${equipment.activitiesCount} Atividades cadastradas`}
            className="w-14 h-14 rounded-full border-4 border-[#0078D4]/20 flex items-center justify-center text-[#0078D4] font-black text-xl shrink-0"
          >
            {equipment.activitiesCount}
          </div>
        </div>

        {/* Location & Details */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#EDEBE9]">
          <div>
            <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-wider">
              Área
            </p>
            <p className="text-sm font-semibold text-[#323130] mt-0.5 leading-tight">
              {equipment.area}
            </p>
            {equipment.subarea && equipment.subarea !== equipment.area && (
              <p className="text-[11px] text-[#605E5C] mt-0.5">
                Sub: {equipment.subarea}
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-wider">
              Responsável Principal
            </p>
            <p className="text-sm font-semibold text-[#323130] mt-0.5 leading-tight">
              {equipment.responsibles[0] || 'A definir'}
            </p>
          </div>
        </div>

        {/* Responsibles list if multiple */}
        {equipment.responsibles.length > 0 && (
          <div className="pt-2 border-t border-[#EDEBE9]">
            <span className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-wider block mb-1.5">
              Responsáveis no Equipamento:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {equipment.responsibles.map((resp) => (
                <button
                  key={resp}
                  type="button"
                  onClick={() => onSelectResponsible && onSelectResponsible(resp)}
                  className="text-xs bg-[#F3F2F1] hover:bg-[#0078D4]/10 hover:text-[#0078D4] text-[#323130] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                >
                  <User size={12} className="text-[#605E5C]" />
                  <span>{resp}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List of Activities (Geometric Balance border-l-4 style) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#323130] uppercase tracking-wider">
            Lista de Atividades ({equipment.activities.length})
          </h3>
          <span className="text-[11px] text-[#A19F9D] font-medium">
            Toque para detalhes
          </span>
        </div>

        {equipment.activities.map((act, index) => (
          <div
            key={act.id || index}
            id={`activity-card-${act.id || index}`}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBE9] border-l-4 border-l-[#0078D4] hover:shadow-md transition-all space-y-3"
          >
            {/* Responsável Header & Periodicity */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold bg-[#F3F2F1] px-2 py-1 rounded text-[#323130] uppercase flex items-center gap-1">
                <Calendar size={12} className="text-[#0078D4]" />
                {act.periodicity}
              </span>

              {act.activityType && (
                <span className="text-[10px] font-semibold text-[#605E5C] bg-[#F3F2F1] px-2 py-0.5 rounded">
                  {act.activityType}
                </span>
              )}
            </div>

            {/* Atividade Title & Description */}
            <div>
              <h4 className="text-base font-bold text-[#323130] leading-snug">
                {act.activityTitle}
              </h4>
              {act.description && (
                <p className="text-xs text-[#605E5C] line-clamp-2 mt-1">
                  {act.description}
                </p>
              )}
            </div>

            {/* Responsible Avatar & Name */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#EDEBE9]">
              <div className="w-6 h-6 bg-[#0078D4] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {act.responsible.charAt(0)}
              </div>
              <span className="text-xs font-bold text-[#323130] truncate">
                {act.responsible}
              </span>
            </div>

            {/* Button: [Ver Detalhes] (as requested) */}
            <div className="pt-1">
              <button
                id={`btn-view-details-${act.id || index}`}
                type="button"
                onClick={() => onSelectActivity(act)}
                className="w-full h-10 bg-[#F3F2F1] hover:bg-[#0078D4] hover:text-white text-[#323130] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Ver Detalhes</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
