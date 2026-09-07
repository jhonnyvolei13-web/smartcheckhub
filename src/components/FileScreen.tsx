import React, { useRef, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Download,
  AlertCircle,
  FileCheck,
  Cpu,
  Layers,
  Users,
  Wrench,
  Database,
  Trash2
} from 'lucide-react';
import { CatalogMetadata } from '../types';
import { generateSampleExcelWorkbook } from '../utils/excelParser';

interface FileScreenProps {
  metadata: CatalogMetadata;
  isLoading: boolean;
  onFileUpload: (file: File) => Promise<void>;
  onResetToDefault: () => void;
}

export const FileScreen: React.FC<FileScreenProps> = ({
  metadata,
  isLoading,
  onFileUpload,
  onResetToDefault
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate extension
    const name = file.name.toLowerCase();
    if (!name.endsWith('.xlsx') && !name.endsWith('.xls') && !name.endsWith('.csv')) {
      setErrorMessage('Por favor, selecione um arquivo Excel válido (.xlsx ou .xls).');
      return;
    }

    try {
      await onFileUpload(file);
      setSuccessMessage(`Arquivo "${file.name}" carregado e processado com sucesso!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar a planilha do SmartCheck.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleDownloadSample = () => {
    try {
      const buffer = generateSampleExcelWorkbook();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SmartCheck_Planilha_Modelo.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Aguardando primeiro envio';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Aguardando primeiro envio';
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasData = metadata.totalActivities > 0;

  return (
    <div id="file-screen-container" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto">
      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-bold text-[#323130] tracking-tight">
          Gerenciamento de Arquivo
        </h2>
        <p className="text-xs text-[#605E5C]">
          Upload e processamento de planilhas exportadas do SmartCheck.
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs animate-in fade-in">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs animate-in fade-in">
          <CheckCircle2 size={16} className="text-[#107C41] shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Card: Arquivo Carregado Atualmente */}
      <div className="bg-white rounded-3xl border border-[#EDEBE9] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3">
          <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet size={14} className="text-[#107C41]" />
            Status do Arquivo
          </span>
          {hasData ? (
            <span className="text-[10px] font-bold bg-[#107C41]/10 text-[#107C41] border border-[#107C41]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#107C41]" />
              Ativo
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-[#A19F9D]/15 text-[#605E5C] border border-[#EDEBE9] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A19F9D]" />
              Em Branco
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#323130] break-all leading-snug">
            {metadata.fileName}
          </h3>
          <p className="text-xs text-[#605E5C] flex items-center gap-1.5 pt-0.5">
            <Calendar size={13} className="text-[#A19F9D]" />
            Data do upload: <strong className="text-[#323130] font-semibold">{formatDate(metadata.uploadDate)}</strong>
          </p>
          <p className="text-xs text-[#A19F9D]">
            Tamanho: {formatFileSize(metadata.fileSize)} • {hasData ? 'Planilha ativa no aplicativo' : 'Aguardando upload de planilha'}
          </p>
          {hasData && (
            <p className="text-[11px] text-[#107C41] flex items-center gap-1 font-semibold pt-0.5">
              <Database size={12} className="text-[#107C41]" />
              <span>Salvo com persistência no dispositivo (IndexedDB seguro sem limite de cota)</span>
            </p>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EDEBE9]">
          <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
            <div className="flex items-center gap-1.5 text-[#A19F9D] text-[10px] font-bold uppercase tracking-wider">
              <Cpu size={12} className="text-[#0078D4]" />
              Equipamentos
            </div>
            <span className="text-xl font-bold text-[#323130] block mt-0.5">
              {metadata.totalEquipments}
            </span>
          </div>

          <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
            <div className="flex items-center gap-1.5 text-[#A19F9D] text-[10px] font-bold uppercase tracking-wider">
              <Wrench size={12} className="text-[#0078D4]" />
              Atividades
            </div>
            <span className="text-xl font-bold text-[#323130] block mt-0.5">
              {metadata.totalActivities}
            </span>
          </div>

          <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
            <div className="flex items-center gap-1.5 text-[#A19F9D] text-[10px] font-bold uppercase tracking-wider">
              <Layers size={12} className="text-[#0078D4]" />
              Áreas
            </div>
            <span className="text-xl font-bold text-[#323130] block mt-0.5">
              {metadata.totalAreas}
            </span>
          </div>

          <div className="bg-[#F3F2F1] p-3.5 rounded-2xl border border-[#EDEBE9]">
            <div className="flex items-center gap-1.5 text-[#A19F9D] text-[10px] font-bold uppercase tracking-wider">
              <Users size={12} className="text-[#0078D4]" />
              Responsáveis
            </div>
            <span className="text-xl font-bold text-[#323130] block mt-0.5">
              {metadata.totalResponsibles}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            id="btn-trocar-arquivo"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full h-11 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Upload size={16} />
            <span>
              {isLoading
                ? 'Processando Arquivo...'
                : hasData
                ? 'Trocar Arquivo SmartCheck'
                : 'Selecionar Planilha Real (.xlsx)'}
            </span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag and Drop Zone */}
      <div
        id="file-dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#0078D4] bg-[#0078D4]/5'
            : 'border-[#EDEBE9] hover:border-[#0078D4] bg-white shadow-sm'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center mx-auto mb-2">
          <Upload size={20} />
        </div>
        <p className="text-xs font-bold text-[#323130]">
          Arraste e solte a planilha do SmartCheck aqui
        </p>
        <p className="text-[11px] text-[#A19F9D] mt-1">
          Suporta arquivos .xlsx e .xls exportados do sistema.
        </p>
      </div>

      {/* Rules Notice (Ignored fields notice) */}
      <div className="bg-[#F3F2F1] rounded-2xl p-4 border border-[#EDEBE9] text-[#605E5C] text-[11px] space-y-1">
        <span className="font-bold text-[#323130] flex items-center gap-1">
          <FileCheck size={13} className="text-[#107C41]" /> Regras de Processamento SmartCheck:
        </span>
        <p className="leading-relaxed">
          Campos processados: <strong>Área, Subárea, Equipamento, Tipo de atividade, Título, Periodicidade, Responsável e Descrição</strong>.
        </p>
        <p className="text-[#A19F9D]">
          Colunas de Status (Atualizada/Desatualizada), EPIs e Ferramentas são automaticamente <strong>ignoradas</strong> conforme especificação.
        </p>
      </div>

      {/* Utilities: Sample Excel Download & Clear Data */}
      <div className="pt-1 flex flex-col gap-2">
        <button
          id="btn-baixar-modelo-excel"
          type="button"
          onClick={handleDownloadSample}
          className="w-full h-10 bg-white border border-[#EDEBE9] hover:bg-[#F3F2F1] text-[#323130] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Download size={14} className="text-[#107C41]" />
          <span>Baixar Planilha Modelo com Cabeçalhos (.xlsx)</span>
        </button>

        {hasData && (
          <button
            id="btn-limpar-dados"
            type="button"
            onClick={onResetToDefault}
            className="w-full h-9 bg-transparent hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 size={13} />
            <span>Limpar Dados e Deixar em Branco</span>
          </button>
        )}
      </div>
    </div>
  );
};
