import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet"

import L from "leaflet"

import "leaflet/dist/leaflet.css"

import type { HealthcareFacility } from "../api/healthcare"


interface HealthcareMapProps {
  latitude: number
  longitude: number
  facilities: HealthcareFacility[]
}


const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})


export default function HealthcareMap({
  latitude,
  longitude,
  facilities,
}: HealthcareMapProps) {

  return (

    <div
      style={{
        width: "100%",
        height: "450px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >

      <MapContainer
        center={[
          latitude,
          longitude,
        ]}
        zoom={14}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* User location */}

        <Marker
          position={[
            latitude,
            longitude,
          ]}
          icon={markerIcon}
        >

          <Popup>
            <strong>
              📍 Your Location
            </strong>
          </Popup>

        </Marker>


        {/* Healthcare facilities */}

        {facilities.map(
          (
            facility,
            index,
          ) => (

            <Marker
              key={`${facility.name}-${index}`}
              position={[
                facility.latitude,
                facility.longitude,
              ]}
              icon={markerIcon}
            >

              <Popup>

                <div
                  style={{
                    minWidth: "190px",
                  }}
                >

                  <strong>
                    {facility.name}
                  </strong>


                  <p
                    style={{
                      margin:
                        "6px 0",
                      fontSize:
                        "13px",
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {facility.type}
                  </p>


                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "13px",
                    }}
                  >
                    📍{" "}
                    {facility.distance_km} km
                    away
                  </p>


                  {facility.address && (

                    <p
                      style={{
                        margin:
                          "6px 0 0",
                        fontSize:
                        "12px",
                        lineHeight: 1.4,
                      }}
                    >
                      {facility.address}
                    </p>

                  )}


                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display:
                        "inline-block",
                      marginTop:
                        "10px",
                      fontSize:
                        "12px",
                    }}
                  >
                    Get Directions
                  </a>

                </div>

              </Popup>

            </Marker>

          ),
        )}

      </MapContainer>

    </div>
  )
}