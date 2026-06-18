import type { DetectionResult } from "../../types";

export function isAiPrediction(prediction: string): boolean {
  return prediction.toLowerCase().includes("ai");
}

export function getRiskLevel(confidence: number, isAi: boolean): string {
  if (isAi) {
    if (confidence >= 80) return "CRITICAL";
    if (confidence >= 60) return "HIGH";
    return "ELEVATED";
  }

  if (confidence >= 80) return "MINIMAL";
  if (confidence >= 60) return "LOW";
  return "UNCERTAIN";
}

export function getSignalStrength(confidence: number): string {
  if (confidence >= 80) return "STRONG";
  if (confidence >= 50) return "MODERATE";
  return "WEAK";
}

export function buildAnalysisSummary(result: DetectionResult): string {
  const isAi = isAiPrediction(result.prediction);
  const strength = getSignalStrength(result.confidence).toLowerCase();
  const risk = getRiskLevel(result.confidence, isAi).toLowerCase();

  if (isAi) {
    return `Classification: AI-generated content detected with ${strength} confidence (${result.confidence}%). Risk level is ${risk}. Manual verification is recommended before use in sensitive contexts.`;
  }

  return `Classification: Image appears authentic with ${strength} confidence (${result.confidence}%). Risk level is ${risk}. Results are probabilistic and should not be treated as definitive proof.`;
}

export function getThreatAssessment(result: DetectionResult): string {
  const isAi = isAiPrediction(result.prediction);

  if (isAi) {
    return "Indicators suggest synthetic or AI-generated content. Recommend manual verification before trusting this image in security-sensitive workflows.";
  }

  return "No significant AI-generation signatures detected. Image classified as likely authentic based on model inference.";
}
