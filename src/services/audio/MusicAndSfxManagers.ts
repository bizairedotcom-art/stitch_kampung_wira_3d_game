import type { AudioMixer } from './AudioMixer';

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
  { id: 'track-village', title: 'Sinar Pagi Kampung Wira', zone: 'Kampung Utama', tempoBpm: 96, instrument: 'Gamelan Lembut & Gambus', notesHz: [293.66, 329.63, 392.0, 440.0, 523.25, 587.33], waveform: 'sine' },
  { id: 'track-math', title: 'Roda Jam Menara Nombor', zone: 'Matematik', tempoBpm: 104, instrument: 'Bonang Kristal', notesHz: [329.63, 392.0, 440.0, 493.88, 587.33, 659.25], waveform: 'triangle' },
  { id: 'track-science', title: 'Titisan Embun Makmal Alam', zone: 'Sains', tempoBpm: 92, instrument: 'Sape & Marimba', notesHz: [261.63, 311.13, 349.23, 392.0, 466.16, 523.25], waveform: 'sine' },
  { id: 'track-bm', title: 'Hikayat Pustaka Rimba', zone: 'Bahasa Melayu', tempoBpm: 88, instrument: 'Gambus & Seruling Buluh', notesHz: [246.94, 293.66, 329.63, 392.0, 440.0, 493.88], waveform: 'triangle' },
  { id: 'track-english', title: 'Ombak Riang Adventure Bay', zone: 'Bahasa Inggeris', tempoBpm: 108, instrument: 'Ukulele Tropika', notesHz: [261.63, 329.63, 392.0, 440.0, 523.25, 659.25], waveform: 'triangle' },
  { id: 'track-islam', title: 'Kedamaian Taman Harmoni', zone: 'Pendidikan Islam (Pilihan Bebas Muzik)', tempoBpm: 72, instrument: 'Mod Tanpa Muzik Disyorkan', notesHz: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0], waveform: 'sine' },
  { id: 'track-moral', title: 'Wakaf Kasih & Budi', zone: 'Pendidikan Moral', tempoBpm: 82, instrument: 'Kecapi & Angklung', notesHz: [261.63, 293.66, 349.23, 392.0, 440.0, 523.25], waveform: 'sine' },
  { id: 'track-art', title: 'Warna Canting Pelangi', zone: 'Pendidikan Seni Visual', tempoBpm: 90, instrument: 'Kulintangan', notesHz: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33], waveform: 'triangle' },
  { id: 'track-music', title: 'Rentak Inang Nusantara', zone: 'Pendidikan Muzik', tempoBpm: 112, instrument: 'Kompang & Gamelan', notesHz: [261.63, 293.66, 329.63, 392.0, 523.25, 659.25], waveform: 'triangle' },
  { id: 'track-pjpk', title: 'Semangat Arena Wira', zone: 'PJPK', tempoBpm: 118, instrument: 'Gendang Cergas', notesHz: [293.66, 392.0, 440.0, 523.25, 587.33, 659.25], waveform: 'triangle' },
  { id: 'track-arab', title: 'Pelita Bahasa Arab', zone: 'Bahasa Arab', tempoBpm: 82, instrument: 'Qanun Lembut', notesHz: [246.94, 293.66, 349.23, 392.0, 440.0, 493.88], waveform: 'sine' },
  { id: 'track-cina-tamil', title: 'Harmoni Pelbagai Budaya', zone: 'Bahasa Cina & Tamil SK', tempoBpm: 92, instrument: 'Guzheng & Veena Pentatonik', notesHz: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], waveform: 'triangle' },
  { id: 'track-borneo-orang-asli', title: 'Gema Sape & Buluh Rimba', zone: 'Bahasa Iban, Kadazandusun & Semai', tempoBpm: 86, instrument: 'Sape Sarawak & Sompoton', notesHz: [220.0, 261.63, 329.63, 392.0, 440.0, 523.25], waveform: 'sine' },
  { id: 'track-victory', title: 'Paluan Kompang Kejayaan', zone: 'Kemenangan & Perasmian', tempoBpm: 114, instrument: 'Kompang Diraja', notesHz: [392.0, 493.88, 587.33, 659.25, 783.99], waveform: 'triangle' },
];

export type SfxType = 'click' | 'success' | 'coin' | 'nudge' | 'kompang' | 'build' | 'water' | 'note';

export class MusicManager {
  private timerId: number | null = null;
  private ambienceTimerId: number | null = null;
  private stepIdx = 0;
  private currentTrackId = 'track-village';
  private playing = false;
  private ambiencePlaying = false;
  private religiousMusicFree = false;

  constructor(private mixer: AudioMixer) {}

  setTrack(trackId: string) {
    if (this.currentTrackId === trackId && this.playing) return;
    this.currentTrackId = trackId;
    if (this.playing) {
      this.stop();
      this.start(trackId);
    }
  }

  setReligiousMusicFreeMode(enabled: boolean) {
    this.religiousMusicFree = enabled;
    if (enabled && this.playing) {
      this.stop();
    }
  }

