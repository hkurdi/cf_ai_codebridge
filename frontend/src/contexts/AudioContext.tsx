import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import type { AudioContextType } from '../interfaces/audio-context';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [_, forceUpdate] = useState({});

  const pauseAll = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      forceUpdate({});
    }
  }, []);

  const playAudio = useCallback((audio: HTMLAudioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause();
    }
    
    currentAudioRef.current = audio;
    audio.play();
    forceUpdate({});

    audio.addEventListener('ended', () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
        forceUpdate({});
      }
    });
  }, []);

  return (
    <AudioContext.Provider value={{ currentAudio: currentAudioRef.current, playAudio, pauseAll }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
};