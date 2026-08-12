import apiClient from "./client";

export interface DiseasePredictionRequest {
  symptoms: string[];
  top_k?: number;
}

export interface DiseasePredictionResult {
  rank: number;
  disease: string;
  model_score: number;
}

export interface DiseasePredictionResponse {
  results: DiseasePredictionResult[];
  top_score: number;
  top_two_margin: number;
  needs_caution: boolean;
  message: string;
  explanation: string;
  confidence_level: string
}

export async function predictDisease(
  request: DiseasePredictionRequest
): Promise<DiseasePredictionResponse> {
  const response =
    await apiClient.post<DiseasePredictionResponse>(
      "/predictions/disease",
      request
    );

  return response.data;
}