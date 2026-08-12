import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const LANGUAGE_CODES: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Bengali: "bn-IN",
  Marathi: "mr-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Gujarati: "gu-IN",
};

export function useVoiceAssistant(
  language: string,
) {
  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(
      null,
    );

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [supported, setSupported] =
    useState(true);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      LANGUAGE_CODES[language] ||
      "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (
      event,
    ) => {
      const transcript =
        event.results[0][0]
          .transcript;

      window.dispatchEvent(
        new CustomEvent(
          "healthgpt-voice-result",
          {
            detail: transcript,
          },
        ),
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  function startListening() {
    if (!recognitionRef.current) {
      return;
    }

    setIsListening(true);

    recognitionRef.current.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();

    setIsListening(false);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text,
      );

    utterance.lang =
      LANGUAGE_CODES[language] ||
      "en-IN";

    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance,
    );
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return {
    supported,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}