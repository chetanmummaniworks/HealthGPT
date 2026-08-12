import apiClient from "./client";

export interface BloodValue {
  test: string;
  value: number | null;
  result: string | null;
  qualitative_value: string | null;
  unit: string | null;
  reference_range: string | null;
  raw_line: string;
}

export interface OCRResponse {
  text: string;
  values: BloodValue[];
}

export interface ReportAnalysisResponse {
  analysis: string;
}


export async function uploadReport(
  file: File
): Promise<OCRResponse> {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await apiClient.post<OCRResponse>(
    "/reports/ocr",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}


export async function analyzeReport(
  values: BloodValue[]
): Promise<ReportAnalysisResponse> {

  const response =
    await apiClient.post<ReportAnalysisResponse>(
      "/reports/analyze",
      {
        values,
      }
    );

  return response.data;
}