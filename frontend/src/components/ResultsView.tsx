import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { CodeEditor } from "./CodeEditor";
import { ChatInterface } from "./ChatInterface";
import { AudioPlayer } from "./AudioPlayer";
import { Card, CardHeader, CardContent } from "./ui/Card";
import type { ResultsViewProps } from "../interfaces/results-view";

export const ResultsView: React.FC<ResultsViewProps> = ({
  toLang,
  outputCode,
  explanation,
  audio,
  messages,
  isChatLoading,
  onSendMessage,
}) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              Translated Code ({toLang})
            </h2>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={outputCode}
              onChange={() => {}}
              language={toLang}
              height="300px"
              readOnly
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              Explanation
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div className="text-slate-700 leading-relaxed space-y-3">
                {explanation.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="text-sm sm:text-base">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            {audio && (
              <div className="pt-2 border-t border-slate-200">
                <AudioPlayer audioBase64={audio} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="lg:sticky lg:top-6 h-[600px] lg:h-[calc(100vh-8rem)] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Ask Follow-up Questions
          </h2>
        </CardHeader>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isLoading={isChatLoading}
          />
        </div>
      </Card>
    </div>
  );
};
