import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioEngine } from '@/services/audioEngine';
import type { GraphicsPreset, SettingsState } from '@/types/game';

interface SettingsStore extends SettingsState {
  setLanguage: (lang: 'ms' | 'en') => void;
  setGraphicsPreset: (preset: GraphicsPreset) => void;
  setFallback2DMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setAudioVolumes: (
    patch: Partial<
      Pick<
        SettingsState,
        'musicVolume' | 'sfxVolume' | 'voiceVolume' | 'voiceRate' | 'preferredVoiceUri' | 'muted'
      >
    >,
  ) => void;
  setAutoSpeak: (enabled: boolean) => void;
  setHighContrastText: (enabled: boolean) => void;
  setSubtitleEnabled: (enabled: boolean) => void;
}

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      language: 'ms',
      graphicsPreset: 'medium',
      fallback2DMode: false,
      reducedMotion: Boolean(prefersReduced),
      musicVolume: 0.25,
      sfxVolume: 0.75,
      voiceVolume: 0.95,
      voiceRate: 0.95,
      preferredVoiceUri: 'auto',
      autoSpeak: false,
      muted: false,
      highContrastText: false,
      subtitleEnabled: true,

      setLanguage: (language) => set({ language }),
      setGraphicsPreset: (graphicsPreset) => set({ graphicsPreset }),
      setFallback2DMode: (fallback2DMode) => set({ fallback2DMode }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setAudioVolumes: (patch) => {
        set(patch);
        const s = { ...get(), ...patch };
        audioEngine.configureVolumes({
          musicVolume: s.musicVolume,
          sfxVolume: s.sfxVolume,
          voiceVolume: s.voiceVolume,
          voiceRate: s.voiceRate,
          preferredVoiceUri: s.preferredVoiceUri,
          muted: s.muted,
        });
      },
      setAutoSpeak: (autoSpeak) => set({ autoSpeak }),
      setHighContrastText: (highContrastText) => set({ highContrastText }),
      setSubtitleEnabled: (subtitleEnabled) => set({ subtitleEnabled }),
    }),
    { name: 'kampung-wira-settings' },
  ),
);
