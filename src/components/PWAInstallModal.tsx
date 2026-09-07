import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone, ShieldCheck, Zap, WifiOff, Copy, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isSafari, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) {
        onClose();
      }
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div
      id="pwa-install-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal-card"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#EDEBE9] space-y-4 animate-in slide-in-from-bottom duration-200"
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
          <div className="bg-[#F3F2F1] p-2.5 rounded-2xl border border-[#EDEBE9]">
            <Zap size={16} className="text-[#0078D4] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Acesso Rápido</span>
            <span className="text-[10px] text-[#605E5C]">Tela de início</span>
          </div>
          <div className="bg-[#F3F2F1] p-2.5 rounded-2xl border border-[#EDEBE9]">
            <WifiOff size={16} className="text-[#107C41] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Modo Offline</span>
            <span className="text-[10px] text-[#605E5C]">Catálogo salvo</span>
          </div>
          <div className="bg-[#F3F2F1] p-2.5 rounded-2xl border border-[#EDEBE9]">
            <Smartphone size={16} className="text-[#0078D4] mx-auto mb-1" />
            <span className="text-[11px] font-bold text-[#323130] block">Tela Cheia</span>
            <span className="text-[10px] text-[#605E5C]">Sem barra URL</span>
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
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#323130] flex items-center gap-1.5">
                <Smartphone size={15} className="text-[#0078D4]" />
                Como instalar no iPhone / iPad (iOS):
              </p>
              <span className="text-[10px] font-semibold bg-[#0078D4]/10 text-[#0078D4] px-2 py-0.5 rounded-md">
                Exclusivo Apple
              </span>
            </div>

            <p className="text-[11px] text-[#605E5C] leading-tight">
              A Apple (iOS) não permite botão de instalação direta de 1 clique como no Android. A instalação é feita pelo navegador <strong>Safari</strong>:
            </p>

            {!isSafari && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                <div className="shrink-0 mt-0.5 font-bold">⚠️</div>
                <div>
                  Você parece estar usando o Chrome ou outro navegador no iPhone. Abra o link no <strong>Safari</strong> para conseguir instalar na Tela de Início.
                </div>
              </div>
            )}

            <ol className="text-xs text-[#323130] space-y-2.5 pl-1 pt-1">
              <li className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0078D4] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  1
                </span>
                <div>
                  <span>Na barra inferior do <strong>Safari</strong>, toque no ícone <strong>Compartilhar</strong>:</span>
                  <div className="inline-flex items-center gap-1 bg-white border border-[#EDEBE9] px-2 py-0.5 rounded-md ml-1 text-[#0078D4] font-semibold">
                    <Share size={13} />
                    <span>Compartilhar</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0078D4] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  2
                </span>
                <div>
                  <span>Role as opções para baixo e toque em:</span>
                  <div className="inline-flex items-center gap-1 bg-white border border-[#EDEBE9] px-2 py-0.5 rounded-md ml-1 text-[#323130] font-semibold">
                    <PlusSquare size={13} className="text-[#0078D4]" />
                    <span>Adicionar à Tela de Início</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0078D4] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  3
                </span>
                <span>Toque em <strong>Adicionar</strong> no canto superior direito da tela do iPhone.</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full mt-1 py-2 px-3 bg-white border border-[#EDEBE9] hover:bg-[#EDEBE9] text-[#0078D4] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-[#107C41]" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copiado! Abra no Safari' : 'Copiar Link do Aplicativo'}</span>
            </button>
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
              Instalação pelo Navegador (Chrome / Edge / Safari):
            </p>
            <p className="leading-relaxed">
              No menu do seu navegador (três pontos ⋮, menu Compartilhar ou ícone na barra de endereços), clique em <strong>&quot;Instalar SmartCheck Hub&quot;</strong> ou <strong>&quot;Adicionar à tela de início&quot;</strong>.
            </p>
          </div>
        )}

        {/* Footer Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold text-[#605E5C] hover:text-[#323130] transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
