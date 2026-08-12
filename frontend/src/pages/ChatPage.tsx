import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  sendChatMessage,
  type ChatMessage,
} from "../api/chat";

import {
  useVoiceAssistant,
} from "../hooks/useVoiceAssistant";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useTranslation,
} from "react-i18next";


export default function ChatPage() {

  const { t } =
    useTranslation();

  const { user } =
    useAuth();


  // ==========================================================
  // CHAT STATE
  // ==========================================================

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // VOICE ASSISTANT
  // ==========================================================

  const {
    supported,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoiceAssistant(
    user?.preferred_language ||
      "English",
  );


  // ==========================================================
  // MESSAGE SCROLL
  // ==========================================================

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);


  // ==========================================================
  // VOICE INPUT RESULT
  // ==========================================================

  useEffect(() => {

    function handleVoiceResult(
      event: Event,
    ) {

      const customEvent =
        event as CustomEvent<string>;

      setInput(
        customEvent.detail,
      );

    }


    window.addEventListener(
      "healthgpt-voice-result",
      handleVoiceResult,
    );


    return () => {

      window.removeEventListener(
        "healthgpt-voice-result",
        handleVoiceResult,
      );

    };

  }, []);


  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  async function handleSend() {

    const message =
      input.trim();


    if (
      !message ||
      loading
    ) {
      return;
    }


    setError("");

    setInput("");


    // --------------------------------------------------------
    // User message
    // --------------------------------------------------------

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
    };


    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ],
    );


    setLoading(true);


    try {

      // ------------------------------------------------------
      // Send to backend
      // ------------------------------------------------------

      const response =
        await sendChatMessage(
          message,
          messages,
        );


      // ------------------------------------------------------
      // Assistant message
      // ------------------------------------------------------

      const assistantMessage:
        ChatMessage = {
          role: "assistant",
          content:
            response.response,
        };


      setMessages(
        (previous) => [
          ...previous,
          assistantMessage,
        ],
      );


      // ------------------------------------------------------
      // Voice response
      // ------------------------------------------------------

      speak(
        response.response,
      );


    } catch (err) {

      console.error(
        "Chat error:",
        err,
      );


      setError(
        t(
          "chat.errors.response",
        ),
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // ENTER KEY
  // ==========================================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  }


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        style={{
          padding:
            "28px 24px",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f3f4f6",
            }}
          >

            <Bot size={22} />

          </div>


          <div>

            <h1
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >

              {t(
                "chat.title",
              )}

            </h1>


            <p
              style={{
                margin:
                  "4px 0 0",
                fontSize: "13px",
                opacity: 0.65,
              }}
            >

              {t(
                "chat.subtitle",
              )}

            </p>

          </div>

        </div>

      </header>


      {/* =====================================================
          MESSAGES
          ===================================================== */}

      <section
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >

        {/* ---------------------------------------------------
            Empty state
            --------------------------------------------------- */}

        {messages.length === 0 && (

          <div
            style={{
              maxWidth: "600px",
              margin: "80px auto",
              textAlign: "center",
            }}
          >

            <Bot size={42} />


            <h2>

              {t(
                "chat.empty.title",
              )}

            </h2>


            <p
              style={{
                opacity: 0.65,
                lineHeight: 1.6,
              }}
            >

              {t(
                "chat.empty.description",
              )}

            </p>

          </div>

        )}


        {/* ---------------------------------------------------
            Messages
            --------------------------------------------------- */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >

          {messages.map(
            (
              message,
              index,
            ) => {

              const isUser =
                message.role ===
                "user";


              return (

                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      isUser
                        ? "flex-end"
                        : "flex-start",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      maxWidth: "75%",
                      flexDirection:
                        isUser
                          ? "row-reverse"
                          : "row",
                    }}
                  >

                    {/* Avatar */}

                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f3f4f6",
                      }}
                    >

                      {isUser ? (
                        <User
                          size={17}
                        />
                      ) : (
                        <Bot
                          size={17}
                        />
                      )}

                    </div>


                    {/* Message */}

                    <div>

                      <div
                        style={{
                          padding:
                            "12px 16px",
                          borderRadius:
                            "14px",
                          background:
                            isUser
                              ? "#eef2ff"
                              : "#f3f4f6",
                          lineHeight: 1.6,
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >

                        {message.content}

                      </div>


                      {/* ------------------------------------------------
                          Voice controls for assistant messages
                          ------------------------------------------------ */}

                      {!isUser &&
                        message.content && (
                          <div
                            style={{
                              marginTop:
                                "7px",
                              display:
                                "flex",
                              gap: "6px",
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                isSpeaking
                                  ? stopSpeaking()
                                  : speak(
                                      message.content,
                                    )
                              }
                              title={
                                isSpeaking
                                  ? "Stop speaking"
                                  : "Read response aloud"
                              }
                              style={{
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                gap: "6px",
                                padding:
                                  "6px 9px",
                                border:
                                  "1px solid #e5e7eb",
                                borderRadius:
                                  "7px",
                                background:
                                  "#ffffff",
                                cursor:
                                  "pointer",
                                fontSize:
                                  "12px",
                              }}
                            >

                              {isSpeaking ? (
                                <VolumeX
                                  size={14}
                                />
                              ) : (
                                <Volume2
                                  size={14}
                                />
                              )}

                              {isSpeaking
                                ? "Stop"
                                : "Listen"}

                            </button>

                          </div>
                        )}

                    </div>

                  </div>

                </div>

              );

            },
          )}


          {/* ---------------------------------------------------
              Loading
              --------------------------------------------------- */}

          {loading && (

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >

              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                }}
              >

                <Bot size={17} />

              </div>


              <div
                style={{
                  padding:
                    "12px 16px",
                  borderRadius:
                    "14px",
                  background:
                    "#f3f4f6",
                }}
              >

                {t(
                  "chat.thinking",
                )}

              </div>

            </div>

          )}


          <div
            ref={
              messagesEndRef
            }
          />

        </div>

      </section>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div
          style={{
            padding:
              "10px 24px",
            fontSize: "14px",
            color: "#b91c1c",
          }}
        >

          {error}

        </div>

      )}


      {/* =====================================================
          INPUT
          ===================================================== */}

      <footer
        style={{
          padding:
            "16px 24px 24px",
          borderTop:
            "1px solid #e5e7eb",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >

          {/* --------------------------------------------------
              Text input
              -------------------------------------------------- */}

          <textarea
            value={input}
            onChange={(
              event,
            ) =>
              setInput(
                event.target.value,
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={t(
              "chat.inputPlaceholder",
            )}
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              resize: "none",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "10px",
              fontFamily:
                "inherit",
              fontSize: "14px",
            }}
          />


          {/* --------------------------------------------------
              Microphone
              -------------------------------------------------- */}

          {supported && (

            <button
              type="button"
              onClick={
                isListening
                  ? stopListening
                  : startListening
              }
              disabled={loading}
              title={
                isListening
                  ? "Stop listening"
                  : "Speak"
              }
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                width: "46px",
                height: "46px",
                minWidth: "46px",
                borderRadius:
                  "9px",
                border:
                  "1px solid #d1d5db",
                background:
                  isListening
                    ? "#fee2e2"
                    : "#ffffff",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
              }}
            >

              {isListening ? (
                <MicOff
                  size={19}
                />
              ) : (
                <Mic
                  size={19}
                />
              )}

            </button>

          )}


          {/* --------------------------------------------------
              Send
              -------------------------------------------------- */}

          <button
            onClick={
              handleSend
            }
            disabled={
              !input.trim() ||
              loading
            }
            style={{
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: "8px",
              minHeight:
                "46px",
            }}
          >

            <Send size={17} />

            {t(
              "chat.send",
            )}

          </button>

        </div>


        {/* ----------------------------------------------------
            Voice status
            ---------------------------------------------------- */}

        {supported &&
          isListening && (

            <p
              style={{
                margin:
                  "8px 0 0",
                textAlign:
                  "center",
                fontSize: "12px",
                color: "#b91c1c",
              }}
            >

              🎙️ Listening...

            </p>

          )}


        {/* ----------------------------------------------------
            Disclaimer
            ---------------------------------------------------- */}

        <p
          style={{
            margin:
              "8px 0 0",
            textAlign:
              "center",
            fontSize: "11px",
            opacity: 0.55,
          }}
        >

          {t(
            "chat.disclaimer",
          )}

        </p>

      </footer>

    </main>

  );
}