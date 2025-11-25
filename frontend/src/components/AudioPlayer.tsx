import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { audioUtils } from '../utils/api';
import { useAudioContext } from '../contexts/AudioContext';
import type { AudioPlayerProps } from '../interfaces/audio-player';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBase64, autoPlay = false }) => {
  const { playAudio } = useAudioContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Clean up previous audio
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    // Create new audio
    const audioUrl = audioUtils.createAudioUrl(audioBase64);
    audioUrlRef.current = audioUrl;
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Auto play if requested
    if (autoPlay) {
      playAudio(audio);
    }

    // Cleanup
    return () => {
      audio.pause();
      audio.remove();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [audioBase64, autoPlay, playAudio]);

  const handleTogglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      playAudio(audioRef.current);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gradient-to-r from-primary-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-primary-200">
      <button
        onClick={handleTogglePlayPause}
        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />}
      </button>

      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-primary-600" />
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Voice Explanation
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-1.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};