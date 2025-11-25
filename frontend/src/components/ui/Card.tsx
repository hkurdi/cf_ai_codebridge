import React from 'react';
import type { CardProps, CardHeaderProps, CardContentProps } from '../../interfaces/card';

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 sm:px-6 sm:py-4 ${className}`}>
      {children}
    </div>
  );
};