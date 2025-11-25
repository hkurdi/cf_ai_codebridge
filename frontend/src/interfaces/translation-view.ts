import type { ProgrammingLanguage, ExplanationLanguage } from '../types';

export interface TranslationViewProps {
  fromLang: ProgrammingLanguage;
  toLang: ProgrammingLanguage;
  explanationLang: ExplanationLanguage;
  inputCode: string;
  isTranslating: boolean;
  error: string | null;
  onFromLangChange: (lang: ProgrammingLanguage) => void;
  onToLangChange: (lang: ProgrammingLanguage) => void;
  onExplanationLangChange: (lang: ExplanationLanguage) => void;
  onInputCodeChange: (code: string) => void;
  onTranslate: () => void;
}