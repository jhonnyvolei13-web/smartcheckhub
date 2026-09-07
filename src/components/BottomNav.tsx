import React from 'react';
import { Home, Search, Users, FolderOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Início', icon: Home },
    { id: 'search' as ActiveTab, label: 'Buscar', icon: Search },
    { id: 'responsibles' as ActiveTab, label: 'Responsáveis', icon: Users },
    { id: 'file' as ActiveTab, label: 'Arquivo', icon: FolderOpen },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EDEBE9] shadow-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 min-h-[48px] transition-all relative select-none ${
                isActive ? 'text-[#0078D4]' : 'text-[#605E5C] hover:text-[#323130]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#0078D4]/10 text-[#0078D4]' : 'bg-transparent text-[#605E5C]'
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  className="transition-transform duration-150"
                />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
