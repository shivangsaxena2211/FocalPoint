import {
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_SIZE_MB,
} from "../../constants/config";
import type { AppError } from "../../types";
import { createError } from "./format";

export function validateFile(file: File | null | undefined): AppError | null {
  if (!file) {
    return createError("NO_FILE", "No file selected. Please choose an image to analyze.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const typeAllowed = ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number]);
  const extensionAllowed = ALLOWED_EXTENSIONS.includes(extension);

  if (!typeAllowed && !extensionAllowed) {
    return createError(
      "UNSUPPORTED_TYPE",
      `Unsupported file type "${extension || file.type || "unknown"}". Allowed formats: PNG, JPG, WEBP, GIF, BMP.`
    );
  }

  if (file.size === 0) {
    return createError("NO_FILE", "The selected file is empty. Please choose a valid image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return createError(
      "FILE_TOO_LARGE",
      `File is too large (${sizeMb} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`
    );
  }

  return null;
}
