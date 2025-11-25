import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import type { TranslationRequest, ApiResponse } from '../types';

export const useTranslation = (sessionId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const translate = useCallback(async (request: TranslationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.translate(sessionId, request);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    translate,
    reset,
    isLoading,
    error,
    result,
  };
};