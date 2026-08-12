import {
  useEffect,
  useState,
} from "react";

import {
  uploadReport,
  analyzeReport,
  type BloodValue,
} from "../api/reports";

import ReactMarkdown from "react-markdown";

import { useTranslation } from "react-i18next";


export default function ReportAnalysisPage() {

  const { t } = useTranslation();


  // ==========================================================
  // STATE
  // ==========================================================

  const [file, setFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [values, setValues] =
    useState<BloodValue[]>([]);

  const [analysis, setAnalysis] =
    useState("");

  const [loadingOCR, setLoadingOCR] =
    useState(false);

  const [loadingAnalysis, setLoadingAnalysis] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // Cleanup preview URL
  // ==========================================================

  useEffect(() => {

    return () => {

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

    };

  }, [previewUrl]);


  // ==========================================================
  // File selection
  // ==========================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const selectedFile =
      event.target.files?.[0] ?? null;


    setFile(selectedFile);


    // Clear previous results

    setValues([]);

    setAnalysis("");

    setError("");


    if (selectedFile) {

      const url =
        URL.createObjectURL(
          selectedFile
        );

      setPreviewUrl(url);

    } else {

      setPreviewUrl(null);

    }

  }


  // ==========================================================
  // Upload + OCR
  // ==========================================================

  async function handleUpload() {

    if (!file) {

      setError(
        t("reports.errors.noFile")
      );

      return;

    }


    setError("");

    setAnalysis("");

    setValues([]);

    setLoadingOCR(true);


    try {

      const response =
        await uploadReport(file);


      setValues(
        response.values
      );

    } catch (err) {

      console.error(
        "OCR error:",
        err
      );


      setError(
        t("reports.errors.ocr")
      );

    } finally {

      setLoadingOCR(false);

    }

  }


  // ==========================================================
  // Gemini analysis
  // ==========================================================

  async function handleAnalyze() {

    if (!values.length) {

      setError(
        t("reports.errors.noValues")
      );

      return;

    }


    setError("");

    setLoadingAnalysis(true);


    try {

      const response =
        await analyzeReport(
          values
        );


      setAnalysis(
        response.analysis
      );

    } catch (err) {

      console.error(
        "Analysis error:",
        err
      );


      setError(
        t("reports.errors.analysis")
      );

    } finally {

      setLoadingAnalysis(false);

    }

  }


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >


      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div
        style={{
          marginBottom: "32px",
        }}
      >

        <h1>

          {t(
            "reports.title"
          )}

        </h1>


        <p>

          {t(
            "reports.description"
          )}

        </p>

      </div>


      {/* =====================================================
          UPLOAD SECTION
          ===================================================== */}

      <section
        style={{
          padding: "24px",
          border:
            "1px solid #ddd",
          borderRadius:
            "12px",
          marginBottom:
            "32px",
        }}
      >

        <h2>

          {t(
            "reports.upload.title"
          )}

        </h2>


        <p>

          {t(
            "reports.upload.supportedFormats"
          )}

        </p>


        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={
            handleFileChange
          }
        />


        {/* ===================================================
            IMAGE PREVIEW
            =================================================== */}

        {previewUrl && (

          <div
            style={{
              marginTop:
                "24px",
            }}
          >

            <h3>

              {t(
                "reports.upload.preview"
              )}

            </h3>


            <div
              style={{
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                padding:
                  "12px",
                display:
                  "inline-block",
                maxWidth:
                  "100%",
              }}
            >

              <img
                src={previewUrl}
                alt={t(
                  "reports.upload.imageAlt"
                )}
                style={{
                  display:
                    "block",
                  maxWidth:
                    "100%",
                  maxHeight:
                    "500px",
                  objectFit:
                    "contain",
                  borderRadius:
                    "6px",
                }}
              />

            </div>

          </div>

        )}


        {/* ===================================================
            UPLOAD BUTTON
            =================================================== */}

        <div
          style={{
            marginTop:
              "20px",
          }}
        >

          <button
            onClick={
              handleUpload
            }
            disabled={
              !file ||
              loadingOCR
            }
          >

            {loadingOCR
              ? t(
                  "reports.upload.extracting"
                )
              : t(
                  "reports.upload.button"
                )}

          </button>

        </div>

      </section>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div
          style={{
            padding:
              "14px 16px",
            border:
              "1px solid #f0b4b4",
            borderRadius:
              "8px",
            marginBottom:
              "24px",
          }}
        >

          {error}

        </div>

      )}


      {/* =====================================================
          OCR LOADING
          ===================================================== */}

      {loadingOCR && (

        <section
          style={{
            padding:
              "24px",
            border:
              "1px solid #ddd",
            borderRadius:
              "12px",
            marginBottom:
              "32px",
          }}
        >

          <h3>

            {t(
              "reports.ocr.processing"
            )}

          </h3>


          <p>

            {t(
              "reports.ocr.description"
            )}

          </p>

        </section>

      )}


      {/* =====================================================
          EXTRACTED RESULTS
          ===================================================== */}

      {values.length > 0 &&
        !loadingOCR && (

          <section
            style={{
              marginBottom:
                "32px",
            }}
          >

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <h2>

                {t(
                  "reports.results.title"
                )}

              </h2>


              <p>

                {t(
                  "reports.results.detected",
                  {
                    count:
                      values.length,
                  }
                )}

              </p>

            </div>


            {/* =================================================
                RESULT CARDS
                ================================================= */}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap:
                  "16px",
              }}
            >

              {values.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={`${item.test}-${index}`}
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "12px",
                      padding:
                        "20px",
                    }}
                  >

                    {/* Test name */}

                    <h3
                      style={{
                        marginTop:
                          0,
                        marginBottom:
                          "16px",
                        textTransform:
                          "capitalize",
                      }}
                    >

                      {item.test.replace(
                        /_/g,
                        " "
                      )}

                    </h3>


                    {/* Result */}

                    <div
                      style={{
                        marginBottom:
                          "12px",
                      }}
                    >

                      <strong>

                        {t(
                          "reports.results.result"
                        )}

                      </strong>


                      <p
                        style={{
                          margin:
                            "6px 0 0",
                          fontSize:
                            "18px",
                        }}
                      >

                        {item.result ??
                          item.value ??
                          t(
                            "reports.results.notDetected"
                          )}

                        {item.unit
                          ? ` ${item.unit}`
                          : ""}

                      </p>

                    </div>


                    {/* Reference range */}

                    {item.reference_range && (

                      <div>

                        <strong>

                          {t(
                            "reports.results.referenceRange"
                          )}

                        </strong>


                        <p
                          style={{
                            margin:
                              "6px 0 0",
                          }}
                        >

                          {
                            item.reference_range
                          }

                          {item.unit
                            ? ` ${item.unit}`
                            : ""}

                        </p>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>


            {/* =================================================
                ANALYZE BUTTON
                ================================================= */}

            <div
              style={{
                marginTop:
                  "24px",
              }}
            >

              <button
                onClick={
                  handleAnalyze
                }
                disabled={
                  loadingAnalysis
                }
              >

                {loadingAnalysis
                  ? t(
                      "reports.analysis.analyzing"
                    )
                  : t(
                      "reports.analysis.button"
                    )}

              </button>

            </div>

          </section>

        )}


      {/* =====================================================
          GEMINI LOADING
          ===================================================== */}

      {loadingAnalysis && (

        <section
          style={{
            border:
              "1px solid #ddd",
            borderRadius:
              "12px",
            padding:
              "24px",
            marginBottom:
              "32px",
          }}
        >

          <h2>

            {t(
              "reports.analysis.title"
            )}

          </h2>


          <p>

            {t(
              "reports.analysis.loading"
            )}

          </p>

        </section>

      )}


      {/* =====================================================
          GEMINI ANALYSIS
          ===================================================== */}

      {analysis &&
        !loadingAnalysis && (

          <section
            style={{
              border:
                "1px solid #ddd",
              borderRadius:
                "12px",
              padding:
                "24px",
              marginTop:
                "32px",
            }}
          >

            <h2>

              {t(
                "reports.analysis.explanation"
              )}

            </h2>


            <div
              style={{
                lineHeight:
                  1.7,
              }}
            >

              <ReactMarkdown>

                {analysis}

              </ReactMarkdown>

            </div>

          </section>

        )}

    </main>

  );
}