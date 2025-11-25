export interface AudioContextType {
    currentAudio: HTMLAudioElement | null;
    playAudio: (audio: HTMLAudioElement) => void;
    pauseAll: () => void;
  }