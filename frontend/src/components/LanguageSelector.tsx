import React from 'react';
import type { LanguageSelectorProps } from '../interfaces/language-selector';
import { PROGRAMMING_LANGUAGES } from '../constants/prog-languages';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  fromLang,
  toLang,
  explanationLang,
  onFromLangChange,
  onToLangChange,
  onExplanationLangChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
          From Language
        </label>
        <select
          value={fromLang}
          onChange={(e) => onFromLangChange(e.target.value as any)}
          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
          To Language
        </label>
        <select
          value={toLang}
          onChange={(e) => onToLangChange(e.target.value as any)}
          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
          Explanation Language
        </label>
        <select
          value={explanationLang}
          onChange={(e) => onExplanationLangChange(e.target.value as any)}
          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="en">English 🇺🇸</option>
          <option value="ar">Arabic 🇸🇦</option>
        </select>
      </div>
    </div>
  );
};