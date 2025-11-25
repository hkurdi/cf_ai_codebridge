import type { MessagePart } from "../interfaces/message-parser";

export const parseMessage = (content: string): MessagePart[] => {
  const parts: MessagePart[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index).trim(),
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex).trim(),
    });
  }

  return parts;
};