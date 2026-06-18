import type { AppError, DetectionResult } from "../../types";
import { createError } from "../utils/format";
import { API_URL } from "../../constants/config";

export class DetectionApiError extends Error {
  code: AppError["code"];

  constructor(code: AppError["code"], message: string) {
    super(message);
    this.name = "DetectionApiError";
    this.code = code;
  }
}

export async function detectImage(file: File): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append("image", file);

  let response: Response;

  try {
    response = await fetch(`${API_URL}/detect`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new DetectionApiError(
      "NETWORK_ERROR",
      "Unable to reach the detection server. Ensure the Flask backend is running on localhost:5000."
    );
  }

  let data: { error?: string; prediction?: string; confidence?: number };

  try {
    data = await response.json();
  } catch {
    throw new DetectionApiError(
      "SERVER_ERROR",
      `Server returned an invalid response (HTTP ${response.status}). Please try again.`
    );
  }

  if (!response.ok) {
    const serverMessage = data.error ?? `Server error (HTTP ${response.status}).`;

    if (response.status >= 500) {
      throw new DetectionApiError("SERVER_ERROR", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("unsupported") || serverMessage.toLowerCase().includes("file type")) {
      throw new DetectionApiError("UNSUPPORTED_TYPE", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("too large")) {
      throw new DetectionApiError("FILE_TOO_LARGE", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("no file") || serverMessage.toLowerCase().includes("no image")) {
      throw new DetectionApiError("NO_FILE", serverMessage);
    }

    throw new DetectionApiError("SERVER_ERROR", serverMessage);
  }

  if (!data.prediction || data.confidence === undefined) {
    throw new DetectionApiError(
      "SERVER_ERROR",
      "Server returned an incomplete response. Missing prediction or confidence."
    );
  }

  return {
    prediction: data.prediction,
    confidence: data.confidence,
  };
}

export function toAppError(err: unknown): AppError {
  if (err instanceof DetectionApiError) {
    return createError(err.code, err.message);
  }

  if (err instanceof Error) {
    return createError("UNKNOWN", err.message);
  }

  return createError("UNKNOWN", "An unexpected error occurred. Please try again.");
}
