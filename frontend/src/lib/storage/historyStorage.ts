import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from "../../constants/config";
import type { DetectionRecord } from "../../types";

export function loadHistory(): DetectionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DetectionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(records: DetectionRecord[]): void {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records.slice(0, MAX_HISTORY_ITEMS)));
}

export function addHistoryRecord(record: DetectionRecord): DetectionRecord[] {
  const next = [record, ...loadHistory()].slice(0, MAX_HISTORY_ITEMS);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function removeHistoryRecord(id: string): DetectionRecord[] {
  const next = loadHistory().filter((item) => item.id !== id);
  saveHistory(next);
  return next;
}
