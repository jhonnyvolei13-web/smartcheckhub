import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#201F1E]/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-lg border border-amber-500/40 flex items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff size={16} />
        </div>
        <div>
          <p className="font-bold text-white text-xs leading-tight">Modo Offline Ativo</p>
          <p className="text-[11px] text-[#A19F9D] leading-tight">Os dados salvos continuam disponíveis para consulta.</p>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full shrink-0">
        Offline
      </span>
    </div>
  );
};
