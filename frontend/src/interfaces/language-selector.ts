import type { ExplanationLanguage, ProgrammingLanguage } from "../types";

export interface LanguageSelectorProps {
    fromLang: ProgrammingLanguage;
    toLang: ProgrammingLanguage;
    explanationLang: ExplanationLanguage;
    onFromLangChange: (lang: ProgrammingLanguage) => void;
    onToLangChange: (lang: ProgrammingLanguage) => void;
    onExplanationLangChange: (lang: ExplanationLanguage) => void;
  }