import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "./useTranslation";
import { useConversation } from "./useConversation";
import type { ProgrammingLanguage, ExplanationLanguage } from "../types";

export const useCodeBridge = () => {
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const [fromLang, setFromLang] = useState<ProgrammingLanguage>("python");
  const [toLang, setToLang] = useState<ProgrammingLanguage>("javascript");
  const [explanationLang, setExplanationLang] =
    useState<ExplanationLanguage>("en");

  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [audio, setAudio] = useState<string | null>(null);

  const {
    translate,
    isLoading: isTranslating,
    error: translationError,
  } = useTranslation(sessionId);
  const {
    messages,
    sendMessage,
    clearMessages,
    isLoading: isChatLoading,
  } = useConversation(sessionId);

  const handleTranslate = useCallback(async () => {
    if (!inputCode.trim()) return;
  
    try {
      const response = await translate({
        code: inputCode,
        fromLang,
        toLang,
        explanationLanguage: explanationLang,
      });
  
      const codeMatch = response.response.match(/```[\w]*\n([\s\S]*?)\n```/);
      const translatedCode = codeMatch ? codeMatch[1] : response.response;
      const explanationText = response.response.split('```')[2] || response.response;
  
      setOutputCode(translatedCode);
      setExplanation(explanationText.trim());
      setAudio(response.audio || null);
    } catch (err) {
      console.error('Translation failed:', err);
    }
  }, [inputCode, fromLang, toLang, explanationLang, translate]);

  const handleReset = useCallback(() => {
    setInputCode("");
    setOutputCode("");
    setExplanation("");
    setAudio(null);
    clearMessages();
  }, [clearMessages]);

  const handleChatMessage = useCallback(
    async (message: string) => {
      try {
        await sendMessage(message);
      } catch (err) {
        console.error("Chat message failed:", err);
      }
    },
    [sendMessage]
  );

  return {
    fromLang,
    toLang,
    explanationLang,
    setFromLang,
    setToLang,
    setExplanationLang,

    inputCode,
    outputCode,
    explanation,
    audio,
    setInputCode,

    isTranslating,
    isChatLoading,
    translationError,

    messages,

    handleTranslate,
    handleReset,
    handleChatMessage,
  };
};
