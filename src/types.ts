export interface MaintenanceActivity {
  id: string;
  area: string;
  subarea: string;
  equipment: string;
  activityType: string;
  activityTitle: string;
  periodicity: string;
  responsible: string;
  description: string;
}

export interface EquipmentSummary {
  name: string;
  area: string;
  subarea: string;
  activitiesCount: number;
  responsiblesCount: number;
  responsibles: string[];
  activities: MaintenanceActivity[];
  isFavorite?: boolean;
}

export interface ResponsibleSummary {
  name: string;
  activitiesCount: number;
  equipmentsCount: number;
  equipments: string[];
  areas: string[];
  activities: MaintenanceActivity[];
}

export interface CatalogMetadata {
  fileName: string;
  uploadDate: string;
  fileSize: number;
  totalRows: number;
  totalEquipments: number;
  totalActivities: number;
  totalAreas: number;
  totalResponsibles: number;
  isCustomUploaded: boolean;
}

export interface CatalogData {
  metadata: CatalogMetadata;
  activities: MaintenanceActivity[];
}

export type ActiveTab = 'home' | 'search' | 'responsibles' | 'file';
