import React, { useEffect, useState } from 'react';
import { audioEngine, type SpeakOptions, type SpeechSnapshot } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

export function useSpeechState(): SpeechSnapshot {
  const [snap, setSnap] = useState<SpeechSnapshot>(() => audioEngine.getSpeechState());
  useEffect(() => audioEngine.subscribeSpeechState(setSnap), []);
  return snap;
}

interface SpeakButtonProps {
  text: string;
  label?: string;
  stopLabel?: string;
  options?: SpeakOptions;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  label = 'Dengar Suara',
  stopLabel = 'Henti Suara',
  options,
  className = 'btn-toy btn-toy-emerald px-4 min-h-10 rounded-xl text-xs font-bold flex items-center gap-1',
}) => {
  const companionId = useGameStore((s) => s.bundle?.learner.companionId);
  const speech = useSpeechState();

  const handleClick = () => {
    if (speech.isSpeaking) {
      audioEngine.stopSpeech();
      return;
    }
    audioEngine.speak(text, { companionId, ...options });
  };

  return (
    <button type="button" onClick={handleClick} className={className} aria-pressed={speech.isSpeaking}>
      <span className="material-symbols-outlined text-base">
        {speech.isSpeaking ? 'stop_circle' : 'volume_up'}
      </span>
      <span>{speech.isSpeaking ? stopLabel : label}</span>
    </button>
  );
};
