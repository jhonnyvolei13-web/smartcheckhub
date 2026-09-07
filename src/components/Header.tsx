import React from 'react';
import { Cpu, FileText, CheckCircle2, Upload } from 'lucide-react';
import { CatalogMetadata } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  metadata: CatalogMetadata;
  onOpenArchitecture: () => void;
  onNavigateToFile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  onOpenArchitecture,
  onNavigateToFile
}) => {
  const hasData = metadata.totalEquipments > 0;

  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EDEBE9] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0078D4] flex items-center justify-center text-white shadow-sm">
            <Cpu size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0078D4] tracking-tight leading-tight flex items-center gap-1.5">
              SMARTCHECK HUB
            </h1>
            <p className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-[#107C41]' : 'bg-amber-500'} inline-block`} />
              {hasData ? `Planta Industrial • ${metadata.totalEquipments} Eq.` : 'Aguardando Planilha Real'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* In-app PWA install trigger button */}
          <PWAInstallButton variant="header" />

          {/* Quick file status button */}
          <button
            id="header-catalog-status-btn"
            type="button"
            onClick={onNavigateToFile}
            title={`Arquivo: ${metadata.fileName}`}
            className="flex items-center gap-1.5 text-xs bg-[#F3F2F1] hover:bg-[#EDEBE9] text-[#323130] border border-[#EDEBE9] px-2.5 py-1.5 rounded-xl font-medium transition-colors"
          >
            {hasData ? (
              <CheckCircle2 size={13} className="text-[#107C41]" />
            ) : (
              <Upload size={13} className="text-[#0078D4]" />
            )}
            <span className="max-w-[75px] truncate text-[11px] font-semibold">
              {hasData ? 'Excel Ativo' : 'Subir Excel'}
            </span>
          </button>

          {/* Architecture and specs modal button */}
          <button
            id="header-open-architecture-btn"
            type="button"
            onClick={onOpenArchitecture}
            title="Arquitetura, Wireframes e Especificações"
            aria-label="Ver Arquitetura e Modelagem do Sistema"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#605E5C] hover:text-[#0078D4] hover:bg-[#0078D4]/10 transition-colors"
          >
            <FileText size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};
