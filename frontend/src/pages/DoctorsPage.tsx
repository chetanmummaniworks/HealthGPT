import { useState, type KeyboardEvent } from "react";

import {
  getNearbyHealthcare,
  searchHealthcareLocation,
  type HealthcareFacility,
} from "../api/healthcare";

import HealthcareMap from "../components/HealthcareMap";

import { useTranslation } from "react-i18next";


export default function DoctorsPage() {

  const { t } = useTranslation();


  // ==========================================================
  // STATE
  // ==========================================================

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);


  const [locationName, setLocationName] =
    useState("");


  const [facilities, setFacilities] =
    useState<HealthcareFacility[]>([]);


  const [error, setError] =
    useState<string | null>(null);


  const [loading, setLoading] =
    useState(false);


  const [searching, setSearching] =
    useState(false);


  const [searchQuery, setSearchQuery] =
    useState("");


  // ==========================================================
  // CURRENT LOCATION
  // ==========================================================

  async function getCurrentLocation() {

    setError(null);
    setFacilities([]);
    setLocationName("");


    if (!navigator.geolocation) {

      setError(
        t("doctors.errors.unsupportedLocation"),
      );

      return;
    }


    setLoading(true);


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude =
          position.coords.latitude;


        const longitude =
          position.coords.longitude;


        setLocation({
          latitude,
          longitude,
        });


        setLocationName(
          t("doctors.currentLocation.current"),
        );


        setLoading(false);
        setSearching(true);


        try {

          const response =
            await getNearbyHealthcare(
              latitude,
              longitude,
            );


          setFacilities(
            response.results,
          );

        } catch (err) {

          console.error(
            "Healthcare search failed:",
            err,
          );


          setError(
            t("doctors.errors.nearby"),
          );

        } finally {

          setSearching(false);
        }
      },


      (error) => {

        console.error(
          "Location error:",
          error,
        );


        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          setError(
            t(
              "doctors.errors.permissionDenied",
            ),
          );

        } else if (
          error.code ===
          error.TIMEOUT
        ) {

          setError(
            t(
              "doctors.errors.timeout",
            ),
          );

        } else {

          setError(
            t(
              "doctors.errors.unableToDetermine",
            ),
          );
        }


        setLoading(false);
      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },

    );
  }


  // ==========================================================
  // MANUAL LOCATION SEARCH
  // ==========================================================

  async function handleLocationSearch() {

    const query =
      searchQuery.trim();


    if (!query) {

      setError(
        t("doctors.search.empty"),
      );

      return;
    }


    setError(null);
    setFacilities([]);
    setSearching(true);


    try {

      const locationResult =
        await searchHealthcareLocation(
          query,
        );


      const latitude =
        locationResult.latitude;


      const longitude =
        locationResult.longitude;


      setLocation({
        latitude,
        longitude,
      });


      setLocationName(
        locationResult.display_name,
      );


      const healthcare =
        await getNearbyHealthcare(
          latitude,
          longitude,
        );


      setFacilities(
        healthcare.results,
      );

    } catch (err) {

      console.error(
        "Location search failed:",
        err,
      );


      setError(
        t(
          "doctors.errors.locationSearch",
        ),
      );

    } finally {

      setSearching(false);
    }
  }


  // ==========================================================
  // ENTER KEY
  // ==========================================================

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {

    if (event.key === "Enter") {

      handleLocationSearch();
    }
  }


  // ==========================================================
  // FACILITY ICON
  // ==========================================================

  function getFacilityIcon(
    type: string,
  ) {

    if (type === "hospital") {
      return "🏥";
    }


    if (type === "clinic") {
      return "🏨";
    }


    if (type === "doctors") {
      return "🩺";
    }


    return "⚕️";
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 32px",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section
        style={{
          marginBottom: "32px",
        }}
      >

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            opacity: 0.65,
          }}
        >
          {t("app.name")}
        </p>


        <h1
          style={{
            margin: "8px 0 10px",
            fontSize: "32px",
          }}
        >
          {t("doctors.title")}
        </h1>


        <p
          style={{
            margin: 0,
            fontSize: "16px",
            opacity: 0.7,
            lineHeight: 1.6,
          }}
        >
          {t("doctors.description")}
        </p>

      </section>


      {/* =====================================================
          CURRENT LOCATION
      ===================================================== */}

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          background: "#ffffff",
          marginBottom: "24px",
        }}
      >

        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "20px",
          }}
        >
          {t(
            "doctors.currentLocation.title",
          )}
        </h2>


        <p
          style={{
            margin: "0 0 20px",
            lineHeight: 1.6,
            opacity: 0.7,
          }}
        >
          {t(
            "doctors.currentLocation.description",
          )}
        </p>


        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={
            loading ||
            searching
          }
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            cursor:
              loading || searching
                ? "not-allowed"
                : "pointer",
            background: "#0f766e",
            color: "#ffffff",
            fontWeight: 600,
            opacity:
              loading || searching
                ? 0.6
                : 1,
          }}
        >

          {loading
            ? t(
                "doctors.currentLocation.loading",
              )
            : searching
              ? t(
                  "doctors.currentLocation.searching",
                )
              : t(
                  "doctors.currentLocation.button",
                )}

        </button>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>

        )}


        {/* =================================================
            LOCATION DETECTED
        ================================================= */}

        {location && !error && (

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "8px",
              background: "#f0fdfa",
              fontSize: "14px",
            }}
          >

            <strong>
              {t(
                "doctors.currentLocation.detected",
              )}
            </strong>


            <p
              style={{
                margin: "6px 0 0",
                opacity: 0.7,
              }}
            >
              {locationName}
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          SEARCHING
      ===================================================== */}

      {searching && (

        <section
          style={{
            marginBottom: "24px",
            padding: "24px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            background: "#ffffff",
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            🔎
          </div>


          <p
            style={{
              margin: 0,
              fontWeight: 600,
            }}
          >
            {t(
              "doctors.searchingNearby.title",
            )}
          </p>


          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              opacity: 0.65,
            }}
          >
            {t(
              "doctors.searchingNearby.description",
            )}
          </p>

        </section>

      )}


      {/* =====================================================
          MAP + RESULTS
      ===================================================== */}

      {!searching &&
        facilities.length > 0 &&
        location && (

          <section
            style={{
              marginBottom: "32px",
            }}
          >

            {/* =================================================
                MAP
            ================================================= */}

            <div
              style={{
                marginBottom: "28px",
              }}
            >

              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: "22px",
                }}
              >
                {t(
                  "doctors.results.map",
                )}
              </h2>


              <HealthcareMap
                latitude={
                  location.latitude
                }
                longitude={
                  location.longitude
                }
                facilities={
                  facilities
                }
              />

            </div>


            {/* =================================================
                RESULTS HEADER
            ================================================= */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >

              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                {t(
                  "doctors.results.title",
                )}
              </h2>


              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "14px",
                  opacity: 0.65,
                }}
              >
                {facilities.length}{" "}
                {facilities.length === 1
                  ? t(
                      "doctors.results.facility",
                    )
                  : t(
                      "doctors.results.facilities",
                    )}{" "}
                {t(
                  "doctors.results.foundSuffix",
                )}
              </p>

            </div>


            {/* =================================================
                FACILITY CARDS
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >

              {facilities.map(
                (
                  facility,
                  index,
                ) => (

                  <article
                    key={`${facility.name}-${index}`}
                    style={{
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "20px",
                      background:
                        "#ffffff",
                      display: "flex",
                      flexDirection:
                        "column",
                    }}
                  >

                    {/* Icon */}

                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          "#f0fdfa",
                        fontSize: "24px",
                        marginBottom:
                          "14px",
                      }}
                    >
                      {getFacilityIcon(
                        facility.type,
                      )}
                    </div>


                    {/* Name */}

                    <h3
                      style={{
                        margin:
                          "0 0 7px",
                        fontSize: "18px",
                        lineHeight: 1.35,
                      }}
                    >
                      {facility.name}
                    </h3>


                    {/* Type */}

                    <p
                      style={{
                        margin:
                          "0 0 8px",
                        fontSize: "13px",
                        textTransform:
                          "capitalize",
                        opacity: 0.6,
                      }}
                    >
                      {facility.type}
                    </p>


                    {/* Distance */}

                    <p
                      style={{
                        margin:
                          "0 0 8px",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      📍{" "}
                      {facility.distance_km} km{" "}
                      {t(
                        "doctors.results.away",
                      )}
                    </p>


                    {/* Address */}

                    {facility.address && (

                      <p
                        style={{
                          margin:
                            "0 0 16px",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          opacity: 0.7,
                          minHeight: "39px",
                        }}
                      >
                        {facility.address}
                      </p>

                    )}


                    <div
                      style={{
                        flex: 1,
                      }}
                    />


                    {/* Buttons */}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >

                      {/* OpenStreetMap */}

                      <a
                        href={`https://www.openstreetmap.org/?mlat=${facility.latitude}&mlon=${facility.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration:
                            "none",
                          padding:
                            "9px 12px",
                          borderRadius:
                            "7px",
                          background:
                            "#f3f4f6",
                          color:
                            "inherit",
                          fontSize:
                            "13px",
                          fontWeight:
                            500,
                        }}
                      >
                        {t(
                          "doctors.results.viewMap",
                        )}
                      </a>


                      {/* Google Maps */}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration:
                            "none",
                          padding:
                            "9px 12px",
                          borderRadius:
                            "7px",
                          background:
                            "#0f766e",
                          color:
                            "#ffffff",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                        }}
                      >
                        {t(
                          "doctors.results.directions",
                        )}
                      </a>

                    </div>

                  </article>

                ),
              )}

            </div>

          </section>

        )}


      {/* =====================================================
          NO RESULTS
      ===================================================== */}

      {!searching &&
        location &&
        facilities.length === 0 &&
        !error && (

          <section
            style={{
              marginBottom: "24px",
              padding: "28px",
              textAlign: "center",
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              background:
                "#ffffff",
            }}
          >

            <div
              style={{
                fontSize: "32px",
                marginBottom: "10px",
              }}
            >
              🏥
            </div>


            <h2
              style={{
                margin:
                  "0 0 8px",
                fontSize: "20px",
              }}
            >
              {t(
                "doctors.results.noResults",
              )}
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                opacity: 0.65,
              }}
            >
              {t(
                "doctors.results.noResultsDescription",
              )}
            </p>

          </section>

        )}


      {/* =====================================================
          MANUAL SEARCH
      ===================================================== */}

      <section
        style={{
          border:
            "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          background:
            "#ffffff",
        }}
      >

        <h2
          style={{
            margin:
              "0 0 8px",
            fontSize: "20px",
          }}
        >
          {t(
            "doctors.search.title",
          )}
        </h2>


        <p
          style={{
            margin:
              "0 0 18px",
            opacity: 0.7,
            lineHeight: 1.5,
          }}
        >
          {t(
            "doctors.search.description",
          )}
        </p>


        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            onKeyDown={
              handleSearchKeyDown
            }
            placeholder={t(
              "doctors.search.placeholder",
            )}
            disabled={searching}
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
              boxSizing:
                "border-box",
            }}
          />


          <button
            type="button"
            onClick={
              handleLocationSearch
            }
            disabled={searching}
            style={{
              padding:
                "12px 20px",
              border: "none",
              borderRadius:
                "8px",
              background:
                "#111827",
              color:
                "#ffffff",
              cursor:
                searching
                  ? "not-allowed"
                  : "pointer",
              fontWeight:
                600,
              opacity:
                searching
                  ? 0.6
                  : 1,
            }}
          >
            {searching
              ? t(
                  "doctors.search.searching",
                )
              : t(
                  "doctors.search.button",
                )}
          </button>

        </div>

      </section>


      {/* =====================================================
          ATTRIBUTION
      ===================================================== */}

      <p
        style={{
          marginTop: "20px",
          fontSize: "12px",
          opacity: 0.55,
          lineHeight: 1.5,
        }}
      >
        {t(
          "doctors.attribution",
        )}
      </p>

    </main>
  );
}