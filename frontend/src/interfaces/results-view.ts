import type { ProgrammingLanguage, Message } from '../types';

export interface ResultsViewProps {
  toLang: ProgrammingLanguage;
  outputCode: string;
  explanation: string;
  audio: string | null;
  messages: Message[];
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
}