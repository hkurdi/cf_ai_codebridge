import type { ProgrammingLanguage } from "../types";

export const LANGUAGE_MAP: Record<ProgrammingLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  go: "go",
  rust: "rust",
  ruby: "ruby",
  php: "php",
};

export const PROGRAMMING_LANGUAGES: {
  value: ProgrammingLanguage;
  label: string;
}[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
];
