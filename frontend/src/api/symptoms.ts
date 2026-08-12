import apiClient from "./client";

export interface SymptomsResponse {
  symptoms: string[];
  count: number;
}

export async function getSymptoms(): Promise<SymptomsResponse> {
  const response = await apiClient.get<SymptomsResponse>(
    "/symptoms"
  );

  return response.data;
}