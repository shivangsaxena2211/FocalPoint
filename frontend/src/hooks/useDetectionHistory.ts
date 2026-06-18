import { useCallback, useState } from "react";
import {
  addHistoryRecord,
  clearHistory as clearStoredHistory,
  loadHistory,
  removeHistoryRecord,
} from "../lib/storage/historyStorage";
import type { DetectionRecord } from "../types";

export function useDetectionHistory() {
  const [history, setHistory] = useState<DetectionRecord[]>(() => loadHistory());

  const addRecord = useCallback((record: DetectionRecord) => {
    const next = addHistoryRecord(record);
    setHistory(next);
    return next;
  }, []);

  const removeRecord = useCallback((id: string) => {
    const next = removeHistoryRecord(id);
    setHistory(next);
  }, []);

  const clearHistory = useCallback(() => {
    clearStoredHistory();
    setHistory([]);
  }, []);

  return {
    history,
    addRecord,
    removeRecord,
    clearHistory,
    aiCount: history.filter((item) => item.result.prediction.toLowerCase().includes("ai")).length,
    realCount: history.filter((item) => !item.result.prediction.toLowerCase().includes("ai")).length,
  };
}
