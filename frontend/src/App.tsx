import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { TranslationView } from './components/TranslationView';
import { ResultsView } from './components/ResultsView';
import { useCodeBridge } from './hooks/useCodeBridge';

function App() {
  const {
    fromLang,
    toLang,
    explanationLang,
    setFromLang,
    setToLang,
    setExplanationLang,
    inputCode,
    outputCode,
    explanation,
    audio,
    setInputCode,
    isTranslating,
    isChatLoading,
    translationError,
    messages,
    handleTranslate,
    handleReset,
    handleChatMessage,
  } = useCodeBridge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header showReset={!!outputCode} onReset={handleReset} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!outputCode ? (
          <TranslationView
            fromLang={fromLang}
            toLang={toLang}
            explanationLang={explanationLang}
            inputCode={inputCode}
            isTranslating={isTranslating}
            error={translationError}
            onFromLangChange={setFromLang}
            onToLangChange={setToLang}
            onExplanationLangChange={setExplanationLang}
            onInputCodeChange={setInputCode}
            onTranslate={handleTranslate}
          />
        ) : (
          <ResultsView
            toLang={toLang}
            outputCode={outputCode}
            explanation={explanation}
            audio={audio}
            messages={messages}
            isChatLoading={isChatLoading}
            onSendMessage={handleChatMessage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;