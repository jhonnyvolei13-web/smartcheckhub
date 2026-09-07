import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Star,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Wrench,
  Users,
  Layers,
  Upload,
  FileSpreadsheet,
  FileCheck,
  ArrowRight,
  X,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { EquipmentSummary } from '../types';

interface HomeScreenProps {
  equipments: EquipmentSummary[];
  recentSearches: string[];
  favorites: string[];
  onSearchSubmit: (query: string) => void;
  onSelectEquipment: (equipment: EquipmentSummary) => void;
  onToggleFavorite: (equipmentName: string) => void;
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (query: string) => void;
  onNavigateToSearch: () => void;
  onNavigateToFile?: () => void;
  onFileUpload?: (file: File) => Promise<void>;
  isLoadingFile?: boolean;
}

interface SubareaGroup {
  subareaName: string;
  areaName: string;
  equipments: EquipmentSummary[];
  totalActivities: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  equipments,
  recentSearches,
  favorites,
  onSearchSubmit,
  onSelectEquipment,
  onToggleFavorite,
  onClearRecentSearches,
  onRemoveRecentSearch,
  onNavigateToSearch,
  onNavigateToFile,
  onFileUpload,
  isLoadingFile = false
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [expandedSubareas, setExpandedSubareas] = useState<Set<string>>(new Set());
  const homeFileInputRef = useRef<HTMLInputElement>(null);

  // Group and sort equipments strictly by subarea and alphabetical order
  const subareaGroups = useMemo<SubareaGroup[]>(() => {
    const map = new Map<string, { areaName: string; equipments: EquipmentSummary[] }>();

    for (const eq of equipments) {
      const sub = (eq.subarea || eq.area || 'Geral').trim();
      if (!map.has(sub)) {
        map.set(sub, { areaName: eq.area || 'Planta Industrial', equipments: [] });
      }
      map.get(sub)!.equipments.push(eq);
    }

    const groups: SubareaGroup[] = [];

    for (const [subareaName, data] of map.entries()) {
      // Sort equipments alphabetically (A-Z) by name
      const sortedEquipments = [...data.equipments].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { numeric: true, sensitivity: 'base' })
      );

      const totalActivities = sortedEquipments.reduce((sum, e) => sum + e.activitiesCount, 0);

      groups.push({
        subareaName,
        areaName: data.areaName,
        equipments: sortedEquipments,
        totalActivities
      });
    }

