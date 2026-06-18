export const APP_NAME = "Deepfake Detector";
export const APP_VERSION = "1.0.0";
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
export const HISTORY_STORAGE_KEY = "deepfake-detector-history";
export const MAX_HISTORY_ITEMS = 50;

export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
] as const;

export const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "bmp"];
export const MAX_SIZE_MB = 10;
export const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;

export const MODEL_NAME = "prithivMLmods/deepfake-detector-model-v1";
export const CODEFORMER_MODEL = "sczhou/CodeFormer";
