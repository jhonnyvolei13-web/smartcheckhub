import React, { useState } from 'react';
import { X, User, Clock, FileText, MapPin, Cpu, Check, Copy, ArrowRight } from 'lucide-react';
import { MaintenanceActivity } from '../types';

interface ActivityDetailModalProps {
  activity: MaintenanceActivity | null;
  onClose: () => void;
  onSelectResponsible?: (responsibleName: string) => void;
  onSelectEquipmentByName?: (equipmentName: string) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
  onSelectResponsible,
  onSelectEquipmentByName
}) => {
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const handleCopy = () => {
    const text = `Equipamento: ${activity.equipment}\nResponsável: ${activity.responsible}\nAtividade: ${activity.activityTitle}\nPeriodicidade: ${activity.periodicity}\nÁrea: ${activity.area} (${activity.subarea})\n\nDescrição:\n${activity.description}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="activity-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-[#201F1E]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="activity-detail-modal-card"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl border border-[#EDEBE9] max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Handle & Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#EDEBE9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-[#0078D4] uppercase tracking-wider px-2 py-0.5 rounded">
              Detalhes da Atividade
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              title="Copiar texto da atividade"
              className="p-1.5 text-[#605E5C] hover:text-[#0078D4] rounded-lg hover:bg-[#F3F2F1] transition-colors"
            >
              {copied ? <Check size={18} className="text-[#107C41]" /> : <Copy size={18} />}
            </button>
            <button
              id="close-activity-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#605E5C] hover:text-[#323130] rounded-lg hover:bg-[#F3F2F1] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Equipamento & Localização */}
          <div className="bg-[#F3F2F1] rounded-2xl p-4 border border-[#EDEBE9] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#A19F9D] flex items-center gap-1">
                <Cpu size={12} className="text-[#0078D4]" /> Equipamento
              </span>
              {onSelectEquipmentByName && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectEquipmentByName(activity.equipment);
                  }}
                  className="text-[11px] font-bold text-[#0078D4] hover:underline flex items-center gap-0.5"
                >
                  Ver Equipamento <ArrowRight size={11} />
                </button>
              )}
            </div>
            <h3 className="text-base font-bold text-[#323130] tracking-tight">
              {activity.equipment}
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#605E5C] pt-0.5">
              <MapPin size={13} className="text-[#A19F9D] shrink-0" />
              <span>{activity.area}</span>
              {activity.subarea && activity.subarea !== activity.area && (
                <span className="text-[#A19F9D]">• {activity.subarea}</span>
              )}
            </div>
          </div>

          {/* Atividade (Título) */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#A19F9D] tracking-wider">
              Atividade
            </span>
            <h4 className="text-lg font-bold text-[#323130] leading-snug">
              {activity.activityTitle}
            </h4>
            {activity.activityType && (
              <span className="inline-block text-xs font-semibold text-[#0078D4] bg-[#0078D4]/10 px-2 py-0.5 rounded">
                {activity.activityType}
              </span>
            )}
          </div>

          {/* Grid: Responsável & Periodicidade */}
          <div className="grid grid-cols-2 gap-3">
            {/* Responsável */}
            <div className="bg-white border border-[#EDEBE9] rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A19F9D] flex items-center gap-1">
                <User size={12} className="text-[#107C41]" /> Responsável
              </span>
              <p className="text-xs font-bold text-[#323130] break-words leading-tight">
                {activity.responsible}
              </p>
              {onSelectResponsible && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectResponsible(activity.responsible);
                  }}
                  className="text-[10px] font-bold text-[#0078D4] hover:underline block pt-1"
                >
                  Ver atribuições →
                </button>
              )}
            </div>

            {/* Periodicidade */}
            <div className="bg-white border border-[#EDEBE9] rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A19F9D] flex items-center gap-1">
                <Clock size={12} className="text-[#0078D4]" /> Periodicidade
              </span>
              <p className="text-xs font-bold text-[#323130] leading-tight">
                {activity.periodicity}
              </p>
              <span className="text-[10px] text-[#A19F9D] block pt-0.5">
                Rotina industrial
              </span>
            </div>
          </div>

          {/* Descrição Completa */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-[#A19F9D] tracking-wider flex items-center gap-1">
              <FileText size={12} className="text-[#605E5C]" /> Descrição Completa
            </span>
            <div className="bg-[#F3F2F1] border border-[#EDEBE9] rounded-2xl p-4 text-xs font-medium text-[#323130] leading-relaxed whitespace-pre-wrap select-text">
              {activity.description || 'Nenhuma descrição detalhada fornecida nesta atividade.'}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-[#EDEBE9] bg-white">
          <button
            id="activity-modal-close-main-btn"
            type="button"
            onClick={onClose}
            className="w-full h-11 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
