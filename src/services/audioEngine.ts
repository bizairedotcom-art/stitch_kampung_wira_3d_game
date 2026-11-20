import type { CompanionId } from '@/types/user';

export interface TrackDefinition {
  id: string;
  title: string;
  zone: string;
  tempoBpm: number;
  instrument: string;
  notesHz: number[];
  waveform: OscillatorType;
}

export const SOUNDTRACK_CATALOG: TrackDefinition[] = [
  { id: 'track-gate', title: 'Pintu Gerbang Harmoni', zone: 'Log Masuk', tempoBpm: 92, instrument: 'Angklung & Seruling', notesHz: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], waveform: 'triangle' },
  { id: 'track-village', title: 'Sinar Pagi Kampung Wira', zone: 'Kampung Utama', tempoBpm: 98, instrument: 'Gamelan Lembut & Gambus', notesHz: [293.66, 329.63, 392.0, 440.0, 523.25, 587.33], waveform: 'sine' },
  { id: 'track-math', title: 'Roda Jam Menara Nombor', zone: 'Matematik', tempoBpm: 108, instrument: 'Bonang Kristal', notesHz: [329.63, 392.0, 440.0, 493.88, 587.33, 659.25], waveform: 'triangle' },
  { id: 'track-science', title: 'Titisan Embun Makmal Alam', zone: 'Sains', tempoBpm: 96, instrument: 'Sape & Marimba', notesHz: [261.63, 311.13, 349.23, 392.0, 466.16, 523.25], waveform: 'sine' },
  { id: 'track-bm', title: 'Hikayat Pustaka Rimba', zone: 'Bahasa Melayu', tempoBpm: 90, instrument: 'Gambus & Seruling Buluh', notesHz: [246.94, 293.66, 329.63, 392.0, 440.0, 493.88], waveform: 'triangle' },
  { id: 'track-english', title: 'Ombak Riang Adventure Bay', zone: 'Bahasa Inggeris', tempoBpm: 112, instrument: 'Ukulele Tropika', notesHz: [261.63, 329.63, 392.0, 440.0, 523.25, 659.25], waveform: 'triangle' },
  { id: 'track-islam', title: 'Kedamaian Taman Harmoni', zone: 'Pendidikan Islam', tempoBpm: 76, instrument: 'Oud Lembut & Rebana', notesHz: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0], waveform: 'sine' },
  { id: 'track-moral', title: 'Wakaf Kasih & Budi', zone: 'Pendidikan Moral', tempoBpm: 84, instrument: 'Kecapi & Angklung', notesHz: [261.63, 293.66, 349.23, 392.0, 440.0, 523.25], waveform: 'sine' },
  { id: 'track-art', title: 'Warna Canting Pelangi', zone: 'Pendidikan Seni Visual', tempoBpm: 94, instrument: 'Kulintangan', notesHz: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33], waveform: 'triangle' },
  { id: 'track-music', title: 'Rentak Inang Nusantara', zone: 'Pendidikan Muzik', tempoBpm: 116, instrument: 'Kompang & Gamelan', notesHz: [261.63, 293.66, 329.63, 392.0, 523.25, 659.25], waveform: 'triangle' },
  { id: 'track-pjpk', title: 'Semangat Arena Wira', zone: 'PJPK', tempoBpm: 124, instrument: 'Gendang Cergas', notesHz: [293.66, 392.0, 440.0, 523.25, 587.33, 659.25], waveform: 'square' },
  { id: 'track-arab', title: 'Pelita Bahasa Arab', zone: 'Bahasa Arab', tempoBpm: 86, instrument: 'Qanun Lembut', notesHz: [246.94, 293.66, 349.23, 392.0, 440.0, 493.88], waveform: 'sine' },
  { id: 'track-cina-tamil', title: 'Harmoni Pelbagai Budaya', zone: 'Bahasa Cina & Tamil SK', tempoBpm: 95, instrument: 'Guzheng & Veena Pentatonik', notesHz: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], waveform: 'triangle' },
  { id: 'track-borneo-orang-asli', title: 'Gema Sape & Buluh Rimba', zone: 'Bahasa Iban, Kadazandusun & Semai', tempoBpm: 88, instrument: 'Sape Sarawak & Sompoton', notesHz: [220.0, 261.63, 329.63, 392.0, 440.0, 523.25], waveform: 'sine' },
  { id: 'track-victory', title: 'Paluan Kompang Kejayaan', zone: 'Kemenangan & Perasmian', tempoBpm: 120, instrument: 'Kompang Diraja', notesHz: [392.0, 493.88, 587.33, 659.25, 783.99], waveform: 'triangle' },
];

