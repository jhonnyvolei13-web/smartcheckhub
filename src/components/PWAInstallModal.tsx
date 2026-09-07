import React from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) {
        onClose();
      }
    }
  };

  return (
    <div
      id="pwa-install-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal-card"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#EDEBE9] space-y-5 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt="SmartCheck Hub Logo"
              className="w-12 h-12 rounded-2xl shadow-sm bg-[#0078D4]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-[#323130] leading-tight">
                  Instalar SMARTCHECK HUB
                </h3>
                <span className="text-[10px] font-bold bg-[#107C41]/10 text-[#107C41] px-2 py-0.5 rounded-md">
                  PWA
                </span>
              </div>
              <p className="text-xs text-[#605E5C] mt-0.5">
                Aplicativo industrial para celular e computador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A19F9D] hover:text-[#323130] hover:bg-[#F3F2F1] rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F3F2F1] p-3 rounded-2xl border border-[#EDEBE9]">
            <Zap size={18} className="text-[#0078D4] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Acesso Rápido</span>
            <span className="text-[10px] text-[#605E5C]">Direto da tela inicial</span>
          </div>
          <div className="bg-[#F3F2F1] p-3 rounded-2xl border border-[#EDEBE9]">
            <WifiOff size={18} className="text-[#107C41] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Modo Offline</span>
            <span className="text-[10px] text-[#605E5C]">Funciona sem sinal</span>
          </div>
          <div className="bg-[#F3F2F1] p-3 rounded-2xl border border-[#EDEBE9]">
            <Smartphone size={18} className="text-[#0078D4] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Tela Cheia</span>
            <span className="text-[10px] text-[#605E5C]">Sem barras de navegador</span>
          </div>
        </div>

        {/* Status / Instructions based on Platform */}
        {isInstalled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#107C41] flex items-center justify-center mx-auto">
              <CheckCircle2 size={22} />
            </div>
            <p className="text-xs font-bold text-emerald-900">Aplicativo Já Instalado!</p>
            <p className="text-[11px] text-emerald-700">
              Você já está utilizando o SmartCheck Hub instalado no seu dispositivo.
            </p>
          </div>
        ) : isIOS ? (
          <div className="bg-[#F3F2F1] rounded-2xl p-4 border border-[#EDEBE9] space-y-3">
            <p className="text-xs font-bold text-[#323130] flex items-center gap-1.5">
              <Smartphone size={14} className="text-[#0078D4]" />
              Como instalar no iPhone / iPad (iOS Safari):
            </p>
            <ol className="text-xs text-[#605E5C] space-y-2 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0078D4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Toque no botão <strong>Compartilhar</strong> <Share size={13} className="inline text-[#0078D4]" /> na barra do Safari.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0078D4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare size={13} className="inline text-[#0078D4]" />.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0078D4] text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Toque em <strong>Adicionar</strong> no canto superior direito.</span>
              </li>
            </ol>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3">
            <button
              id="btn-confirm-pwa-install"
              type="button"
              onClick={handleInstallClick}
              className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download size={18} />
              <span>Instalar Agora no Dispositivo</span>
            </button>
            <p className="text-[11px] text-center text-[#A19F9D]">
              O instalador adicionará o ícone do SmartCheck aos seus aplicativos.
            </p>
          </div>
        ) : (
          <div className="bg-[#F3F2F1] rounded-2xl p-4 border border-[#EDEBE9] space-y-2 text-xs text-[#605E5C]">
            <p className="font-bold text-[#323130] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#107C41]" />
              Instalação pelo Navegador (Chrome / Edge):
            </p>
            <p className="leading-relaxed">
              No menu do seu navegador (três pontos ⋮ ou ícone na barra de endereços), clique em <strong>&quot;Instalar SmartCheck Hub&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
            </p>
          </div>
        )}

        {/* Footer Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-semibold text-[#605E5C] hover:text-[#323130] transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
