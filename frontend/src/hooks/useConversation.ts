import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import type { Message, MessageRequest } from '../types';

export const useConversation = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, audio?: string | null) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      audio: audio || null,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    addMessage('user', content);

    try {
      const request: MessageRequest = { message: content };
      const response = await api.sendMessage(sessionId, request);
      
      addMessage('assistant', response.response, response.audio);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    addMessage,
    clearMessages,
    isLoading,
    error,
  };
};