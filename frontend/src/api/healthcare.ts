import apiClient from "./client"


export interface HealthcareFacility {
  name: string
  type: string
  latitude: number
  longitude: number
  distance_km: number
  address?: string | null
  phone?: string | null
  website?: string | null
}


export interface NearbyHealthcareResponse {
  results: HealthcareFacility[]
  count: number
}


export interface LocationSearchResponse {
  latitude: number
  longitude: number
  display_name: string
}


export async function getNearbyHealthcare(
  latitude: number,
  longitude: number,
  radius = 3000,
): Promise<NearbyHealthcareResponse> {

  const response =
    await apiClient.get<NearbyHealthcareResponse>(
      "/healthcare/nearby",
      {
        params: {
          latitude,
          longitude,
          radius,
        },
      },
    )

  return response.data
}


export async function searchHealthcareLocation(
  query: string,
): Promise<LocationSearchResponse> {

  const response =
    await apiClient.get<LocationSearchResponse>(
      "/healthcare/search-location",
      {
        params: {
          query,
        },
      },
    )

  return response.data
}