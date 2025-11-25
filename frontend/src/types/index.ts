export interface TranslationRequest {
    code: string;
    fromLang: string;
    toLang: string;
    explanationLanguage: 'en' | 'ar';
  }
  
  export interface MessageRequest {
    message: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    response: string;
    audio?: string | null;
    conversationId?: string;
  }
  
  export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    audio?: string | null;
    timestamp: Date;
  }
  
  export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'rust' | 'ruby' | 'php';
  export type ExplanationLanguage = 'en' | 'ar';