export interface DetectionResult {
  prediction: string;
  confidence: number;
}

export type ErrorCode =
  | "NO_FILE"
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface AppError {
  code: ErrorCode;
  message: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  width?: number;
  height?: number;
}

export interface DetectionRecord {
  id: string;
  timestamp: string;
  file: FileMetadata;
  result: DetectionResult;
  summary: string;
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  file: FileMetadata;
  result: DetectionResult;
  summary: string;
  riskLevel: string;
  signalStrength: string;
}
