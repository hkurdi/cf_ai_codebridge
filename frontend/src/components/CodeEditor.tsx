import React from 'react';
import Editor from '@monaco-editor/react';
import type { CodeEditorProps } from '../interfaces/code-editor';
import { LANGUAGE_MAP } from '../constants/prog-languages';

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = '// Enter your code here...',
  readOnly = false,
  height = '300px',
}) => {
  const displayValue = value || '';
  
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm">
      <Editor
        height={height}
        language={LANGUAGE_MAP[language]}
        value={displayValue}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          placeholder: value ? undefined : placeholder, 
        }}
      />
    </div>
  );
};