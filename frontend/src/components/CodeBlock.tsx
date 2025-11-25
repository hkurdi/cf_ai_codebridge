import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (error) {
        console.error('Prism highlighting failed:', error);
      }
    }
  }, [code, language]);

  const normalizedLanguage = language.toLowerCase();

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-slate-300 bg-slate-900">
      <div className="bg-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono border-b border-slate-700">
        {language}
      </div>
      <pre className="!my-0 !rounded-none !bg-slate-900">
        <code ref={codeRef} className={`language-${normalizedLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};