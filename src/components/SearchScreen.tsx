import React, { useState, useMemo } from 'react';
import { Search, X, Star, MapPin, Users, Wrench, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { EquipmentSummary } from '../types';
import { searchEquipments } from '../utils/searchEngine';

interface SearchScreenProps {
  equipments: EquipmentSummary[];
  initialQuery?: string;
  favorites: string[];
  onSelectEquipment: (equipment: EquipmentSummary) => void;
  onToggleFavorite: (equipmentName: string) => void;
  onSelectResponsible?: (responsibleName: string) => void;
  onNavigateToFile?: () => void;
}

type FilterCategory = 'all' | 'equipment' | 'area' | 'responsible';

export const SearchScreen: React.FC<SearchScreenProps> = ({
  equipments,
  initialQuery = '',
  favorites,
  onSelectEquipment,
  onToggleFavorite,
  onSelectResponsible,
  onNavigateToFile
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<FilterCategory>('all');

  const filteredResults = useMemo(() => {
    return searchEquipments(equipments, query, category);
  }, [equipments, query, category]);

  // Dynamically derive quick chips from real equipments
  const quickChips = useMemo(() => {
    return Array.from(new Set(equipments.map(e => e.name))).slice(0, 5);
  }, [equipments]);

  // If no equipment data exists at all
  if (equipments.length === 0) {
    return (
      <div id="search-screen-empty" className="space-y-4 pb-24 px-4 pt-6 max-w-md mx-auto text-center">
        <div className="bg-white rounded-3xl p-8 border border-[#EDEBE9] shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center mx-auto">
            <FileSpreadsheet size={28} className="text-[#0078D4]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#323130]">Catálogo em Branco</h3>
            <p className="text-xs text-[#605E5C] leading-relaxed max-w-xs mx-auto">
              Nenhum dado cadastrado. Suba a planilha do SmartCheck para buscar equipamentos, áreas e responsáveis.
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
      </div>
    );
  }

  return (
    <div id="search-screen-container" className="space-y-3 pb-24 px-4 pt-2 max-w-md mx-auto">
      {/* Sticky Search Header */}
      <div className="sticky top-14 z-20 bg-[#F3F2F1]/95 backdrop-blur-md pt-2 pb-2 -mx-4 px-4 space-y-2.5">
        {/* Search Input Bar */}
        <div className="relative flex items-center bg-white rounded-xl border border-[#EDEBE9] shadow-sm focus-within:border-[#0078D4] focus-within:ring-2 focus-within:ring-[#0078D4]/20 transition-all">
          <div className="pl-3.5 text-[#605E5C]">
            <Search size={18} />
          </div>
          <input
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por equipamento, área, responsável..."
            autoFocus={!initialQuery}
            className="w-full py-3 pl-3 pr-10 text-sm font-medium text-[#323130] placeholder:text-[#A19F9D] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              id="search-clear-query-btn"
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-[#A19F9D] hover:text-[#323130] rounded-full hover:bg-[#F3F2F1]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              category === 'all'
                ? 'bg-[#0078D4] text-white shadow-sm'
                : 'bg-white text-[#605E5C] border border-[#EDEBE9] hover:bg-[#F3F2F1]'
            }`}
          >
            Todos ({filteredResults.length})
          </button>
          <button
            type="button"
            onClick={() => setCategory('equipment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              category === 'equipment'
                ? 'bg-[#0078D4] text-white shadow-sm'
                : 'bg-white text-[#605E5C] border border-[#EDEBE9] hover:bg-[#F3F2F1]'
            }`}
          >
            Equipamentos
          </button>
          <button
            type="button"
            onClick={() => setCategory('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              category === 'area'
                ? 'bg-[#0078D4] text-white shadow-sm'
                : 'bg-white text-[#605E5C] border border-[#EDEBE9] hover:bg-[#F3F2F1]'
            }`}
          >
            Áreas / Subáreas
          </button>
          <button
            type="button"
            onClick={() => setCategory('responsible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              category === 'responsible'
                ? 'bg-[#0078D4] text-white shadow-sm'
                : 'bg-white text-[#605E5C] border border-[#EDEBE9] hover:bg-[#F3F2F1]'
            }`}
          >
            Responsáveis
          </button>
        </div>

        {/* Quick chips if query is empty and we have chips */}
        {!query && quickChips.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-medium text-[#A19F9D] shrink-0">Sugestões:</span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setQuery(chip)}
                className="px-2.5 py-1 bg-white border border-[#EDEBE9] rounded-md text-[11px] font-medium text-[#323130] hover:text-[#0078D4] hover:border-[#0078D4] shrink-0 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs text-[#605E5C] px-0.5">
        <span>
          {filteredResults.length} {filteredResults.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}
        </span>
        {query && (
          <span className="font-semibold text-[#0078D4]">
            Filtro: &quot;{query}&quot;
          </span>
        )}
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#EDEBE9] shadow-sm space-y-3 mt-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F2F1] flex items-center justify-center mx-auto text-[#A19F9D]">
            <Search size={24} />
          </div>
          <h3 className="text-sm font-bold text-[#323130]">
            Nenhum equipamento encontrado
          </h3>
          <p className="text-xs text-[#605E5C] max-w-xs mx-auto">
            Não encontramos registros para &quot;{query}&quot;. Tente pesquisar pelo nome do equipamento, área ou responsável.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="text-xs font-bold text-[#0078D4] hover:underline"
          >
            Limpar filtros de pesquisa
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((eq) => {
            const isFav = favorites.includes(eq.name);

            return (
              <div
                key={eq.name}
                id={`equipment-card-${eq.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="bg-white rounded-2xl border border-[#EDEBE9] shadow-sm hover:border-[#0078D4] transition-all p-5 flex flex-col justify-between"
              >
                {/* Header: Title and Favorite */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#323130] tracking-tight flex items-center gap-1.5">
                      {isFav && <span className="text-[#F2C811] text-sm">★</span>}
                      {eq.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#605E5C] mt-1">
                      <MapPin size={13} className="text-[#A19F9D] shrink-0" />
                      <span className="font-medium">{eq.area}</span>
                    </div>
                    {eq.subarea && eq.subarea !== eq.area && (
                      <div className="text-[11px] text-[#A19F9D] ml-4">
                        Subárea: {eq.subarea}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(eq.name)}
                    aria-label="Favoritar equipamento"
                    className="p-1.5 text-[#A19F9D] hover:text-[#F2C811] active:scale-90 transition-transform"
                  >
                    <Star
                      size={18}
                      className={isFav ? 'fill-[#F2C811] text-[#F2C811]' : 'text-[#A19F9D]'}
                    />
                  </button>
                </div>

                {/* Quick Info Badges */}
                <div className="mt-4 pt-3 border-t border-[#EDEBE9] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#605E5C]">
                    <span className="flex items-center gap-1">
                      <Wrench size={13} className="text-[#0078D4]" />
                      <strong>{eq.activitiesCount}</strong> atividades
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-[#605E5C]" />
                      <strong>{eq.responsiblesCount}</strong> resp.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectEquipment(eq)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0078D4] hover:text-[#106EBE] bg-[#0078D4]/10 hover:bg-[#0078D4]/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Ver Atividades</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Responsibles pills */}
                {eq.responsibles.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {eq.responsibles.slice(0, 3).map((resp) => (
                      <button
                        key={resp}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectResponsible) {
                            onSelectResponsible(resp);
                          }
                        }}
                        className="text-[10px] font-medium bg-[#F3F2F1] hover:bg-[#EDEBE9] text-[#605E5C] px-2 py-0.5 rounded-md transition-colors"
                      >
                        {resp}
                      </button>
                    ))}
                    {eq.responsibles.length > 3 && (
                      <span className="text-[10px] text-[#A19F9D] self-center">
                        +{eq.responsibles.length - 3} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
