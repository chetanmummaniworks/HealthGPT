import { useEffect, useState } from "react";

import {
  FileText,
  Activity,
  Calendar,
  Loader2,
} from "lucide-react";

import apiClient from "../api/client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTranslation } from "react-i18next";


interface ReportValue {
  test: string;
  value: number | null;
  result: string | null;
  qualitative_value: string | null;
  unit: string | null;
  reference_range: string | null;
  raw_line: string;
}


interface ReportHistoryItem {
  id: number;
  report_name: string;
  extracted_values: ReportValue[];
  analysis: string | null;
  created_at: string;
}


interface ReportHistoryResponse {
  reports: ReportHistoryItem[];
}


export default function HealthHistoryPage() {

  const { t } =
    useTranslation();


  const [reports, setReports] =
    useState<ReportHistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [expandedReport, setExpandedReport] =
    useState<number | null>(null);


  // ==========================================================
  // TRANSLATE TEST NAME
  // ==========================================================

  function translateTestName(
    test: string,
  ): string {

    const normalized =
      test
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");


    const key =
      `history.tests.${normalized}`;


    const translated =
      t(key);


    // If translation doesn't exist,
    // keep the original backend value.
    if (
      translated === key
    ) {
      return test;
    }


    return translated;
  }


  // ==========================================================
  // TRANSLATE RESULT
  // ==========================================================

  function translateResult(
    value:
      string | null | undefined,
  ): string {

    if (!value) {
      return "";
    }


    const normalized =
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");


    const key =
      `history.values.${normalized}`;


    const translated =
      t(key);


    if (
      translated === key
    ) {
      return value;
    }


    return translated;
  }


  // ==========================================================
  // TRANSLATE REPORT NAME
  // ==========================================================

  function translateReportName(
    name: string,
  ): string {

    const normalized =
      name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");


    const key =
      `history.reportNames.${normalized}`;


    const translated =
      t(key);


    if (
      translated === key
    ) {
      return name;
    }


    return translated;
  }


  // ==========================================================
  // LOAD HISTORY
  // ==========================================================

  useEffect(() => {

    async function loadHistory() {

      try {

        setLoading(true);
        setError(null);


        const response =
          await apiClient.get<ReportHistoryResponse>(
            "/reports/history",
          );


        setReports(
          response.data.reports,
        );

      } catch (err) {

        console.error(
          "Failed to load report history:",
          err,
        );


        setError(
          t("history.errors.load"),
        );

      } finally {

        setLoading(false);

      }

    }


    loadHistory();

  }, [t]);


  // ==========================================================
  // BUILD TREND DATA
  // ==========================================================

  function buildTrendData(
    reports: ReportHistoryItem[],
    testName: string,
  ) {

    return [...reports]
      .reverse()
      .map((report) => {

        const value =
          report.extracted_values.find(
            (item) =>
              item.test.toLowerCase() ===
              testName.toLowerCase(),
          );


        if (
          !value ||
          value.value === null ||
          value.value === undefined
        ) {

          return null;

        }


        return {

          date:
            new Date(
              report.created_at,
            ).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
              },
            ),

          value:
            value.value,

        };

      })
      .filter(
        (
          item,
        ): item is {
          date: string;
          value: number;
        } =>
          item !== null,
      );

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  function formatDate(
    dateString: string,
  ) {

    return new Date(
      dateString,
    ).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 32px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <Loader2
            size={20}
            style={{
              animation:
                "spin 1s linear infinite",
            }}
          />

          <span>
            {t(
              "history.loading",
            )}
          </span>

        </div>

      </main>

    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main
      style={{
        maxWidth: "1000px",
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
            margin:
              "8px 0 10px",
            fontSize: "32px",
          }}
        >
          {t("history.title")}
        </h1>


        <p
          style={{
            margin: 0,
            fontSize: "16px",
            opacity: 0.7,
            lineHeight: 1.6,
          }}
        >
          {t(
            "history.description",
          )}
        </p>

      </section>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <section
          style={{
            padding: "16px",
            marginBottom: "24px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#b91c1c",
            border:
              "1px solid #fecaca",
          }}
        >

          {error}

        </section>

      )}


      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {!error &&
        reports.length === 0 && (

          <section
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              padding:
                "40px 24px",
              textAlign: "center",
            }}
          >

            <FileText
              size={40}
              style={{
                marginBottom:
                  "12px",
                opacity: 0.5,
              }}
            />


            <h2
              style={{
                margin:
                  "0 0 8px",
                fontSize: "20px",
              }}
            >
              {t(
                "history.empty.title",
              )}
            </h2>


            <p
              style={{
                margin: 0,
                opacity: 0.65,
              }}
            >
              {t(
                "history.empty.description",
              )}
            </p>

          </section>

        )}


      {/* =====================================================
          REPORTS
          ===================================================== */}

      <section
        style={{
          display: "grid",
          gap: "20px",
        }}
      >

        {reports.map(
          (report) => {

            const isExpanded =
              expandedReport ===
              report.id;


            return (

              <article
                key={report.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  background:
                    "#ffffff",
                }}
              >

                {/* ------------------------------------------------
                    REPORT HEADER
                    ------------------------------------------------ */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "16px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems:
                        "center",
                    }}
                  >

                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius:
                          "10px",
                        background:
                          "#f0fdfa",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >

                      <FileText
                        size={21}
                      />

                    </div>


                    <div>

                      <h2
                        style={{
                          margin: 0,
                          fontSize:
                            "19px",
                        }}
                      >

                        {translateReportName(
                          report.report_name,
                        )}

                      </h2>


                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "6px",
                          marginTop:
                            "5px",
                          fontSize:
                            "13px",
                          opacity: 0.65,
                        }}
                      >

                        <Calendar
                          size={14}
                        />

                        {formatDate(
                          report.created_at,
                        )}

                      </div>

                    </div>

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "6px",
                      fontSize:
                        "13px",
                      opacity: 0.65,
                    }}
                  >

                    <Activity
                      size={15}
                    />

                    {report.extracted_values.length}{" "}

                    {report.extracted_values.length ===
                    1
                      ? t(
                          "history.result",
                        )
                      : t(
                          "history.results",
                        )}

                  </div>

                </div>


                {/* ------------------------------------------------
                    LABORATORY VALUES
                    ------------------------------------------------ */}

                <div
                  style={{
                    marginTop:
                      "22px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >

                  {report.extracted_values.map(
                    (
                      item,
                      index,
                    ) => (

                      <div
                        key={`${item.test}-${index}`}
                        style={{
                          padding:
                            "14px",
                          borderRadius:
                            "10px",
                          background:
                            "#f9fafb",
                          border:
                            "1px solid #f3f4f6",
                        }}
                      >

                        {/* Test name */}

                        <div
                          style={{
                            fontSize:
                              "13px",
                            opacity:
                              0.65,
                            marginBottom:
                              "5px",
                          }}
                        >

                          {translateTestName(
                            item.test,
                          )}

                        </div>


                        {/* Result */}

                        <strong
                          style={{
                            fontSize:
                              "18px",
                          }}
                        >

                          {item.value !==
                          null
                            ? item.value
                            : translateResult(
                                item.qualitative_value ??
                                  item.result ??
                                  null,
                              ) ||
                              t(
                                "history.values.not_detected",
                              )}

                        </strong>


                        {/* Unit */}

                        {item.unit && (

                          <span
                            style={{
                              marginLeft:
                                "5px",
                              fontSize:
                                "13px",
                              opacity:
                                0.65,
                            }}
                          >

                            {item.unit}

                          </span>

                        )}


                        {/* Reference */}

                        {item.reference_range && (

                          <div
                            style={{
                              marginTop:
                                "6px",
                              fontSize:
                                "12px",
                              opacity:
                                0.6,
                            }}
                          >

                            {t(
                              "history.reference",
                            )}

                            {": "}

                            {item.reference_range}

                          </div>

                        )}

                      </div>

                    ),
                  )}

                </div>


                {/* ------------------------------------------------
                    AI ANALYSIS
                    ------------------------------------------------ */}

                {report.analysis && (

                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReport(
                          isExpanded
                            ? null
                            : report.id,
                        )
                      }
                      style={{
                        padding:
                          "10px 14px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #d1d5db",
                        background:
                          "#ffffff",
                        cursor:
                          "pointer",
                        fontWeight:
                          600,
                      }}
                    >

                      {isExpanded
                        ? t(
                            "history.hideExplanation",
                          )
                        : t(
                            "history.viewExplanation",
                          )}

                    </button>


                    {isExpanded && (

                      <div
                        style={{
                          marginTop:
                            "14px",
                          padding:
                            "18px",
                          borderRadius:
                            "10px",
                          background:
                            "#f0fdfa",
                          lineHeight:
                            1.7,
                          whiteSpace:
                            "pre-wrap",
                          fontSize:
                            "14px",
                        }}
                      >

                        {report.analysis}

                      </div>

                    )}

                  </div>

                )}

              </article>

            );

          },
        )}

      </section>


      {/* =====================================================
          LABORATORY TRENDS
          ===================================================== */}

      {reports.length >= 2 && (

        <section
          style={{
            marginTop: "32px",
            border:
              "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            background:
              "#ffffff",
          }}
        >

          <div
            style={{
              marginBottom:
                "20px",
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >

              {t(
                "history.trends.title",
              )}

            </h2>


            <p
              style={{
                margin:
                  "6px 0 0",
                opacity: 0.65,
                lineHeight: 1.5,
                fontSize: "14px",
              }}
            >

              {t(
                "history.trends.description",
              )}

            </p>

          </div>


          {(() => {

            const testNames =
              Array.from(
                new Set(
                  reports.flatMap(
                    (report) =>
                      report.extracted_values
                        .filter(
                          (item) =>
                            item.value !==
                              null &&
                            item.value !==
                              undefined,
                        )
                        .map(
                          (item) =>
                            item.test,
                        ),
                  ),
                ),
              );


            const trendTests =
              testNames.filter(
                (testName) => {

                  const data =
                    buildTrendData(
                      reports,
                      testName,
                    );

                  return (
                    data.length >= 2
                  );

                },
              );


            if (
              trendTests.length === 0
            ) {

              return (

                <p
                  style={{
                    opacity: 0.65,
                    fontSize:
                      "14px",
                  }}
                >

                  {t(
                    "history.trends.noTrends",
                  )}

                </p>

              );

            }


            return (

              <div
                style={{
                  display:
                    "grid",
                  gap: "28px",
                }}
              >

                {trendTests.map(
                  (testName) => {

                    const data =
                      buildTrendData(
                        reports,
                        testName,
                      );


                    return (

                      <div
                        key={testName}
                        style={{
                          border:
                            "1px solid #f3f4f6",
                          borderRadius:
                            "12px",
                          padding:
                            "18px",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            marginBottom:
                              "12px",
                            gap:
                              "12px",
                          }}
                        >

                          <h3
                            style={{
                              margin: 0,
                              fontSize:
                                "17px",
                            }}
                          >

                            {translateTestName(
                              testName,
                            )}

                          </h3>


                          <span
                            style={{
                              fontSize:
                                "13px",
                              opacity:
                                0.65,
                            }}
                          >

                            {t(
                              "history.trends.measurements",
                              {
                                count:
                                  data.length,
                              },
                            )}

                          </span>

                        </div>


                        <div
                          style={{
                            width:
                              "100%",
                            height: 280,
                          }}
                        >

                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >

                            <LineChart
                              data={data}
                              margin={{
                                top: 10,
                                right: 20,
                                left: 0,
                                bottom: 5,
                              }}
                            >

                              <CartesianGrid
                                strokeDasharray="3 3"
                              />

                              <XAxis
                                dataKey="date"
                              />

                              <YAxis />

                              <Tooltip />

                              <Line
                                type="monotone"
                                dataKey="value"
                                strokeWidth={
                                  2
                                }
                                dot={{
                                  r: 4,
                                }}
                                name={translateTestName(
                                  testName,
                                )}
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </div>


                        <p
                          style={{
                            margin:
                              "10px 0 0",
                            fontSize:
                              "12px",
                            opacity:
                              0.55,
                          }}
                        >

                          {t(
                            "history.trends.disclaimer",
                          )}

                        </p>

                      </div>

                    );

                  },
                )}

              </div>

            );

          })()}

        </section>

      )}

    </main>

  );

}