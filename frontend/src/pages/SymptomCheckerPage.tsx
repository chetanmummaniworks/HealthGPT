import { useEffect, useMemo, useState } from "react";

import {
  getSymptoms,
} from "../api/symptoms";

import {
  predictDisease,
  type DiseasePredictionResponse,
} from "../api/predictions";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";


export default function SymptomCheckerPage() {

  const [symptoms, setSymptoms] =
    useState<string[]>([]);

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [predicting, setPredicting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [prediction, setPrediction] =
    useState<DiseasePredictionResponse | null>(
      null
    );

  const navigate = useNavigate();

  const { t } = useTranslation();


  // =========================================================
  // Load symptoms
  // =========================================================

  useEffect(() => {

    async function loadSymptoms() {

      try {

        setLoading(true);
        setError(null);

        const response =
          await getSymptoms();

        setSymptoms(
          response.symptoms
        );

      } catch (err) {

        console.error(err);

        setError(
          t("symptomChecker.errors.loadSymptoms")
        );

      } finally {

        setLoading(false);

      }
    }

    loadSymptoms();

  }, [t]);


  // =========================================================
  // Filter symptoms
  // =========================================================

  const filteredSymptoms =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return symptoms;
      }

      return symptoms.filter(
        (symptom) =>
          symptom
            .toLowerCase()
            .includes(query)
      );

    }, [symptoms, search]);


  // =========================================================
  // Toggle symptom
  // =========================================================

  function toggleSymptom(
    symptom: string
  ) {

    setSelectedSymptoms(
      (current) => {

        if (
          current.includes(symptom)
        ) {

          return current.filter(
            (item) =>
              item !== symptom
          );

        }

        return [
          ...current,
          symptom,
        ];

      }
    );

    // Clear old prediction
    setPrediction(null);
  }


  // =========================================================
  // Remove symptom
  // =========================================================

  function removeSymptom(
    symptom: string
  ) {

    setSelectedSymptoms(
      (current) =>
        current.filter(
          (item) =>
            item !== symptom
        )
    );

    setPrediction(null);
  }


  // =========================================================
  // Predict
  // =========================================================

  async function handlePredict() {

    if (
      selectedSymptoms.length === 0
    ) {

      setError(
        t(
          "symptomChecker.errors.noSymptoms"
        )
      );

      return;
    }

    try {

      setPredicting(true);
      setError(null);

      const result =
        await predictDisease({
          symptoms:
            selectedSymptoms,
          top_k: 5,
        });

      setPrediction(result);

    } catch (err: any) {

      console.error(err);

      const message =
        err?.response?.data?.detail ||
        t(
          "symptomChecker.errors.prediction"
        );

      setError(message);

    } finally {

      setPredicting(false);

    }
  }


  // =========================================================
  // Render
  // =========================================================

  return (

    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-5xl">


        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">

            {t(
              "symptomChecker.title"
            )}

          </h1>


          <p className="mt-2 text-gray-600">

            {t(
              "symptomChecker.description"
            )}

          </p>

        </div>


        {/* Error */}

        {error && (

          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

            {error}

          </div>

        )}


        <div className="grid gap-6 lg:grid-cols-3">


          {/* Symptoms */}

          <div className="lg:col-span-2">

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-4">

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder={t(
                    "symptomChecker.searchPlaceholder"
                  )}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {loading ? (

                <div className="py-12 text-center text-gray-500">

                  {t(
                    "symptomChecker.loading"
                  )}

                </div>

              ) : (

                <div className="max-h-[500px] overflow-y-auto">

                  <div className="grid gap-2 sm:grid-cols-2">

                    {filteredSymptoms.map(
                      (symptom) => {

                        const selected =
                          selectedSymptoms.includes(
                            symptom
                          );

                        return (

                          <label
                            key={symptom}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                              selected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >

                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                toggleSymptom(
                                  symptom
                                )
                              }
                              className="h-4 w-4"
                            />

                            <span className="text-sm text-gray-800">
                              {symptom}
                            </span>

                          </label>

                        );

                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* Selected symptoms */}

          <div>

            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">

                {t(
                  "symptomChecker.selectedTitle"
                )}

              </h2>


              <p className="mt-1 text-sm text-gray-500">

                {t(
                  "symptomChecker.selectedCount",
                  {
                    count:
                      selectedSymptoms.length,
                  }
                )}

              </p>


              <div className="mt-4 space-y-2">

                {selectedSymptoms.length === 0 ? (

                  <p className="text-sm text-gray-500">

                    {t(
                      "symptomChecker.noSymptoms"
                    )}

                  </p>

                ) : (

                  selectedSymptoms.map(
                    (symptom) => (

                      <div
                        key={symptom}
                        className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-2"
                      >

                        <span className="text-sm text-gray-800">
                          {symptom}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            removeSymptom(
                              symptom
                            )
                          }
                          className="text-gray-500 hover:text-red-600"
                          aria-label={t(
                            "symptomChecker.removeSymptom"
                          )}
                        >
                          ×
                        </button>

                      </div>

                    )
                  )

                )}

              </div>


              <button
                type="button"
                disabled={
                  predicting ||
                  selectedSymptoms.length === 0
                }
                onClick={
                  handlePredict
                }
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >

                {predicting
                  ? t(
                      "symptomChecker.analyzing"
                    )
                  : t(
                      "symptomChecker.analyze"
                    )}

              </button>

            </div>

          </div>

        </div>


        {/* Prediction */}

        {prediction && (

          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">

              {t(
                "symptomChecker.results.title"
              )}

            </h2>


            <p className="mt-2 text-sm text-gray-500">

              {t(
                "symptomChecker.results.description"
              )}

            </p>


            {prediction.needs_caution && (

              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">

                {t(
                  "symptomChecker.results.caution"
                )}

              </div>

            )}


            <div className="mt-6 space-y-3">

              {prediction.results.map(
                (result) => (

                  <div
                    key={result.disease}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">

                        {result.rank}

                      </div>


                      <span className="font-medium text-gray-900">

                        {result.disease}

                      </span>

                    </div>


                    <span className="text-sm text-gray-500">

                      {t(
                        "symptomChecker.results.modelAssessment",
                        {
                          level:
                            getConfidenceLabel(
                              result.model_score,
                              t
                            ),
                        }
                      )}

                    </span>

                  </div>

                )
              )}

            </div>


            {/* AI Explanation */}

            {prediction.explanation && (

              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                <h3 className="text-lg font-semibold text-blue-900">

                  {t(
                    "symptomChecker.results.aiExplanation"
                  )}

                </h3>


                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-blue-900">

                  {prediction.explanation}

                </p>

              </div>

            )}


            {/* Chat */}

            <button
              type="button"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    predictionContext: {
                      symptoms:
                        selectedSymptoms,

                      predictions:
                        prediction.results.map(
                          (item) => ({
                            disease:
                              item.disease,
                            model_score:
                              item.model_score,
                          })
                        ),

                      top_score:
                        prediction.top_score,

                      needs_caution:
                        prediction.needs_caution,

                      confidence_level:
                        prediction.confidence_level,
                    },
                  },
                })
              }
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
            >

              {t(
                "symptomChecker.results.askChat"
              )}

            </button>


            {/* Disclaimer */}

            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">

                <p className="font-semibold">

                  {t(
                    "symptomChecker.results.important"
                  )}

                </p>


                <p className="mt-1">

                  {t(
                    "symptomChecker.results.aiDisclaimer"
                  )}

                </p>


                <p className="mt-2">

                  {t(
                    "symptomChecker.results.medicalCare"
                  )}

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}


// =========================================================
// Confidence label
// =========================================================

function getConfidenceLabel(
  score: number,
  t: (
    key: string
  ) => string
): string {

  if (score >= 0.90) {
    return t(
      "symptomChecker.confidence.high"
    );
  }

  if (score >= 0.70) {
    return t(
      "symptomChecker.confidence.moderate"
    );
  }

  return t(
    "symptomChecker.confidence.low"
  );
}