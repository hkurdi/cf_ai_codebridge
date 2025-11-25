import type {
  Env,
  ConversationState,
  Message,
  ApiResponse,
  TranslateRequestBody,
  MessageRequestBody,
} from "./types";

export class ConversationDO {
  private state: DurableObjectState;
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (request.method === "POST" && path === "/translate") {
        return await this.handleTranslation(request);
      }

      if (request.method === "POST" && path === "/message") {
        return await this.handleMessage(request);
      }

      if (request.method === "GET" && path === "/history") {
        return await this.getHistory();
      }

      if (request.method === "DELETE" && path === "/reset") {
        return await this.reset();
      }

      return this.jsonResponse({ success: false, error: "Not found" }, 404);
    } catch (error) {
      console.error("Error in ConversationDO:", error);
      return this.jsonResponse(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  }

  private async handleTranslation(request: Request): Promise<Response> {
    const body = (await request.json()) as TranslateRequestBody;
    const { code, fromLang, toLang, explanationLanguage = "en" } = body;

    if (!code || !fromLang || !toLang) {
      return this.jsonResponse(
        {
          success: false,
          error: "Missing required fields: code, fromLang, toLang",
        },
        400
      );
    }

    const conversationState = await this.getOrCreateState();
    conversationState.currentCode = code;
    conversationState.languages = { from: fromLang, to: toLang };
    conversationState.explanationLanguage = explanationLanguage;

    const systemPrompt = this.buildTranslationSystemPrompt(
      fromLang,
      toLang,
      explanationLanguage
    );
    const userPrompt = `Translate this ${fromLang} code to ${toLang}:\n\n${code}`;

    conversationState.messages.push({
      role: "user",
      content: userPrompt,
      timestamp: Date.now(),
    });

    const aiResponse = await this.callLLM(
      systemPrompt,
      conversationState.messages
    );

    conversationState.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    });

    conversationState.translations.push({
      original: code,
      translated: this.extractCode(aiResponse),
      explanation: aiResponse,
      fromLang,
      toLang,
      timestamp: Date.now(),
    });

    await this.state.storage.put("conversation", conversationState);

    const audioBase64 = await this.generateSpeech(
      aiResponse,
      explanationLanguage,
      toLang
    );

    return this.jsonResponse({
      success: true,
      response: aiResponse,
      audio: audioBase64,
      conversationId: this.state.id.toString(),
    });
  }

  private async handleMessage(request: Request): Promise<Response> {
    const body = (await request.json()) as MessageRequestBody;
    const { message } = body;

    if (!message) {
      return this.jsonResponse(
        {
          success: false,
          error: "Missing message field",
        },
        400
      );
    }

    const conversationState = await this.getOrCreateState();
    const explanationLanguage = conversationState.explanationLanguage || "en";

    const systemPrompt = this.buildFollowUpSystemPrompt(conversationState);

    conversationState.messages.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    const aiResponse = await this.callLLM(
      systemPrompt,
      conversationState.messages
    );

    conversationState.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    });

    await this.state.storage.put("conversation", conversationState);

    const audioBase64 = await this.generateSpeech(
      aiResponse,
      explanationLanguage,
      conversationState.languages.to
    );

    return this.jsonResponse({
      success: true,
      response: aiResponse,
      audio: audioBase64,
      conversationId: this.state.id.toString(),
    });
  }

  private async getHistory(): Promise<Response> {
    const conversationState = await this.getOrCreateState();
    return this.jsonResponse({
      success: true,
      response: JSON.stringify(conversationState, null, 2),
    });
  }

  private async reset(): Promise<Response> {
    await this.state.storage.delete("conversation");
    return this.jsonResponse({
      success: true,
      response: "Conversation reset successfully",
    });
  }

  private async getOrCreateState(): Promise<ConversationState> {
    let state = await this.state.storage.get<ConversationState>("conversation");

    if (!state) {
      state = {
        messages: [],
        currentCode: null,
        languages: { from: "python", to: "javascript" },
        translations: [],
        explanationLanguage: "en",
      };
    }

    return state;
  }

  private buildTranslationSystemPrompt(
    fromLang: string,
    toLang: string,
    explanationLang: string
  ): string {
    const isArabic = explanationLang === "ar";

    if (isArabic) {
      return `أنت CodeBridge، خبير في ترجمة وشرح الأكواد البرمجية.

دورك:
1. ترجمة الكود من ${fromLang} إلى ${toLang}
2. شرح الاختلافات المعمارية بين اللغتين
3. الإجابة على الأسئلة المتعلقة بالكود
4. تقديم شروحات واضحة ومفصلة

عند الترجمة:
- حافظ على الوظائف الأساسية
- استخدم الأنماط المعيارية للغة المستهدفة
- اشرح الاختلافات الرئيسية في الطريقة
- اجعل أسماء المتغيرات واضحة

صيغة الإجابة:
\`\`\`${toLang}
[الكود المترجم]
\`\`\`

[اكتب شرحك بشكل طبيعي بدون تنسيق ماركداون]`;
    }

    return `You are CodeBridge, an expert code translator and technical explainer.

Your role:
1. Translate code from ${fromLang} to ${toLang}
2. Explain architectural differences between languages
3. Answer follow-up questions about the code
4. Provide clear, detailed explanations

When translating:
- Maintain core functionality
- Use idiomatic patterns for the target language
- Explain key differences in approach
- Keep variable names meaningful

Response format:
\`\`\`${toLang}
[translated code]
\`\`\`

[Write your explanation naturally without markdown formatting or bold text. Write as if speaking aloud.]`;
  }

  private buildFollowUpSystemPrompt(state: ConversationState): string {
    const isArabic = state.explanationLanguage === "ar";
    const context = state.currentCode
      ? `\n\nالكود الحالي:\n${state.currentCode}`
      : "";

    if (isArabic) {
      return `أنت CodeBridge، خبير في شرح الأكواد البرمجية.

السياق: كنت تساعد في ترجمة كود من ${state.languages.from} إلى ${state.languages.to}.${context}

أجب على أسئلة المستخدم بناءً على السياق السابق للمحادثة والكود المترجم. اكتب بشكل طبيعي بدون تنسيق ماركداون.`;
    }

    const englishContext = state.currentCode
      ? `\n\nCurrent code:\n${state.currentCode}`
      : "";

    return `You are CodeBridge, an expert code explainer.

Context: You've been helping translate code from ${state.languages.from} to ${state.languages.to}.${englishContext}

Answer the user's questions based on the previous conversation context and translated code. Write naturally without markdown formatting. Write as if speaking aloud.`;
  }

  private async callLLM(
    systemPrompt: string,
    messages: Message[]
  ): Promise<string> {
    const recentMessages = messages.slice(-6);

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await this.env.AI.run(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      {
        messages: formattedMessages,
        max_tokens: 2048,
        temperature: 0.7,
      }
    );

    return response.response || "No response from AI";
  }

  private async generateSpeech(
    text: string,
    language: "en" | "ar",
    codeLang: string
  ): Promise<string | null> {
    try {
      const voiceId =
        language === "ar"
          ? this.env.ELEVENLABS_VOICE_ID_ARABIC
          : this.env.ELEVENLABS_VOICE_ID_ENGLISH;

      const cleanText = this.cleanForTTS(text, codeLang);

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "xi-api-key": this.env.ELEVENLABS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error("ElevenLabs API error:", await response.text());
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);

      let binaryString = "";
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }

      const base64Audio = btoa(binaryString);

      return base64Audio;
    } catch (error) {
      console.error("Error generating speech:", error);
      return null;
    }
  }

  private codeToSpeech(code: string, language: string): string {
    let spoken = code;

    spoken = spoken.replace(/::/g, " double colon ");
    spoken = spoken.replace(/<</g, " left shift ");
    spoken = spoken.replace(/>>/g, " right shift ");
    spoken = spoken.replace(/\./g, " dot ");
    spoken = spoken.replace(/->/g, " arrow ");
    spoken = spoken.replace(/==/g, " equals equals ");
    spoken = spoken.replace(/!=/g, " not equals ");
    spoken = spoken.replace(/<=/g, " less than or equal ");
    spoken = spoken.replace(/>=/g, " greater than or equal ");
    spoken = spoken.replace(/&&/g, " and ");
    spoken = spoken.replace(/\|\|/g, " or ");
    spoken = spoken.replace(/\+\+/g, " plus plus ");
    spoken = spoken.replace(/--/g, " minus minus ");
    spoken = spoken.replace(/\+=/g, " plus equals ");
    spoken = spoken.replace(/-=/g, " minus equals ");
    spoken = spoken.replace(/\((?=[^\s])/g, " open parenthesis ");
    spoken = spoken.replace(/(?<=[^\s])\)/g, " close parenthesis ");
    spoken = spoken.replace(/\{/g, " open brace ");
    spoken = spoken.replace(/\}/g, " close brace ");
    spoken = spoken.replace(/\[/g, " open bracket ");
    spoken = spoken.replace(/\]/g, " close bracket ");
    spoken = spoken.replace(/;/g, " semicolon ");
    spoken = spoken.replace(/:/g, " colon ");
    spoken = spoken.replace(/,/g, " comma ");
    spoken = spoken.replace(/"/g, " quote ");
    spoken = spoken.replace(/'/g, " single quote ");
    spoken = spoken.replace(/</g, " less than ");
    spoken = spoken.replace(/>/g, " greater than ");
    spoken = spoken.replace(/=/g, " equals ");
    spoken = spoken.replace(/\+/g, " plus ");
    spoken = spoken.replace(/-/g, " minus ");
    spoken = spoken.replace(/\*/g, " times ");
    spoken = spoken.replace(/\//g, " divided by ");
    spoken = spoken.replace(/%/g, " modulo ");
    spoken = spoken.replace(/&/g, " ampersand ");
    spoken = spoken.replace(/\|/g, " pipe ");
    spoken = spoken.replace(/!/g, " exclamation ");
    spoken = spoken.replace(/#/g, " hash ");

    spoken = spoken.replace(/std/g, "standard");
    spoken = spoken.replace(/endl/g, "end line");
    spoken = spoken.replace(/cout/g, "c out");
    spoken = spoken.replace(/cin/g, "c in");
    spoken = spoken.replace(/printf/g, "print f");
    spoken = spoken.replace(/scanf/g, "scan f");

    spoken = spoken.replace(/\s+/g, " ");
    spoken = spoken.trim();

    return `The translated code is: ${spoken}.`;
  }

  private cleanForTTS(text: string, codeLang: string): string {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
    let cleanedText = text;
    const codeBlocks: string[] = [];

    cleanedText = cleanedText.replace(codeBlockRegex, (match, code) => {
      const spokenCode = this.codeToSpeech(code.trim(), codeLang);
      codeBlocks.push(spokenCode);
      return "[CODE_BLOCK]";
    });

    cleanedText = cleanedText.replace(/\*\*Explanation:\*\*/gi, "");
    cleanedText = cleanedText.replace(/\*\*([^\*]+)\*\*/g, "$1");
    cleanedText = cleanedText.replace(/\*([^\*]+)\*/g, "$1");
    cleanedText = cleanedText.replace(/^[\s-]*-\s*/gm, "");
    cleanedText = cleanedText.replace(/^\s*\d+\.\s*/gm, "");
    cleanedText = cleanedText.replace(/`([^`]+)`/g, "$1");

    codeBlocks.forEach((spokenCode) => {
      cleanedText = cleanedText.replace("[CODE_BLOCK]", spokenCode);
    });

    cleanedText = cleanedText.replace(/\n{3,}/g, "\n\n");
    cleanedText = cleanedText.trim();

    return cleanedText;
  }

  private extractCode(text: string): string {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1].trim() : text;
  }

  private jsonResponse(data: ApiResponse, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}
