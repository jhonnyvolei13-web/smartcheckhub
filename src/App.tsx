import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, CatalogData, EquipmentSummary, MaintenanceActivity } from './types';
import { INITIAL_CATALOG } from './data/defaultCatalog';
import { parseExcelFile } from './utils/excelParser';
import { groupActivitiesByEquipment, groupActivitiesByResponsible } from './utils/searchEngine';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { EquipmentDetailView } from './components/EquipmentDetailView';
import { ResponsiblesScreen } from './components/ResponsiblesScreen';
import { FileScreen } from './components/FileScreen';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const STORAGE_CATALOG_KEY = 'smartcheck_catalog_data_real_v2';
const STORAGE_FAVORITES_KEY = 'smartcheck_favorites_real_v2';
const STORAGE_SEARCHES_KEY = 'smartcheck_recent_searches_real_v2';

// Purge any legacy demo/fictional cache from previous sessions
try {
  localStorage.removeItem('smartcheck_catalog_data_v1');
  localStorage.removeItem('smartcheck_favorites_v1');
  localStorage.removeItem('smartcheck_recent_searches_v1');
} catch {}

export default function App() {
  // 1. Catalog Data State (Loaded from LocalStorage or Initial Default)
  const [catalog, setCatalog] = useState<CatalogData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CATALOG_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Falha ao carregar catálogo do armazenamento local:', e);
    }
    return INITIAL_CATALOG;
  });

  // 2. Favorites State (starts empty - no fictional data)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. Recent Searches State (starts empty - no fictional data)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SEARCHES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 4. Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentSummary | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<MaintenanceActivity | null>(null);
  const [selectedResponsibleName, setSelectedResponsibleName] = useState<string | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalog));
    } catch (e) {
      console.error(e);
    }
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  // Derived Equipments & Responsibles Summaries
  const equipments = useMemo(() => {
    return groupActivitiesByEquipment(catalog.activities, favorites);
  }, [catalog.activities, favorites]);

  const responsibles = useMemo(() => {
    return groupActivitiesByResponsible(catalog.activities);
  }, [catalog.activities]);

  // Actions
  const handleToggleFavorite = (equipmentName: string) => {
    setFavorites(prev => {
      if (prev.includes(equipmentName)) {
        return prev.filter(name => name !== equipmentName);
      } else {
        return [...prev, equipmentName];
      }
    });
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setRecentSearches(prev => {
        const filtered = prev.filter(t => t.toLowerCase() !== query.toLowerCase());
        return [query.trim(), ...filtered].slice(0, 10);
      });
      setSearchQuery(query.trim());
      setSelectedEquipment(null);
      setActiveTab('search');
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleRemoveRecentSearch = (query: string) => {
    setRecentSearches(prev => prev.filter(q => q !== query));
  };

  const handleSelectEquipmentByName = (equipmentName: string) => {
    const eq = equipments.find(e => e.name.toLowerCase() === equipmentName.toLowerCase());
    if (eq) {
      setSelectedEquipment(eq);
      setSelectedActivity(null);
    }
  };

  const handleSelectResponsible = (respName: string | null) => {
    setSelectedResponsibleName(respName);
    if (respName) {
      setActiveTab('responsibles');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoadingFile(true);
    try {
      const parsedData = await parseExcelFile(file);
      setCatalog(parsedData);
      setSelectedEquipment(null);
      setSelectedActivity(null);

      // Attempt background sync to server API
      try {
        await fetch('/api/catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ catalog: parsedData })
        });
      } catch (netErr) {
        console.warn('Sincronização com o servidor opcional em background falhou:', netErr);
      }
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleClearCatalog = () => {
    setCatalog(INITIAL_CATALOG);
    setFavorites([]);
    setRecentSearches([]);
    setSelectedEquipment(null);
    setSelectedActivity(null);
    setSelectedResponsibleName(null);
    try {
      localStorage.removeItem(STORAGE_CATALOG_KEY);
      localStorage.removeItem(STORAGE_FAVORITES_KEY);
      localStorage.removeItem(STORAGE_SEARCHES_KEY);
      fetch('/api/catalog/reset', { method: 'POST' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F3F2F1] text-[#323130] flex flex-col font-sans selection:bg-[#0078D4]/20 selection:text-[#0078D4]" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      {/* Top Header */}
      <Header
        metadata={catalog.metadata}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onNavigateToFile={() => {
          setSelectedEquipment(null);
          setActiveTab('file');
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {/* If an equipment is currently selected, show the EquipmentDetailView regardless of tab */}
        {selectedEquipment ? (
          <EquipmentDetailView
            equipment={selectedEquipment}
            isFavorite={favorites.includes(selectedEquipment.name)}
            onBack={() => setSelectedEquipment(null)}
            onToggleFavorite={handleToggleFavorite}
            onSelectActivity={(act) => setSelectedActivity(act)}
            onSelectResponsible={handleSelectResponsible}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                equipments={equipments}
                recentSearches={recentSearches}
                favorites={favorites}
                onSearchSubmit={handleSearchSubmit}
                onSelectEquipment={(eq) => setSelectedEquipment(eq)}
                onToggleFavorite={handleToggleFavorite}
                onClearRecentSearches={handleClearRecentSearches}
                onRemoveRecentSearch={handleRemoveRecentSearch}
                onNavigateToSearch={() => {
                  setSearchQuery('');
                  setActiveTab('search');
                }}
                onNavigateToFile={() => {
                  setSelectedEquipment(null);
                  setActiveTab('file');
                }}
                onFileUpload={handleFileUpload}
                isLoadingFile={isLoadingFile}
              />
            )}

            {activeTab === 'search' && (
              <SearchScreen
                equipments={equipments}
                initialQuery={searchQuery}
                favorites={favorites}
                onSelectEquipment={(eq) => setSelectedEquipment(eq)}
                onToggleFavorite={handleToggleFavorite}
                onSelectResponsible={handleSelectResponsible}
                onNavigateToFile={() => {
                  setSelectedEquipment(null);
                  setActiveTab('file');
                }}
              />
            )}

            {activeTab === 'responsibles' && (
              <ResponsiblesScreen
                responsibles={responsibles}
                selectedResponsibleName={selectedResponsibleName}
                onSelectResponsible={setSelectedResponsibleName}
                onSelectEquipmentByName={handleSelectEquipmentByName}
                onSelectActivity={(act) => setSelectedActivity(act)}
                onNavigateToFile={() => {
                  setSelectedEquipment(null);
                  setActiveTab('file');
                }}
              />
            )}

            {activeTab === 'file' && (
              <FileScreen
                metadata={catalog.metadata}
                isLoading={isLoadingFile}
                onFileUpload={handleFileUpload}
                onResetToDefault={handleClearCatalog}
              />
            )}
          </>
        )}
      </main>

      {/* Activity Details Modal / Sheet */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onSelectResponsible={handleSelectResponsible}
        onSelectEquipmentByName={handleSelectEquipmentByName}
      />

      {/* System Architecture, Data Model, Wireframes Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />

      {/* Fixed Bottom Navigation (Mobile First) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedEquipment(null);
          if (tab === 'responsibles' && activeTab !== 'responsibles') {
            setSelectedResponsibleName(null);
          }
          if (tab === 'search' && activeTab !== 'search') {
            setSearchQuery('');
          }
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
