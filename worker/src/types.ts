export interface Env {
  AI: any;
  CONVERSATIONS: DurableObjectNamespace;
  ELEVENLABS_KEY: string;
  ELEVENLABS_VOICE_ID_ENGLISH: string;
  ELEVENLABS_VOICE_ID_ARABIC: string;
  ENVIRONMENT: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Translation {
  original: string;
  translated: string;
  explanation: string;
  fromLang: string;
  toLang: string;
  timestamp: number;
}

export interface ConversationState {
  messages: Message[];
  currentCode: string | null;
  languages: {
    from: string;
    to: string;
  };
  translations: Translation[];
  explanationLanguage: "en" | "ar";
}

export interface TranslateRequestBody {
  code: string;
  fromLang: string;
  toLang: string;
  explanationLanguage?: "en" | "ar";
}

export interface MessageRequestBody {
  message: string;
  explanationLanguage?: "en" | "ar";
}

export interface ApiResponse {
  success: boolean;
  response?: string;
  audio?: string | null;
  conversationId?: string;
  error?: string;
}
