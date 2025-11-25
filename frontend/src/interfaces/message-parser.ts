export interface MessagePart {
    type: 'text' | 'code';
    content: string;
    language?: string;
  }