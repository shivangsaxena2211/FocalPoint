import type { AppError } from "../../types";
import { createError } from "../utils/format";
import { API_URL } from "../../constants/config";

export interface EnhancementResult {
  enhanced_image: string;
  width: number;
  height: number;
  model: string;
}

export class EnhancementApiError extends Error {
  code: AppError["code"];

  constructor(code: AppError["code"], message: string) {
    super(message);
    this.name = "EnhancementApiError";
    this.code = code;
  }
}

export async function enhanceImage(file: File): Promise<EnhancementResult> {
  const formData = new FormData();
  formData.append("image", file);

  let response: Response;

  try {
    response = await fetch(`${API_URL}/enhance`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new EnhancementApiError(
      "NETWORK_ERROR",
      "Unable to reach the enhancement server. Ensure the Flask backend is running on localhost:5000."
    );
  }

  let data: EnhancementResult & { error?: string };

  try {
    data = await response.json();
  } catch {
    throw new EnhancementApiError(
      "SERVER_ERROR",
      `Server returned an invalid response (HTTP ${response.status}). Please try again.`
    );
  }

  if (!response.ok) {
    const serverMessage = data.error ?? `Server error (HTTP ${response.status}).`;

    if (response.status >= 500) {
      throw new EnhancementApiError("SERVER_ERROR", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("unsupported") || serverMessage.toLowerCase().includes("file type")) {
      throw new EnhancementApiError("UNSUPPORTED_TYPE", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("too large")) {
      throw new EnhancementApiError("FILE_TOO_LARGE", serverMessage);
    }

    if (serverMessage.toLowerCase().includes("no file") || serverMessage.toLowerCase().includes("no image")) {
      throw new EnhancementApiError("NO_FILE", serverMessage);
    }

    throw new EnhancementApiError("SERVER_ERROR", serverMessage);
  }

  if (!data.enhanced_image) {
    throw new EnhancementApiError("SERVER_ERROR", "Server returned an incomplete enhancement response.");
  }

  return {
    enhanced_image: data.enhanced_image,
    width: data.width,
    height: data.height,
    model: data.model,
  };
}

export function toEnhancementAppError(err: unknown): AppError {
  if (err instanceof EnhancementApiError) {
    return createError(err.code, err.message);
  }

  if (err instanceof Error) {
    return createError("UNKNOWN", err.message);
  }

  return createError("UNKNOWN", "An unexpected error occurred. Please try again.");
}