  isReligiousMusicFreeMode(): boolean {
    return this.religiousMusicFree;
  }

  start(trackId?: string) {
    if (trackId) this.currentTrackId = trackId;
    if (this.religiousMusicFree) return;
    const vols = this.mixer.getVolumes();
    if (vols.muted || vols.music <= 0.01 || typeof window === 'undefined') return;
    if (this.playing) return;

    const ctx = this.mixer.getContext();
    const musicBus = this.mixer.getChannelNode('music');
    if (!ctx || !musicBus) return;

    const track = SOUNDTRACK_CATALOG.find((t) => t.id === this.currentTrackId) || SOUNDTRACK_CATALOG[1];
    const intervalMs = Math.round((60 / track.tempoBpm) * 500);
    this.playing = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1450, ctx.currentTime);
    filter.connect(musicBus);

    const pattern = [0, 2, 3, 4, 2, 5, 3, 1];
    this.timerId = window.setInterval(() => {
      const curVols = this.mixer.getVolumes();
      if (this.religiousMusicFree || curVols.muted || curVols.music <= 0.01) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const note = track.notesHz[pattern[this.stepIdx % pattern.length] % track.notesHz.length];
      osc.type = track.waveform;
      osc.frequency.setValueAtTime(note, now);
      noteGain.gain.setValueAtTime(0.0005, now);
      noteGain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(now);
      osc.stop(now + 0.46);
      this.stepIdx += 1;
    }, intervalMs);
  }

  startAmbience() {
    if (this.ambiencePlaying || typeof window === 'undefined') return;
    const vols = this.mixer.getVolumes();
    if (vols.muted || vols.ambience <= 0.01) return;
    const ctx = this.mixer.getContext();
    const bus = this.mixer.getChannelNode('ambience');
    if (!ctx || !bus) return;
    this.ambiencePlaying = true;

    // Gentle tropical kampung breeze & soft water shimmer pulse every ~2.8s
    this.ambienceTimerId = window.setInterval(() => {
      const v = this.mixer.getVolumes();
      if (v.muted || v.ambience <= 0.01) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 1.2);
      gain.gain.setValueAtTime(0.0002, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain);
      gain.connect(bus);
      osc.start(now);
      osc.stop(now + 1.65);
    }, 2800);
  }

  stopAmbience() {
    if (this.ambienceTimerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.ambienceTimerId);
      this.ambienceTimerId = null;
    }
    this.ambiencePlaying = false;
  }

  stop() {
    if (this.timerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.playing = false;
  }

  toggle(): boolean {
    if (this.playing) {
      this.stop();
      return false;
    }
    this.start(this.currentTrackId);
    return this.playing;
  }

  isPlaying(): boolean {
    return this.playing;
  }
}

export class SoundEffectManager {
  constructor(private mixer: AudioMixer) {}

  playTone(freqHz: number, durationSec = 0.26, waveform: OscillatorType = 'triangle') {
    const vols = this.mixer.getVolumes();
    if (vols.muted || vols.sfx <= 0.01) return;
    const ctx = this.mixer.getContext();
    const sfxBus = this.mixer.getChannelNode('sfx');
    if (!ctx || !sfxBus) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freqHz, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  play(type: SfxType) {
    const vols = this.mixer.getVolumes();
    if (vols.muted || vols.sfx <= 0.01) return;
    const ctx = this.mixer.getContext();
    const sfxBus = this.mixer.getChannelNode('sfx');
    if (!ctx || !sfxBus) return;
    const now = ctx.currentTime;

    const playStep = (freq: number, delay: number, dur: number, wave: OscillatorType = 'triangle') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.22, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.02);
    };

    switch (type) {
      case 'click':
        playStep(520, 0, 0.06, 'triangle');
        break;
      case 'coin':
        playStep(784, 0, 0.09, 'sine');
        playStep(1046.5, 0.08, 0.16, 'sine');
        break;
      case 'success':
        playStep(523.25, 0, 0.13, 'triangle');
        playStep(659.25, 0.08, 0.13, 'triangle');
        playStep(783.99, 0.16, 0.22, 'triangle');
        playStep(1046.5, 0.26, 0.28, 'sine');
        break;
      case 'kompang':
        playStep(140, 0, 0.12, 'sine');
        playStep(180, 0.14, 0.12, 'sine');
        playStep(150, 0.28, 0.14, 'sine');
        playStep(523.25, 0.4, 0.2, 'triangle');
        playStep(659.25, 0.52, 0.28, 'triangle');
        break;
      case 'build':
        playStep(220, 0, 0.09, 'triangle');
        playStep(330, 0.11, 0.11, 'triangle');
        playStep(440, 0.22, 0.2, 'triangle');
        break;
      case 'water':
        playStep(440, 0, 0.14, 'sine');
        playStep(587.33, 0.06, 0.17, 'sine');
        break;
      case 'nudge':
        playStep(330, 0, 0.14, 'sine');
        playStep(293.66, 0.12, 0.18, 'sine');
        break;
      case 'note':
        playStep(440, 0, 0.22, 'triangle');
        break;
    }
  }
}
