import { get, set, del } from 'idb-keyval';
import { CatalogData } from '../types';

export const STORAGE_KEYS = {
  CATALOG: 'smartcheck_catalog_data_real_v2',
  FAVORITES: 'smartcheck_favorites_real_v2',
  SEARCHES: 'smartcheck_recent_searches_real_v2',
};

/**
 * Request durable/persistent storage from browser (Chrome/Safari/Edge)
 * Prevents iOS and Android from clearing data during background storage cleanups.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        return await navigator.storage.persist();
      }
      return true;
    }
  } catch (err) {
    console.warn('Persistent storage request error:', err);
  }
  return false;
}

/**
 * Save catalog data to both IndexedDB (primary, unlimited quota) and LocalStorage (fallback).
 * Catches QuotaExceededError safely on iOS Safari.
 */
export async function saveCatalogLocally(catalog: CatalogData): Promise<void> {
  // 1. Primary: Save to IndexedDB (no 5MB limit, perfect for iOS & Android)
  try {
    await set(STORAGE_KEYS.CATALOG, catalog);
  } catch (idbErr) {
    console.error('Falha ao salvar no IndexedDB:', idbErr);
  }

  // 2. Secondary: Try saving to LocalStorage (with quota protection)
  try {
    const jsonStr = JSON.stringify(catalog);
    localStorage.setItem(STORAGE_KEYS.CATALOG, jsonStr);
  } catch (lsErr) {
    // QuotaExceededError is common on iOS Safari (limit ~2.5MB-5MB)
    // We intentionally catch this so the app continues without error since IndexedDB has it saved.
    console.warn('LocalStorage excedeu cota (esperado em arquivos grandes no iOS). IndexedDB mantém os dados protegidos.', lsErr);
  }
}

/**
 * Load catalog data from IndexedDB first, with LocalStorage fallback.
 */
export async function loadCatalogLocally(): Promise<CatalogData | null> {
  // 1. Check IndexedDB
  try {
    const idbData = await get<CatalogData>(STORAGE_KEYS.CATALOG);
    if (idbData && idbData.activities && idbData.activities.length > 0) {
      return idbData;
    }
  } catch (idbErr) {
    console.warn('Erro ao ler do IndexedDB:', idbErr);
  }

  // 2. Fallback to LocalStorage
  try {
    const lsItem = localStorage.getItem(STORAGE_KEYS.CATALOG);
    if (lsItem) {
      const parsed = JSON.parse(lsItem) as CatalogData;
      if (parsed && parsed.activities && parsed.activities.length > 0) {
        // Hydrate IndexedDB with this data for future resilience
        set(STORAGE_KEYS.CATALOG, parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (lsErr) {
    console.warn('Erro ao ler do LocalStorage:', lsErr);
  }

  return null;
}

/**
 * Favorites persistence
 */
export async function saveFavoritesLocally(favorites: string[]): Promise<void> {
  try {
    await set(STORAGE_KEYS.FAVORITES, favorites);
  } catch {}
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch {}
}

export async function loadFavoritesLocally(): Promise<string[]> {
  try {
    const idb = await get<string[]>(STORAGE_KEYS.FAVORITES);
    if (Array.isArray(idb)) return idb;
  } catch {}
  try {
    const ls = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (ls) return JSON.parse(ls);
  } catch {}
  return [];
}

/**
 * Recent searches persistence
 */
export async function saveSearchesLocally(searches: string[]): Promise<void> {
  try {
    await set(STORAGE_KEYS.SEARCHES, searches);
  } catch {}
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCHES, JSON.stringify(searches));
  } catch {}
}

export async function loadSearchesLocally(): Promise<string[]> {
  try {
    const idb = await get<string[]>(STORAGE_KEYS.SEARCHES);
    if (Array.isArray(idb)) return idb;
  } catch {}
  try {
    const ls = localStorage.getItem(STORAGE_KEYS.SEARCHES);
    if (ls) return JSON.parse(ls);
  } catch {}
  return [];
}

/**
 * Clear all stored data (both IndexedDB and LocalStorage)
 */
export async function clearAllLocalData(): Promise<void> {
  try {
    await del(STORAGE_KEYS.CATALOG);
    await del(STORAGE_KEYS.FAVORITES);
    await del(STORAGE_KEYS.SEARCHES);
  } catch {}
  try {
    localStorage.removeItem(STORAGE_KEYS.CATALOG);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.SEARCHES);
  } catch {}
}
