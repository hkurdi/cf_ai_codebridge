import type { ProgrammingLanguage } from "../types";

export interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: ProgrammingLanguage;
    placeholder?: string;
    readOnly?: boolean;
    height?: string;
  }