export type SpeechLang = 'ms-MY' | 'en-GB' | 'ar-SA' | 'zh-CN' | 'ta-IN';

export interface SpeakOptions {
  lang?: SpeechLang;
  subjectId?: string;
  companionId?: CompanionId;
  rate?: number;
  pitch?: number;
  chime?: boolean;
}

export interface VoiceOptionInfo {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
}

export interface SpeechSnapshot {
  isSpeaking: boolean;
  activeText: string;
  activeLang: SpeechLang;
  usingNeuralVoice: boolean;
}

type SfxType = 'click' | 'success' | 'coin' | 'nudge' | 'kompang' | 'build' | 'water' | 'note';

const COMPANION_VOICE_TUNING: Record<CompanionId, { rateBias: number; pitch: number }> = {
  rimau: { rateBias: 0, pitch: 1.02 },
  kancil: { rateBias: 0.05, pitch: 1.12 },
  enggang: { rateBias: 0, pitch: 1.06 },
  utan: { rateBias: -0.05, pitch: 0.98 },
  badak: { rateBias: -0.04, pitch: 0.94 },
};

const SUBJECT_TO_LANG: Record<string, SpeechLang> = {
  'bahasa-inggeris': 'en-GB',
  'bahasa-arab': 'ar-SA',
  'bahasa-cina-sk': 'zh-CN',
  'bahasa-tamil-sk': 'ta-IN',
};

export function resolveSpeechLang(text: string, langOrOptions?: SpeechLang | SpeakOptions): SpeechLang {
  if (typeof langOrOptions === 'string') return langOrOptions;
  if (langOrOptions?.lang) return langOrOptions.lang;

  // Detect explicit non-Latin scripts first so mixed Jawi / Arabic / Hanzi / Tamil snippets read natively
  if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';

  if (langOrOptions?.subjectId && SUBJECT_TO_LANG[langOrOptions.subjectId]) {
    return SUBJECT_TO_LANG[langOrOptions.subjectId];
  }
  return 'ms-MY';
}

