import { CatalogData, MaintenanceActivity } from '../types';

export const DEFAULT_ACTIVITIES: MaintenanceActivity[] = [];

export const INITIAL_CATALOG: CatalogData = {
  metadata: {
    fileName: 'Nenhum arquivo carregado',
    uploadDate: '',
    fileSize: 0,
    totalRows: 0,
    totalEquipments: 0,
    totalActivities: 0,
    totalAreas: 0,
    totalResponsibles: 0,
    isCustomUploaded: false
  },
  activities: []
};