    // Sort subareas alphabetically (A-Z)
    return groups.sort((a, b) =>
      a.subareaName.localeCompare(b.subareaName, 'pt-BR', { numeric: true, sensitivity: 'base' })
    );
  }, [equipments]);

  // Filter groups if user enters text into searchInput
  const filteredSubareaGroups = useMemo(() => {
    const term = searchInput.trim().toLowerCase();
    if (!term) return subareaGroups;

    return subareaGroups
      .map(group => {
        const subareaMatch = group.subareaName.toLowerCase().includes(term);
        const areaMatch = group.areaName.toLowerCase().includes(term);

        // Filter equipments that match by name, responsible, or activity titles
        const matchingEquipments = group.equipments.filter(eq => {
          if (subareaMatch || areaMatch) return true;
          if (eq.name.toLowerCase().includes(term)) return true;
          if (eq.responsibles.some(r => r.toLowerCase().includes(term))) return true;
          return false;
        });

        if (subareaMatch || areaMatch || matchingEquipments.length > 0) {
          return {
            ...group,
            equipments: matchingEquipments
          };
        }
        return null;
      })
      .filter((g): g is SubareaGroup => g !== null);
  }, [subareaGroups, searchInput]);

  // Toggle single subarea expansion
  const toggleSubarea = (subareaName: string) => {
    setExpandedSubareas(prev => {
      const next = new Set(prev);
      if (next.has(subareaName)) {
        next.delete(subareaName);
      } else {
        next.add(subareaName);
      }
      return next;
    });
  };

  // Expand all / Collapse all helpers
  const handleExpandAll = () => {
    const allNames = filteredSubareaGroups.map(g => g.subareaName);
    setExpandedSubareas(new Set(allNames));
  };

  const handleCollapseAll = () => {
    setExpandedSubareas(new Set());
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      await onFileUpload(file);
      if (homeFileInputRef.current) homeFileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onFileUpload) {
      await onFileUpload(file);
    }
  };

  // Find user-selected favorite equipments
  const favoriteEquipments = equipments.filter(eq => favorites.includes(eq.name));
  const totalActivities = equipments.reduce((acc, eq) => acc + eq.activitiesCount, 0);

  // 1. BLANK STATE: When no spreadsheet has been uploaded yet
  if (equipments.length === 0) {
    return (
      <div id="home-screen-empty-container" className="space-y-5 pb-24 px-4 pt-3 max-w-md mx-auto">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#0078D4] uppercase tracking-wider bg-[#0078D4]/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              Catálogo Pronto
            </span>
            <span className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-wider">
              Aguardando Planilha
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0078D4] pt-1">
            SMARTCHECK HUB
          </h1>
          <p className="text-xs text-[#605E5C] leading-relaxed">
            Todas as informações fictícias foram removidas. Suba sua planilha real do SmartCheck para visualizar as subáreas e equipamentos em ordem alfabética.
          </p>
        </div>

        {/* Hidden File Input for Direct Upload */}
        <input
          ref={homeFileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Primary Upload Hero Card */}
        <div
          id="home-upload-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-3xl border-2 p-6 shadow-sm text-center space-y-4 transition-all ${
            dragOver
              ? 'border-[#0078D4] bg-[#0078D4]/5'
              : 'border-[#EDEBE9] hover:border-[#0078D4]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center mx-auto">
            {isLoadingFile ? (
              <div className="w-7 h-7 border-3 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet size={32} className="text-[#107C41]" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#323130]">
              {isLoadingFile ? 'Processando Planilha...' : 'Subir Arquivo Real do SmartCheck'}
            </h3>
            <p className="text-xs text-[#605E5C] max-w-xs mx-auto leading-relaxed">
              Arraste seu arquivo <strong>.xlsx</strong> ou <strong>.xls</strong> aqui, ou clique no botão abaixo para selecionar do dispositivo.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              id="home-btn-upload-file"
              type="button"
              disabled={isLoadingFile}
              onClick={() => homeFileInputRef.current?.click()}
              className="w-full h-11 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Upload size={16} />
              <span>{isLoadingFile ? 'Carregando Dados...' : 'Selecionar Arquivo do Dispositivo'}</span>
            </button>

            {onNavigateToFile && (
              <button
                type="button"
                onClick={onNavigateToFile}
                className="w-full h-9 bg-transparent hover:bg-[#F3F2F1] text-[#605E5C] hover:text-[#323130] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Ver detalhes na aba Arquivo</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Expected Format Specs */}
        <div className="bg-[#F3F2F1] rounded-2xl p-4 border border-[#EDEBE9] text-[#605E5C] text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[#323130] font-bold text-xs">
            <FileCheck size={14} className="text-[#107C41]" />
            <span>Estrutura de Agrupamento:</span>
          </div>
          <p className="text-[11px] text-[#605E5C] leading-relaxed">
            Na tela inicial aparecerão apenas as <strong>Subáreas</strong>. Ao tocar em cada subárea, seus respectivos <strong>Equipamentos em ordem alfabética</strong> se expandem. Ao tocar no equipamento, abrirão as atividades e responsáveis.
          </p>
        </div>
      </div>
    );
  }

  // 2. ACTIVE STATE: Display all equipments grouped by subarea
  const isSearching = searchInput.trim().length > 0;

  return (
    <div id="home-screen-container" className="space-y-4 pb-24 px-4 pt-3 max-w-md mx-auto">
      {/* Title & Hub Greeting */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#0078D4] uppercase tracking-wider bg-[#0078D4]/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Layers size={11} className="text-[#0078D4]" /> Navegação por Subárea
          </span>
          <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">
            {subareaGroups.length} {subareaGroups.length === 1 ? 'Subárea' : 'Subáreas'} • {equipments.length} Eq.
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0078D4] pt-1">
          SMARTCHECK HUB
        </h1>
        <p className="text-xs text-[#605E5C] leading-relaxed">
          Selecione uma <strong>subárea</strong> para visualizar seus equipamentos em ordem alfabética. Clique no equipamento para ver atividades e responsáveis.
        </p>
      </div>

      {/* Quick Search / Filter Input */}
      <div className="relative">
        <div className="relative flex items-center bg-white rounded-xl border border-[#EDEBE9] shadow-sm focus-within:ring-2 focus-within:ring-[#0078D4] focus-within:border-[#0078D4] transition-all">
          <div className="pl-3.5 text-[#605E5C] flex items-center justify-center">
            <Search size={18} strokeWidth={2} />
          </div>
          <input
            id="home-subarea-filter-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Filtrar subárea ou equipamento..."
            autoComplete="off"
            className="w-full py-3 pl-3 pr-10 text-sm font-medium text-[#323130] placeholder:text-[#A19F9D] bg-transparent focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-3 p-1 text-[#A19F9D] hover:text-[#323130] rounded-full hover:bg-[#F3F2F1]"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Subarea Controls Header (Expand / Collapse All) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#323130] uppercase tracking-wider">
            Subáreas Cadastradas ({filteredSubareaGroups.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExpandAll}
            className="text-[11px] font-semibold text-[#0078D4] hover:underline"
          >
            Expandir todas
          </button>
          <span className="text-[#EDEBE9] text-xs">|</span>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="text-[11px] font-semibold text-[#605E5C] hover:underline"
          >
            Recolher
          </button>
        </div>
      </div>

      {/* Subarea List (Accordion Hierarchy) */}
      {filteredSubareaGroups.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-[#EDEBE9] shadow-sm space-y-2">
          <p className="text-xs font-bold text-[#323130]">Nenhuma subárea ou equipamento encontrado</p>
          <p className="text-[11px] text-[#605E5C]">
            Não encontramos resultados para &quot;{searchInput}&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="text-xs font-bold text-[#0078D4] hover:underline pt-1"
          >
            Limpar filtro
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubareaGroups.map((group) => {
            // When searching, auto-expand if there are matching equipments
            const isExpanded = isSearching ? true : expandedSubareas.has(group.subareaName);

            return (
              <div
                key={group.subareaName}
                id={`subarea-card-${group.subareaName.replace(/\s+/g, '-').toLowerCase()}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded ? 'border-[#0078D4] ring-1 ring-[#0078D4]/10' : 'border-[#EDEBE9] hover:border-[#0078D4]'
                }`}
              >
                {/* Subarea Header Trigger (Clickable) */}
                <button
                  type="button"
                  onClick={() => toggleSubarea(group.subareaName)}
                  aria-expanded={isExpanded}
                  className={`w-full text-left p-4 flex items-center justify-between gap-3 transition-colors ${
                    isExpanded ? 'bg-[#0078D4]/5' : 'bg-white hover:bg-[#F3F2F1]/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isExpanded
                          ? 'bg-[#0078D4] text-white'
                          : 'bg-[#F3F2F1] text-[#0078D4]'
                      }`}
                    >
                      {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#323130] truncate leading-tight">
                          {group.subareaName}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#605E5C] truncate mt-0.5">
                        Área: {group.areaName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-[#0078D4] bg-white border border-[#EDEBE9] px-2.5 py-1 rounded-lg shadow-2xs">
                      {group.equipments.length} {group.equipments.length === 1 ? 'equipamento' : 'equipamentos'}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform text-[#605E5C] ${
                        isExpanded ? 'rotate-180 text-[#0078D4]' : ''
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {/* Expanded Equipment List (Only appears when subarea is clicked) */}
                {isExpanded && (
                  <div className="p-3 pt-1 border-t border-[#EDEBE9] bg-[#F3F2F1]/40 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A19F9D]">
                      <span>Equipamentos em Ordem Alfabética (A-Z)</span>
                      <span>{group.equipments.length} itens</span>
                    </div>

                    <div className="space-y-1.5">
                      {group.equipments.map((eq, eqIdx) => {
                        const isFav = favorites.includes(eq.name);

                        return (
                          <div
                            key={eq.name}
                            id={`eq-item-${eq.name.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => onSelectEquipment(eq)}
                            className="bg-white rounded-xl border border-[#EDEBE9] hover:border-[#0078D4] hover:shadow-sm p-3 flex items-center justify-between gap-2.5 cursor-pointer group transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="w-5 h-5 rounded-md bg-[#F3F2F1] group-hover:bg-[#0078D4]/10 group-hover:text-[#0078D4] text-[#605E5C] text-[10px] font-bold flex items-center justify-center shrink-0">
                                {eqIdx + 1}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  {isFav && <span className="text-[#F2C811] text-xs">★</span>}
                                  <h4 className="text-xs sm:text-sm font-bold text-[#323130] group-hover:text-[#0078D4] transition-colors truncate">
                                    {eq.name}
                                  </h4>
                                </div>
                                <div className="text-[10px] text-[#605E5C] truncate mt-0.5">
                                  {eq.responsibles.length > 0
                                    ? `Resp: ${eq.responsibles.join(', ')}`
                                    : 'Sem responsável definido'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-bold text-[#0078D4] bg-[#0078D4]/10 px-2 py-0.5 rounded-md">
                                {eq.activitiesCount} {eq.activitiesCount === 1 ? 'ativ.' : 'ativ.'}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(eq.name);
                                }}
                                aria-label="Favoritar"
                                className="p-1 text-[#A19F9D] hover:text-[#F2C811] transition-transform"
                              >
                                <Star
                                  size={15}
                                  className={isFav ? 'fill-[#F2C811] text-[#F2C811]' : 'text-[#A19F9D]'}
                                />
                              </button>

                              <div className="text-[#605E5C] group-hover:text-[#0078D4] group-hover:translate-x-0.5 transition-transform pl-0.5">
                                <ChevronRight size={15} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Favorites Section (if user has marked any) */}
      {favoriteEquipments.length > 0 && (
        <section id="section-favorite-equipments" className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#323130] uppercase tracking-wider flex items-center gap-1.5">
              <Star size={13} className="text-[#F2C811] fill-[#F2C811]" />
              Equipamentos Favoritos ({favoriteEquipments.length})
            </h3>
          </div>

          <div className="space-y-2">
            {favoriteEquipments.map((eq) => (
              <div
                key={eq.name}
                id={`fav-card-${eq.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="p-3.5 rounded-xl bg-white border border-[#EDEBE9] shadow-sm hover:border-[#0078D4] transition-all flex justify-between items-center group cursor-pointer"
                onClick={() => onSelectEquipment(eq)}
              >
                <div className="flex-1 pr-2 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#F2C811]">★</span>
                    <span className="text-xs sm:text-sm font-bold text-[#323130] group-hover:text-[#0078D4] transition-colors truncate">
                      {eq.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5 truncate">
                    Subárea: {eq.subarea} • Área: {eq.area}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-[#0078D4] font-bold text-[10px] bg-[#0078D4]/10 px-2 py-0.5 rounded-md">
                    {eq.activitiesCount} ativ.
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(eq.name);
                    }}
                    aria-label="Remover favorito"
                    className="p-1 text-[#F2C811] hover:scale-110 transition-transform"
                  >
                    <Star size={16} className="fill-[#F2C811] text-[#F2C811]" />
                  </button>
                  <ChevronRight size={14} className="text-[#605E5C] group-hover:text-[#0078D4]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary Stats Banner */}
      <div className="mt-4 bg-[#201F1E] text-white rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-[10px] text-[#A19F9D] font-bold uppercase tracking-wider">Subáreas</div>
            <div className="text-lg font-bold">{subareaGroups.length}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#A19F9D] font-bold uppercase tracking-wider">Equipamentos</div>
            <div className="text-lg font-bold">{equipments.length}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#A19F9D] font-bold uppercase tracking-wider">Atividades</div>
            <div className="text-lg font-bold">{totalActivities}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <div className="px-3 py-1 bg-[#0078D4] rounded-full text-[10px] font-bold">
            ORDEM A-Z
          </div>
        </div>
      </div>
    </div>
  );
};