export function normalizeSpeechText(rawText: string, lang: SpeechLang = 'ms-MY'): string {
  // Strip pictographic emojis and UI glyphs so TTS doesn't read symbol names aloud
  let cleaned = rawText
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, ' ')
    .replace(/[•▪◦●★☆✓✔✕✖➔➜→←]/g, ', ')
    .replace(/[*_`~#|]/g, ' ');

  if (lang === 'ms-MY') {
    cleaned = cleaned
      .replace(/\bRM\s*(\d+(?:\.\d{1,2})?)\b/gi, '$1 ringgit')
      .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (_m, a: string, b: string) => {
        if (a === '1' && b === '2') return 'satu per dua';
        if (a === '1' && b === '4') return 'satu per empat';
        if (a === '3' && b === '4') return 'tiga per empat';
        return `${a} per ${b}`;
      })
      .replace(/\s*\+\s*/g, ' tambah ')
      .replace(/\s*[−–-]\s*(?=\d)/g, ' tolak ')
      .replace(/\s*[×x]\s*(?=\d)/gi, ' darab ')
      .replace(/\s*÷\s*/g, ' bahagi ')
      .replace(/\s*=\s*/g, ' sama dengan ')
      .replace(/\bKSSR\b/g, 'K S S R')
      .replace(/\bSK\b/g, 'S K');
  } else if (lang === 'en-GB') {
    cleaned = cleaned
      .replace(/\s*\+\s*/g, ' plus ')
      .replace(/\s*[−–-]\s*(?=\d)/g, ' minus ')
      .replace(/\s*[×]\s*/g, ' times ')
      .replace(/\s*÷\s*/g, ' divided by ')
      .replace(/\s*=\s*/g, ' equals ');
  }

  return cleaned.replace(/\s+/g, ' ').replace(/,\s*,+/g, ',').trim();
}

export function splitIntoSpeechChunks(text: string, maxChars = 145): string[] {
  const normalized = text.trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const sentences = normalized
    .split(/(?<=[.!?؟。।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxChars) {
      chunks.push(sentence);
      continue;
    }
    const subParts = sentence
      .split(/(?<=[,;:])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    let buf = '';
    for (const part of subParts) {
      if (!buf) {
        buf = part;
      } else if (`${buf} ${part}`.length <= maxChars) {
        buf = `${buf} ${part}`;
      } else {
        chunks.push(buf);
        buf = part;
      }
    }
    if (buf) chunks.push(buf);
  }
  return chunks.length ? chunks : [normalized];
}

function scoreBrowserVoice(voice: SpeechSynthesisVoice, targetLang: SpeechLang, preferredUri: string): number {
  if (preferredUri && preferredUri !== 'auto' && voice.voiceURI === preferredUri) {
    return 10_000;
  }
  const vLang = voice.lang.toLowerCase().replace('_', '-');
  const tLang = targetLang.toLowerCase();
  const baseLang = tLang.split('-')[0];
  const vName = voice.name.toLowerCase();

  let score = 0;
  if (vLang === tLang) score += 500;
  else if (vLang.startsWith(`${baseLang}-`) || vLang === baseLang) score += 350;
  else if (baseLang === 'ms' && vLang.startsWith('id')) score += 260; // Indonesian shares Malay phonetics cleanly when ms-MY voice is missing
  else if (baseLang === 'en' && vLang.startsWith('en')) score += 320;
  else return -1;

  if (vName.includes('google') || vName.includes('natural') || vName.includes('neural') || vName.includes('enhanced')) {
    score += 120;
  }
  if (vName.includes('yasmin') || vName.includes('osman') || vName.includes('siti') || vName.includes('amira')) {
    score += 90;
  }
  if (!voice.localService) score += 35;
  if (vName.includes('espeak')) score -= 180;
  return score;
}

class KampungAudioEngine {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private stepIdx = 0;
  private currentTrackId = 'track-village';
  private isPlayingMusic = false;
  private isDucked = false;
  private musicVol = 0.25;
  private sfxVol = 0.75;
  private voiceVol = 0.95;
  private voiceRate = 0.95;
  private preferredVoiceUri = 'auto';
  private muted = false;

  private speechGeneration = 0;
  private keepAliveTimer: number | null = null;
  private activeAudioEl: HTMLAudioElement | null = null;
  private ttsProbeState: 'unknown' | 'available' | 'unavailable' = 'unknown';
  private ttsAudioCache = new Map<string, string>();
  private availableVoices: SpeechSynthesisVoice[] = [];
  private speechState: SpeechSnapshot = {
    isSpeaking: false,
    activeText: '',
    activeLang: 'ms-MY',
    usingNeuralVoice: false,
  };
  private speechListeners = new Set<(snap: SpeechSnapshot) => void>();

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopMusic();
          this.stopSpeech();
        }
      });
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const refreshVoices = () => {
        try {
          this.availableVoices = window.speechSynthesis.getVoices() || [];
        } catch {
          this.availableVoices = [];
        }
      };
      refreshVoices();
      if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
      } else {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }
    }
  }

  private emitSpeechState(patch: Partial<SpeechSnapshot>) {
    this.speechState = { ...this.speechState, ...patch };
    for (const listener of this.speechListeners) {
      listener(this.speechState);
    }
  }

  subscribeSpeechState(listener: (snap: SpeechSnapshot) => void): () => void {
    this.speechListeners.add(listener);
    listener(this.speechState);
    return () => {
      this.speechListeners.delete(listener);
    };
  }

  getSpeechState(): SpeechSnapshot {
    return this.speechState;
  }

  listAvailableVoices(): VoiceOptionInfo[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list.length) this.availableVoices = list;
      } catch {
        // Ignore
      }
    }
    return this.availableVoices
      .filter((v) => /^(ms|id|en|ar|zh|ta)\b/i.test(v.lang))
      .map((v) => ({
        voiceURI: v.voiceURI,
        name: v.name,
        lang: v.lang,
        localService: v.localService,
      }));
  }

  private selectBestVoice(lang: SpeechLang): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    if (!this.availableVoices.length) {
      try {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
      } catch {
        return null;
      }
    }
    let best: SpeechSynthesisVoice | null = null;
    let bestScore = -1;
    for (const voice of this.availableVoices) {
      const score = scoreBrowserVoice(voice, lang, this.preferredVoiceUri);
      if (score > bestScore) {
        bestScore = score;
        best = voice;
      }
    }
    return best;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  configureVolumes(opts: {
    musicVolume: number;
    sfxVolume: number;
    voiceVolume: number;
    voiceRate?: number;
    preferredVoiceUri?: string;
    muted: boolean;
  }) {
    this.musicVol = opts.musicVolume;
    this.sfxVol = opts.sfxVolume;
    this.voiceVol = opts.voiceVolume;
    if (typeof opts.voiceRate === 'number' && Number.isFinite(opts.voiceRate)) {
      this.voiceRate = Math.min(1.3, Math.max(0.7, opts.voiceRate));
    }
    if (typeof opts.preferredVoiceUri === 'string') {
      this.preferredVoiceUri = opts.preferredVoiceUri;
    }
    this.muted = opts.muted;
    if (this.activeAudioEl) {
      this.activeAudioEl.volume = this.muted ? 0 : Math.min(1, this.voiceVol);
      this.activeAudioEl.playbackRate = this.voiceRate;
    }
    if (this.muted) {
      this.stopMusic();
      this.stopSpeech();
    }
  }

  setTrack(trackId: string) {
    if (this.currentTrackId === trackId && this.isPlayingMusic) return;
    this.currentTrackId = trackId;
    if (this.isPlayingMusic) {
      this.stopMusic();
      this.startMusic(trackId);
    }
  }

  startMusic(trackId?: string) {
    if (trackId) this.currentTrackId = trackId;
    if (this.muted || this.musicVol <= 0.01 || typeof window === 'undefined') return;
    if (this.isPlayingMusic) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const track = SOUNDTRACK_CATALOG.find((t) => t.id === this.currentTrackId) || SOUNDTRACK_CATALOG[1];
    const intervalMs = Math.round((60 / track.tempoBpm) * 500);
    this.isPlayingMusic = true;

    const pattern = [0, 2, 3, 4, 2, 5, 3, 1];
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || this.muted || this.musicVol <= 0.01) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const note = track.notesHz[pattern[this.stepIdx % pattern.length] % track.notesHz.length];
      osc.type = track.waveform;
      osc.frequency.setValueAtTime(note, now);
      const effectiveVol = Math.max(0.004, this.musicVol * (this.isDucked ? 0.12 : 0.35));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(effectiveVol * 0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
      this.stepIdx += 1;
    }, intervalMs);
  }

  stopMusic() {
    if (this.musicTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.isPlayingMusic = false;
  }

  toggleMusic(): boolean {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    }
    this.startMusic(this.currentTrackId);
    return true;
  }

  getIsPlayingMusic(): boolean {
    return this.isPlayingMusic;
  }

  playTone(freqHz: number, durationSec = 0.28, waveform: OscillatorType = 'triangle') {
    if (this.muted || this.sfxVol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freqHz, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVol * 0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  private playVoiceCue() {
    if (this.muted || this.voiceVol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 783.99];
    notes.forEach((hz, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, now + idx * 0.06);
      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(Math.min(0.08, this.voiceVol * 0.06), now + idx * 0.06 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.16);
    });
  }

  playSfx(type: SfxType) {
    if (this.muted || this.sfxVol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const playStep = (freq: number, delay: number, dur: number, wave: OscillatorType = 'triangle') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.exponentialRampToValueAtTime(this.sfxVol * 0.2, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.02);
    };

    switch (type) {
      case 'click':
        playStep(520, 0, 0.07, 'triangle');
        break;
      case 'coin':
        playStep(784, 0, 0.1, 'sine');
        playStep(1046.5, 0.08, 0.18, 'sine');
        break;
      case 'success':
        playStep(523.25, 0, 0.14, 'triangle');
        playStep(659.25, 0.09, 0.14, 'triangle');
        playStep(783.99, 0.18, 0.24, 'triangle');
        playStep(1046.5, 0.28, 0.3, 'sine');
        break;
      case 'kompang':
        playStep(140, 0, 0.12, 'sine');
        playStep(180, 0.14, 0.12, 'sine');
        playStep(150, 0.28, 0.14, 'sine');
        playStep(523.25, 0.4, 0.22, 'triangle');
        playStep(659.25, 0.52, 0.3, 'triangle');
        break;
      case 'build':
        playStep(220, 0, 0.09, 'square');
        playStep(330, 0.12, 0.11, 'triangle');
        playStep(440, 0.24, 0.2, 'triangle');
        break;
      case 'water':
        playStep(440, 0, 0.15, 'sine');
        playStep(587.33, 0.06, 0.18, 'sine');
        break;
      case 'nudge':
        playStep(280, 0, 0.15, 'sine');
        playStep(240, 0.12, 0.18, 'sine');
        break;
      case 'note':
        playStep(440, 0, 0.22, 'triangle');
        break;
    }
  }

  private clearKeepAlive() {
    if (this.keepAliveTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private async tryPlayNeuralTts(
    text: string,
    lang: SpeechLang,
    companionId: CompanionId | undefined,
    generation: number,
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.onLine) return false;
    if (this.ttsProbeState === 'unavailable') return false;

    const cacheKey = `${companionId || 'rimau'}|${lang}|${text}`;
    let dataUrl = this.ttsAudioCache.get(cacheKey);

    if (!dataUrl) {
      try {
        const res = await fetch('/api/v1/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ text, lang, companionId }),
        });
        if (!res.ok) return false;
        const data = (await res.json()) as {
          available?: boolean;
          mimeType?: string;
          audioBase64?: string;
        };
        if (!data.available || !data.audioBase64) {
          this.ttsProbeState = 'unavailable';
          return false;
        }
        this.ttsProbeState = 'available';
        dataUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        if (this.ttsAudioCache.size >= 64) {
          const oldest = this.ttsAudioCache.keys().next().value;
          if (oldest) this.ttsAudioCache.delete(oldest);
        }
        this.ttsAudioCache.set(cacheKey, dataUrl);
      } catch {
        return false;
      }
    }

    if (generation !== this.speechGeneration) return true;

    return new Promise<boolean>((resolve) => {
      try {
        const audio = new Audio(dataUrl);
        this.activeAudioEl = audio;
        audio.volume = Math.min(1, this.voiceVol);
        audio.playbackRate = this.voiceRate;
        this.emitSpeechState({
          isSpeaking: true,
          activeText: text,
          activeLang: lang,
          usingNeuralVoice: true,
        });
        audio.onended = () => {
          if (generation === this.speechGeneration) {
            this.activeAudioEl = null;
            this.isDucked = false;
            this.emitSpeechState({ isSpeaking: false, usingNeuralVoice: false });
          }
          resolve(true);
        };
        audio.onerror = () => {
          if (this.activeAudioEl === audio) this.activeAudioEl = null;
          resolve(false);
        };
        void audio.play().catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  speak(rawText: string, langOrOptions?: SpeechLang | SpeakOptions) {
    if (this.muted || this.voiceVol <= 0.01) return;
    const options: SpeakOptions =
      typeof langOrOptions === 'string' ? { lang: langOrOptions } : langOrOptions || {};
    const lang = resolveSpeechLang(rawText, langOrOptions);
    const spokenText = normalizeSpeechText(rawText, lang);
    if (!spokenText) return;

    this.stopSpeech();
    const generation = ++this.speechGeneration;
    this.isDucked = true;

    if (options.chime !== false && spokenText.length > 18) {
      this.playVoiceCue();
    }

    const run = async () => {
      if (this.ttsProbeState !== 'unavailable' && spokenText.length <= 420) {
        const playedNeural = await this.tryPlayNeuralTts(
          spokenText,
          lang,
          options.companionId,
          generation,
        );
        if (playedNeural) return;
      }

      if (generation !== this.speechGeneration) return;
      this.speakWithBrowserSynthesis(spokenText, lang, options, generation);
    };

    void run();
  }

  private speakWithBrowserSynthesis(
    spokenText: string,
    lang: SpeechLang,
    options: SpeakOptions,
    generation: number,
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isDucked = false;
      this.emitSpeechState({ isSpeaking: false });
      this.playSfx('click');
      return;
    }

    const chunks = splitIntoSpeechChunks(spokenText);
    if (!chunks.length) {
      this.isDucked = false;
      return;
    }

    const companionTuning = options.companionId
      ? COMPANION_VOICE_TUNING[options.companionId]
      : COMPANION_VOICE_TUNING.rimau;
    const rate = Math.min(
      1.3,
      Math.max(0.7, (options.rate ?? this.voiceRate) + companionTuning.rateBias),
    );
    const pitch = options.pitch ?? companionTuning.pitch;
    const selectedVoice = this.selectBestVoice(lang);

    this.emitSpeechState({
      isSpeaking: true,
      activeText: spokenText,
      activeLang: lang,
      usingNeuralVoice: false,
    });

    // Keep Chrome speechSynthesis engine active across multi-chunk playback
    this.clearKeepAlive();
    this.keepAliveTimer = window.setInterval(() => {
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch {
        // Ignore browser-specific keepalive restrictions
      }
    }, 9000);

    const speakChunk = (chunkIdx: number) => {
      if (generation !== this.speechGeneration) return;
      if (chunkIdx >= chunks.length) {
        this.clearKeepAlive();
        this.isDucked = false;
        this.emitSpeechState({ isSpeaking: false, usingNeuralVoice: false });
        return;
      }
      try {
        const utter = new SpeechSynthesisUtterance(chunks[chunkIdx]);
        utter.lang = selectedVoice?.lang || lang;
        if (selectedVoice) utter.voice = selectedVoice;
        utter.rate = rate;
        utter.pitch = pitch;
        utter.volume = Math.min(1, this.voiceVol);
        utter.onend = () => {
          if (generation !== this.speechGeneration) return;
          speakChunk(chunkIdx + 1);
        };
        utter.onerror = () => {
          if (generation !== this.speechGeneration) return;
          this.clearKeepAlive();
          this.isDucked = false;
          this.emitSpeechState({ isSpeaking: false, usingNeuralVoice: false });
        };
        window.speechSynthesis.speak(utter);
      } catch {
        this.clearKeepAlive();
        this.isDucked = false;
        this.emitSpeechState({ isSpeaking: false, usingNeuralVoice: false });
      }
    };

    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancel failures
    }
    speakChunk(0);
  }

  stopSpeech() {
    this.speechGeneration += 1;
    this.clearKeepAlive();
    this.isDucked = false;
    if (this.activeAudioEl) {
      try {
        this.activeAudioEl.pause();
        this.activeAudioEl.currentTime = 0;
      } catch {
        // Ignore
      }
      this.activeAudioEl = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    if (this.speechState.isSpeaking) {
      this.emitSpeechState({ isSpeaking: false, usingNeuralVoice: false });
    }
  }
}

export const audioEngine = new KampungAudioEngine();
