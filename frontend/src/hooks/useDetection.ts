import { useCallback, useRef, useState } from "react";
import { detectImage, toAppError } from "../lib/api/detect";
import {
  buildAnalysisSummary,
  getRiskLevel,
  getSignalStrength,
} from "../lib/utils/prediction";
import { buildFileMetadata, loadImageDimensions } from "../lib/utils/format";
import { validateFile } from "../lib/utils/validation";
import type {
  AnalysisReport,
  AppError,
  DetectionRecord,
  DetectionResult,
  FileMetadata,
} from "../types";

function createRecordId(): string {
  return crypto.randomUUID();
}

export function useDetection(onComplete?: (record: DetectionRecord) => void) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const resetState = useCallback(() => {
    revokePreview(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setMetadata(null);
    setResult(null);
    setReport(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl, revokePreview]);

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      revokePreview(previewUrl);
      setError(null);
      setResult(null);
      setReport(null);

      try {
        const dimensions = await loadImageDimensions(file!);
        const fileMetadata = buildFileMetadata(file!, dimensions);

        setSelectedFile(file);
        setMetadata(fileMetadata);
        setPreviewUrl(URL.createObjectURL(file!));
      } catch {
        setError(toAppError(new Error("Unable to read the selected image file.")));
      }
    },
    [previewUrl, revokePreview]
  );

  const handleDetect = useCallback(async () => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setReport(null);

    try {
      const detection = await detectImage(selectedFile!);
      const summary = buildAnalysisSummary(detection);
      const isAi = detection.prediction.toLowerCase().includes("ai");
      const timestamp = new Date().toISOString();
      const id = createRecordId();

      const analysisReport: AnalysisReport = {
        id,
        timestamp,
        file: metadata ?? buildFileMetadata(selectedFile!),
        result: detection,
        summary,
        riskLevel: getRiskLevel(detection.confidence, isAi),
        signalStrength: getSignalStrength(detection.confidence),
      };

      setResult(detection);
      setReport(analysisReport);

      onComplete?.({
        id,
        timestamp,
        file: analysisReport.file,
        result: detection,
        summary,
      });
    } catch (err) {
      setError(toAppError(err));
    } finally {
      setLoading(false);
    }
  }, [metadata, onComplete, selectedFile]);

  const handleBrowseClick = useCallback(() => {
    if (loading || !fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }, [loading]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    previewUrl,
    selectedFile,
    metadata,
    result,
    report,
    loading,
    error,
    fileInputRef,
    resetState,
    handleFileSelect,
    handleDetect,
    handleBrowseClick,
    dismissError,
  };
}
