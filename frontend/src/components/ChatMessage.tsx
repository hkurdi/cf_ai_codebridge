import React from 'react';
import { User, Bot } from 'lucide-react';
import type { ChatMessageProps } from '../interfaces/chat-message';
import { AudioPlayer } from './AudioPlayer';
import { CodeBlock } from './CodeBlock';
import { parseMessage } from '../utils/message-parser';

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const messageParts = parseMessage(message.content);

  return (
    <div className={`flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div
        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-600' : 'bg-slate-700'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block max-w-full sm:max-w-[85%] ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {messageParts.map((part, idx) => (
            <React.Fragment key={idx}>
              {part.type === 'text' ? (
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm sm:text-base ${
                    isUser
                      ? 'bg-primary-600 text-white rounded-tr-sm inline-block'
                      : 'bg-slate-100 text-slate-900 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{part.content}</p>
                </div>
              ) : (
                <CodeBlock code={part.content} language={part.language || 'text'} />
              )}
            </React.Fragment>
          ))}
        </div>

        {message.audio && (
          <div className="mt-2 sm:mt-3 inline-block w-full max-w-full sm:max-w-md">
            <AudioPlayer audioBase64={message.audio} />
          </div>
        )}

        <div className="mt-1 text-xs text-slate-500">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};