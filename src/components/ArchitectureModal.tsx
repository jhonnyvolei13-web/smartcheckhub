import React, { useState } from 'react';
import { X, Server, Layout, Database, Smartphone, GitFork, CheckCircle, Code2, Sparkles } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'arquitetura' | 'componentes' | 'modelagem' | 'wireframes' | 'fluxos' | 'stack';

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('arquitetura');

  if (!isOpen) return null;

  return (
    <div
      id="architecture-modal-overlay"
      className="fixed inset-0 z-50 bg-[#201F1E]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="architecture-modal-container"
        className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-[#EDEBE9] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDEBE9] flex items-center justify-between bg-[#F3F2F1]/50">
          <div>
            <h2 className="text-sm font-bold text-[#323130] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
              Documentação de Engenharia & Arquitetura
            </h2>
            <p className="text-[11px] text-[#605E5C]">
              SMARTCHECK HUB • Catálogo Inteligente Industrial Mobile First
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#605E5C] hover:text-[#323130] rounded-lg hover:bg-[#EDEBE9] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-[#EDEBE9] bg-white no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('arquitetura')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'arquitetura' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            1. Arquitetura
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('componentes')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'componentes' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            2. Componentes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modelagem')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'modelagem' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            3. Modelagem Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wireframes')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'wireframes' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            4. Wireframes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fluxos')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'fluxos' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            5. Fluxo Navegação
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              activeTab === 'stack' ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
          >
            6. Stack Recomendada
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#323130] leading-relaxed font-sans">
          {activeTab === 'arquitetura' && (
            <div className="space-y-3">
              <div className="bg-[#F3F2F1] border border-[#EDEBE9] rounded-2xl p-4 text-[#0078D4]">
                <h3 className="font-bold text-xs flex items-center gap-1.5 text-[#0078D4]">
                  <Server size={14} /> Arquitetura Híbrida: Offline-First + Express API
                </h3>
                <p className="text-[11px] text-[#605E5C] mt-1">
                  Projetada especificamente para rondas industriais em celulares onde a conectividade Wi-Fi/4G pode oscilar nas áreas fabris (subsolos, adegas de pressão, caldeiras).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#323130] text-xs uppercase tracking-wider">
                  Camadas do Sistema:
                </h4>
                <div className="border border-[#EDEBE9] rounded-2xl p-4 bg-[#F3F2F1] space-y-2 font-mono text-[11px]">
                  <p><strong>[CLIENTE (Mobile Browser / PWA)]</strong></p>
                  <p className="text-[#605E5C] pl-3">├── UI: React 19 + Tailwind CSS (Geometric Balance theme)</p>
                  <p className="text-[#605E5C] pl-3">├── In-Memory Search Engine (Tokens NFD, &lt; 5ms)</p>
                  <p className="text-[#605E5C] pl-3">├── Parser Excel Client-Side (SheetJS / XLSX)</p>
                  <p className="text-[#605E5C] pl-3">└── Cache Local (LocalStorage / IndexedDB persistente)</p>
                  <p className="mt-2"><strong>[SERVIDOR (Backend Node / Express 4)]</strong></p>
                  <p className="text-[#605E5C] pl-3">├── GET /api/health (Health check do container)</p>
                  <p className="text-[#605E5C] pl-3">├── GET /api/catalog (Recuperação do catálogo central)</p>
                  <p className="text-[#605E5C] pl-3">└── POST /api/catalog (Sincronização de catálogo compartilhado)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'componentes' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#323130] flex items-center gap-1.5">
                <Layout size={14} className="text-[#0078D4]" /> Estrutura de Componentes
              </h3>
              <div className="border border-[#EDEBE9] rounded-2xl p-4 bg-[#F3F2F1] font-mono text-[11px] space-y-1.5">
                <p className="text-[#0078D4] font-bold">&lt;App /&gt;</p>
                <p className="pl-3">├── &lt;Header /&gt; (Status catálogo, título e modal specs)</p>
                <p className="pl-3">├── &lt;HomeScreen /&gt; (Busca rápida, recentes, favoritos ⭐)</p>
                <p className="pl-3">├── &lt;SearchScreen /&gt; (Filtro por tag, área, responsável)</p>
                <p className="pl-3">├── &lt;EquipmentDetailView /&gt; (Visão completa do equipamento)</p>
                <p className="pl-3">├── &lt;ResponsiblesScreen /&gt; (Agrupamento por técnico/supervisor)</p>
                <p className="pl-3">├── &lt;FileScreen /&gt; (Upload Excel, validação e descarte de colunas)</p>
                <p className="pl-3">├── &lt;ActivityDetailModal /&gt; (Ficha técnica da atividade)</p>
                <p className="pl-3">└── &lt;BottomNav /&gt; (Barra inferior fixa 4 tabs mobile)</p>
              </div>
            </div>
          )}

          {activeTab === 'modelagem' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#323130] flex items-center gap-1.5">
                <Database size={14} className="text-[#0078D4]" /> Modelagem dos Dados (SmartCheck)
              </h3>
              <div className="space-y-2">
                <div className="border border-[#EDEBE9] rounded-2xl p-4 bg-[#F3F2F1] space-y-2">
                  <span className="font-bold text-[#323130] block text-xs">
                    Entidade: MaintenanceActivity
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#605E5C] font-mono text-[11px]">
                    <li><strong>id</strong>: string (chave única gerada)</li>
                    <li><strong>equipment</strong>: string (ex: &quot;TQ PRESSAO 05&quot;)</li>
                    <li><strong>area</strong>: string (ex: &quot;SC-04310 Adega de Pressão&quot;)</li>
                    <li><strong>subarea</strong>: string (ex: &quot;Adega de Pressão&quot;)</li>
                    <li><strong>activityType</strong>: string (ex: &quot;Limpeza e Sanitização&quot;)</li>
                    <li><strong>activityTitle</strong>: string (ex: &quot;Realizar limpeza do Tanque...&quot;)</li>
                    <li><strong>periodicity</strong>: string (ex: &quot;Semanal&quot;, &quot;Diária&quot;)</li>
                    <li><strong>responsible</strong>: string (ex: &quot;RODRIGO WILLIAM&quot;)</li>
                    <li><strong>description</strong>: string (texto técnico do procedimento)</li>
                  </ul>
                </div>
                <div className="bg-[#F3F2F1] border border-[#EDEBE9] text-[#323130] rounded-2xl p-4 text-[11px]">
                  <strong>Regra de Filtragem Estrita:</strong> Campos contendo <code>Status Atualizada</code>, <code>Status Desatualizada</code>, <code>EPIs</code> e <code>Ferramentas</code> são sanitizados e excluídos da memória para otimizar velocidade e simplicidade.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wireframes' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#323130] flex items-center gap-1.5">
                <Smartphone size={14} className="text-[#0078D4]" /> Wireframes Mobile
              </h3>
              <div className="border border-[#EDEBE9] rounded-2xl p-4 bg-[#201F1E] text-emerald-400 font-mono text-[10px] leading-snug whitespace-pre overflow-x-auto">
{`+-----------------------------------+
|  [Cpu] SMARTCHECK HUB    (Excel)  |
+-----------------------------------+
| [🔍 Ex: TQ PRESSAO, Filtração... ]|
+-----------------------------------+
| PESQUISAS RECENTES:               |
| [🔍 TQ PRESSAO] [🔍 Jhonattan]   |
+-----------------------------------+
| ⭐ EQUIPAMENTOS FAVORITOS:        |
| +-------------------------------+ |
| | ⭐ TQ PRESSAO 05              | |
| | Área: Adega de Pressão        | |
| | 3 atividades • Resp: Rodrigo  | |
| +-------------------------------+ |
+-----------------------------------+
| [🏠Início] [🔍Buscar] [👤Resp] [📁Arq]
+-----------------------------------+`}
              </div>
            </div>
          )}

          {activeTab === 'fluxos' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#323130] flex items-center gap-1.5">
                <GitFork size={14} className="text-[#0078D4]" /> Fluxo de Navegação
              </h3>
              <div className="border border-[#EDEBE9] rounded-2xl p-4 bg-[#F3F2F1] font-mono text-[11px] space-y-2 text-[#323130]">
                <p>1. [Início] ➔ Digita &quot;TQ PRESSAO&quot; ➔ [Buscar]</p>
                <p>2. [Buscar] ➔ Lista cartões com contagem de atividades e responsáveis</p>
                <p>3. [Toque no cartão] ➔ Abre [Tela do Equipamento]</p>
                <p>4. [Tela do Equipamento] ➔ Lista atividades atribuídas</p>
                <p>5. [Ver Detalhes] ➔ Abre [Ficha da Atividade] com descrição completa</p>
                <p>6. [Toque no Responsável] ➔ [Tela do Responsável com todas suas atribuições]</p>
                <p>7. [Tab Arquivo] ➔ Upload de nova planilha SmartCheck ou troca de arquivo</p>
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#323130] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0078D4]" /> Tecnologias Modernas
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
                  <strong className="text-[#323130]">Vite + React 19:</strong> Compilação instantânea, renderização ultrarrápida, bundle leve para celulares.
                </div>
                <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
                  <strong className="text-[#323130]">Tailwind CSS (Geometric Balance):</strong> Paleta corporativa `#0078D4` com fundo `#F3F2F1` e bordas `#EDEBE9`.
                </div>
                <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
                  <strong className="text-[#323130]">SheetJS (xlsx):</strong> Processamento client-side e server-side de planilhas .xlsx sem dependências de terceiros.
                </div>
                <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
                  <strong className="text-[#323130]">IndexedDB / LocalStorage:</strong> Zero latência nas rondas mesmo sem sinal de internet na fábrica.
                </div>
                <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
                  <strong className="text-[#323130]">Express 4:</strong> Backend robusto para deploy em container e rotas de catálogo.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDEBE9] bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
