import { MaintenanceActivity, EquipmentSummary, ResponsibleSummary } from '../types';

export function normalizeSearchString(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function groupActivitiesByEquipment(
  activities: MaintenanceActivity[],
  favorites: string[] = []
): EquipmentSummary[] {
  const map = new Map<string, MaintenanceActivity[]>();

  for (const act of activities) {
    const key = act.equipment.trim();
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(act);
  }

  const result: EquipmentSummary[] = [];

  for (const [name, items] of map.entries()) {
    const uniqueResps = Array.from(new Set(items.map(i => i.responsible.trim()).filter(Boolean)));
    const firstItem = items[0];

    result.push({
      name,
      area: firstItem?.area || 'Área não definida',
      subarea: firstItem?.subarea || firstItem?.area || 'Subárea geral',
      activitiesCount: items.length,
      responsiblesCount: uniqueResps.length,
      responsibles: uniqueResps,
      activities: items,
      isFavorite: favorites.includes(name)
    });
  }

  // Sort alphabetically by equipment name
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export function groupActivitiesByResponsible(
  activities: MaintenanceActivity[]
): ResponsibleSummary[] {
  const map = new Map<string, MaintenanceActivity[]>();

  for (const act of activities) {
    const key = act.responsible.trim();
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(act);
  }

  const result: ResponsibleSummary[] = [];

  for (const [name, items] of map.entries()) {
    const uniqueEquips = Array.from(new Set(items.map(i => i.equipment.trim()).filter(Boolean)));
    const uniqueAreas = Array.from(new Set(items.map(i => i.area.trim()).filter(Boolean)));

    result.push({
      name,
      activitiesCount: items.length,
      equipmentsCount: uniqueEquips.length,
      equipments: uniqueEquips,
      areas: uniqueAreas,
      activities: items
    });
  }

  // Sort by name
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export interface SearchFilterOptions {
  query: string;
  category?: 'all' | 'equipment' | 'area' | 'responsible';
  areaFilter?: string;
  periodicityFilter?: string;
}

export function searchEquipments(
  equipments: EquipmentSummary[],
  query: string,
  category: 'all' | 'equipment' | 'area' | 'responsible' = 'all'
): EquipmentSummary[] {
  const cleanQ = normalizeSearchString(query);
  if (!cleanQ) {
    return equipments;
  }

  const tokens = cleanQ.split(/\s+/).filter(Boolean);

  return equipments.filter(eq => {
    const normName = normalizeSearchString(eq.name);
    const normArea = normalizeSearchString(eq.area);
    const normSubarea = normalizeSearchString(eq.subarea);
    const normResps = eq.responsibles.map(r => normalizeSearchString(r)).join(' ');
    const normTitles = eq.activities.map(a => normalizeSearchString(a.activityTitle + ' ' + a.description)).join(' ');

    if (category === 'equipment') {
      return tokens.every(tok => normName.includes(tok));
    }

    if (category === 'area') {
      return tokens.every(tok => normArea.includes(tok) || normSubarea.includes(tok));
    }

    if (category === 'responsible') {
      return tokens.every(tok => normResps.includes(tok));
    }

    // Default 'all': tokens must match across equipment, area, subarea, responsible, or activity text
    const fullText = `${normName} ${normArea} ${normSubarea} ${normResps} ${normTitles}`;
    return tokens.every(tok => fullText.includes(tok));
  });
}
