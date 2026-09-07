import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'header';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running as an installed PWA, hide install triggers
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        // Fallback open modal with guide if user wants more info or cancelled
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          id="header-pwa-install-btn"
          type="button"
          onClick={handleClick}
          title="Instalar aplicativo SmartCheck no celular ou computador"
          className="flex items-center gap-1.5 text-xs bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white px-2.5 py-1.5 rounded-xl font-bold transition-all shadow-xs"
        >
          <Download size={13} className="shrink-0" />
          <span className="text-[11px] font-bold">Instalar</span>
        </button>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'full') {
    return (
      <>
        <div
          id="home-pwa-install-banner"
          className="bg-gradient-to-r from-[#0078D4] to-[#005A9E] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Instalar Aplicativo SmartCheck</h4>
              <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                Acesse direto da tela inicial e use sem internet nas rondas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="px-3 py-2 bg-white hover:bg-[#F3F2F1] text-[#0078D4] font-bold text-xs rounded-xl shadow-xs shrink-0 transition-colors"
          >
            Instalar
          </button>
        </div>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        id="pwa-install-btn"
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 rounded-xl bg-[#0078D4] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#106EBE] active:bg-[#005A9E] transition cursor-pointer"
      >
        <Download size={15} />
        <span>Instalar App</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
