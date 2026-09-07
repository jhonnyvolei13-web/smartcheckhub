import * as XLSX from 'xlsx';
import { MaintenanceActivity, CatalogData } from '../types';

// Normalize string for fuzzy/clean matching of column names
function normalizeHeader(str: string): string {
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Check if a header matches a field candidate
function isAreaField(n: string): boolean {
  return n === 'area' || n.includes('area') && !n.includes('sub');
}

function isSubareaField(n: string): boolean {
  return n.includes('subarea') || n.includes('sub-area') || n === 'subarea';
}

function isEquipmentField(n: string): boolean {
  return n.includes('equip') || n === 'tag' || n === 'equipamento' || n === 'ativo';
}

function isActivityTypeField(n: string): boolean {
  return n.includes('tipodeativ') || n.includes('tipoativ') || n.includes('tipo') || n.includes('categoria');
}

function isActivityTitleField(n: string): boolean {
  return n.includes('titulodaativ') || n.includes('titulo') || (n.includes('ativ') && !n.includes('tipo')) || n === 'nome';
}

function isPeriodicityField(n: string): boolean {
  return n.includes('periodicidade') || n.includes('frequencia') || n.includes('periodo');
}

function isResponsibleField(n: string): boolean {
  return n.includes('responsavel') || n.includes('resp') || n.includes('tecnico') || n.includes('executor');
}

function isDescriptionField(n: string): boolean {
  return n.includes('desc') || n.includes('detalhe') || n.includes('procedimento') || n.includes('orientacao');
}

// Columns to explicitly ignore as per prompt
function isIgnoredField(n: string): boolean {
  return (
    n.includes('status') ||
    n.includes('atualizad') ||
    n.includes('desatualizad') ||
    n.includes('epi') ||
    n.includes('ferramenta')
  );
}

export async function parseExcelFile(file: File): Promise<CatalogData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  if (!workbook.SheetNames.length) {
    throw new Error('O arquivo Excel não contém nenhuma planilha.');
  }

  // Use the first sheet or one named like SmartCheck / Dados / Atividades
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('A planilha está vazia ou não contém linhas de dados.');
  }

  // Determine column map from the first row keys
  const firstRow = rawRows[0];
  const headers = Object.keys(firstRow);

  let colArea = '';
  let colSubarea = '';
  let colEquip = '';
  let colActType = '';
  let colActTitle = '';
  let colPeriodicity = '';
  let colResponsible = '';
  let colDesc = '';

  for (const h of headers) {
    const norm = normalizeHeader(h);
    if (isIgnoredField(norm)) {
      continue; // Ignored as per requirements
    }

    if (!colSubarea && isSubareaField(norm)) {
      colSubarea = h;
    } else if (!colArea && isAreaField(norm)) {
      colArea = h;
    } else if (!colEquip && isEquipmentField(norm)) {
      colEquip = h;
    } else if (!colActType && isActivityTypeField(norm)) {
      colActType = h;
    } else if (!colActTitle && isActivityTitleField(norm)) {
      colActTitle = h;
    } else if (!colPeriodicity && isPeriodicityField(norm)) {
      colPeriodicity = h;
    } else if (!colResponsible && isResponsibleField(norm)) {
      colResponsible = h;
    } else if (!colDesc && isDescriptionField(norm)) {
      colDesc = h;
    }
  }

  // Fallbacks if some headers weren't uniquely recognized
  if (!colEquip) {
    colEquip = headers.find(h => !isIgnoredField(normalizeHeader(h))) || headers[0];
  }
  if (!colActTitle) {
    colActTitle = headers.find(h => h !== colEquip && !isIgnoredField(normalizeHeader(h))) || headers[1] || 'Atividade';
  }

  const activities: MaintenanceActivity[] = [];
  let rowIdx = 0;

  for (const row of rawRows) {
    const equip = String(row[colEquip] || '').trim();
    const title = String(row[colActTitle] || '').trim();
    const area = String(colArea ? row[colArea] : '').trim();
    const subarea = String(colSubarea ? row[colSubarea] : '').trim();
    const actType = String(colActType ? row[colActType] : 'Manutenção').trim();
    const periodicity = String(colPeriodicity ? row[colPeriodicity] : 'Não informada').trim();
    const responsible = String(colResponsible ? row[colResponsible] : 'Não atribuído').trim();
    const desc = String(colDesc ? row[colDesc] : '').trim();

    // Skip empty rows
    if (!equip && !title && !area) {
      continue;
    }

    rowIdx++;
    activities.push({
      id: `act-row-${rowIdx}-${Date.now().toString(36)}`,
      equipment: equip || 'Equipamento não especificado',
      area: area || 'Área Geral',
      subarea: subarea || area || 'Geral',
      activityType: actType || 'Manutenção Geral',
      activityTitle: title || `Atividade #${rowIdx}`,
      periodicity: periodicity || 'Conforme Rota',
      responsible: responsible || 'Equipe Geral',
      description: desc || 'Sem descrição cadastrada no SmartCheck.'
    });
  }

  if (activities.length === 0) {
    throw new Error('Nenhum registro válido de equipamento foi identificado no arquivo.');
  }

  const uniqueEquips = new Set(activities.map(a => a.equipment));
  const uniqueAreas = new Set(activities.map(a => a.area));
  const uniqueResps = new Set(activities.map(a => a.responsible));

  return {
    metadata: {
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      totalRows: activities.length,
      totalEquipments: uniqueEquips.size,
      totalActivities: activities.length,
      totalAreas: uniqueAreas.size,
      totalResponsibles: uniqueResps.size,
      isCustomUploaded: true
    },
    activities
  };
}

// Generate template workbook for testing / user export
export function generateSampleExcelWorkbook(): Uint8Array {
  const templateHeaders = [
    {
      'Área': 'Área Exemplo',
      'Subárea': 'Subárea Exemplo',
      'Equipamento': 'TAG-EQUIPAMENTO-01',
      'Tipo de atividade': 'Inspeção Mecânica',
      'Título da atividade': 'Título da Atividade de Manutenção',
      'Periodicidade': 'Mensal',
      'Responsável': 'Nome do Responsável',
      'Descrição': 'Descrição detalhada do procedimento operacional padrão.'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateHeaders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SmartCheck_Dados');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as Uint8Array;
}
