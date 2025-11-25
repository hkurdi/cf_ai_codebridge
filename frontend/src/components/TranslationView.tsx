import React from "react";
import { Code2 } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { CodeEditor } from "./CodeEditor";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardContent } from "./ui/Card";
import type { TranslationViewProps } from "../interfaces/translation-view";

export const TranslationView: React.FC<TranslationViewProps> = ({
  fromLang,
  toLang,
  explanationLang,
  inputCode,
  isTranslating,
  error,
  onFromLangChange,
  onToLangChange,
  onExplanationLangChange,
  onInputCodeChange,
  onTranslate,
}) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary-600" />
          Translate Code
        </h2>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <LanguageSelector
          fromLang={fromLang}
          toLang={toLang}
          explanationLang={explanationLang}
          onFromLangChange={onFromLangChange}
          onToLangChange={onToLangChange}
          onExplanationLangChange={onExplanationLangChange}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Input Code ({fromLang})
          </label>
          <CodeEditor
            value={inputCode}
            onChange={onInputCodeChange}
            language={fromLang}
            height="400px"
          />
        </div>
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <Button
          onClick={onTranslate}
          isLoading={isTranslating}
          disabled={!inputCode.trim() || isTranslating}
          size="lg"
          className="w-full"
        >
          {isTranslating ? "Translating..." : "Translate Code"}
        </Button>
      </CardContent>
    </Card>
  );
};
