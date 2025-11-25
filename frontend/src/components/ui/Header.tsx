import React from 'react';
import { Code2, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import type { HeaderProps } from '../../interfaces/header';

export const Header: React.FC<HeaderProps> = ({ showReset, onReset }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                CodeBridge
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                AI-Powered Code Translation with Voice Explanations
              </p>
            </div>
          </div>
          {showReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Translation
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};