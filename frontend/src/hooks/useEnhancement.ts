import { useCallback, useRef, useState } from "react";
import { enhanceImage, toEnhancementAppError } from "../lib/api/enhance";
import { buildFileMetadata, loadImageDimensions } from "../lib/utils/format";
import { validateFile } from "../lib/utils/validation";
import type { AppError, FileMetadata } from "../types";

export function useEnhancement() {
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokeBefore = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  }, []);

  const resetState = useCallback(() => {
    revokeBefore(beforeUrl);
    setBeforeUrl(null);
    setAfterUrl(null);
    setSelectedFile(null);
    setMetadata(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [beforeUrl, revokeBefore]);

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      revokeBefore(beforeUrl);
      setError(null);
      setAfterUrl(null);

      try {
        const dimensions = await loadImageDimensions(file!);
        const fileMetadata = buildFileMetadata(file!, dimensions);

        setSelectedFile(file);
        setMetadata(fileMetadata);
        setBeforeUrl(URL.createObjectURL(file!));
      } catch {
        setError(toEnhancementAppError(new Error("Unable to read the selected image file.")));
      }
    },
    [beforeUrl, revokeBefore]
  );

  const handleEnhance = useCallback(async () => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setAfterUrl(null);

    try {
      const result = await enhanceImage(selectedFile!);
      setAfterUrl(result.enhanced_image);
    } catch (err) {
      setError(toEnhancementAppError(err));
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  const handleBrowseClick = useCallback(() => {
    if (loading || !fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }, [loading]);

  const dismissError = useCallback(() => setError(null), []);

  const downloadEnhanced = useCallback(() => {
    if (!afterUrl) return;

    const link = document.createElement("a");
    link.href = afterUrl;
    const baseName = metadata?.name?.replace(/\.[^.]+$/, "") ?? "image";
    link.download = `${baseName}-enhanced.png`;
    link.click();
  }, [afterUrl, metadata?.name]);

  return {
    beforeUrl,
    afterUrl,
    metadata,
    loading,
    error,
    fileInputRef,
    resetState,
    handleFileSelect,
    handleEnhance,
    handleBrowseClick,
    dismissError,
    downloadEnhanced,
  };
}
