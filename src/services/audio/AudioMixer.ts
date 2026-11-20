/**
 * Centralized Web Audio Mixer (`AudioManager` core graph)
 * - Enforces ONE shared AudioContext across the entire React app.
 * - Explicit 6-channel bus architecture:
 *     MASTER -> ctx.destination
 *     NARRATION -> speechAnalyser -> MASTER
 *     CHARACTER_VOICE -> speechAnalyser -> MASTER
 *     BACKGROUND_MUSIC -> MASTER (ducked smoothly via exponential setTargetAtTime)
 *     SOUND_EFFECTS -> MASTER
 *     ENVIRONMENTAL_AMBIENCE -> MASTER (ducked smoothly during speech)
 * - Zero harsh brickwall compression (gentle transparent soft-knee dynamicsLimiter only).
 * - Exposes real-time AnalyserNode mouth state & energy telemetry for 3D character lip-sync.
 */

export type AudioChannelId =
  | 'master'
  | 'narration'
  | 'character'
  | 'music'
  | 'sfx'
  | 'ambience';

export type MouthState = 'closed' | 'slightly_open' | 'wide_open' | 'rounded' | 'smile';

export interface LipSyncTelemetry {
  active: boolean;
  source: 'audio_analyser' | 'idle';
  openness: number; // 0..1 normalized vocal amplitude
  mouthState: MouthState;
  roundedWeight: number;
  lowEnergy: number;
  midEnergy: number;
}

export interface ChannelVolumes {
  master: number;
  narration: number;
  character: number;
  music: number;
  sfx: number;
  ambience: number;
  muted: boolean;
}

export class AudioMixer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private safetyLimiter: DynamicsCompressorNode | null = null;
  private narrationGain: GainNode | null = null;
  private characterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private speechAnalyser: AnalyserNode | null = null;

  private isDucked = false;
  private volumes: ChannelVolumes = {
    master: 1.0,
    narration: 0.95,
    character: 0.95,
    music: 0.25,
    sfx: 0.75,
    ambience: 0.2,
    muted: false,
  };

  // Pre-allocated typed buffers for zero-GC per-frame 3D lip-sync inspection
  private timeData = new Uint8Array(256);
  private freqData = new Uint8Array(128);
  private speechOutputActive = false;

  getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.buildGraph(this.ctx);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private buildGraph(ctx: AudioContext) {
    // Gentle transparent safety ceiling (-2 dBFS) — high threshold & soft ratio to avoid metallic sound
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-3.0, ctx.currentTime);
    limiter.knee.setValueAtTime(12.0, ctx.currentTime);
    limiter.ratio.setValueAtTime(2.2, ctx.currentTime);
    limiter.attack.setValueAtTime(0.012, ctx.currentTime);
    limiter.release.setValueAtTime(0.18, ctx.currentTime);

    const master = ctx.createGain();
    const narration = ctx.createGain();
    const character = ctx.createGain();
    const music = ctx.createGain();
    const sfx = ctx.createGain();
    const ambience = ctx.createGain();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.62;
    this.timeData = new Uint8Array(analyser.fftSize);
    this.freqData = new Uint8Array(analyser.frequencyBinCount);

    narration.connect(analyser);
    character.connect(analyser);
    analyser.connect(master);

    music.connect(master);
    sfx.connect(master);
    ambience.connect(master);

    master.connect(limiter);
    limiter.connect(ctx.destination);

    this.safetyLimiter = limiter;
    this.masterGain = master;
    this.narrationGain = narration;
    this.characterGain = character;
    this.musicGain = music;
    this.sfxGain = sfx;
    this.ambienceGain = ambience;
    this.speechAnalyser = analyser;

    this.applyAllGains(0.02);
  }

  getChannelNode(channel: Exclude<AudioChannelId, 'master'>): GainNode | null {
    this.getContext();
    switch (channel) {
      case 'narration':
        return this.narrationGain;
      case 'character':
        return this.characterGain;
      case 'music':
        return this.musicGain;
      case 'sfx':
        return this.sfxGain;
      case 'ambience':
        return this.ambienceGain;
    }
  }

  setVolumes(patch: Partial<ChannelVolumes>) {
    this.volumes = { ...this.volumes, ...patch };
    this.applyAllGains(0.06);
  }

  getVolumes(): ChannelVolumes {
    return { ...this.volumes };
  }

  setDucked(ducked: boolean) {
    if (this.isDucked === ducked) return;
    this.isDucked = ducked;
    this.applyMusicAndAmbienceGains(ducked ? 0.08 : 0.24);
  }

  setSpeechOutputActive(active: boolean) {
    this.speechOutputActive = active;
  }

  private applyAllGains(timeConstantSec: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const effectiveMaster = this.volumes.muted ? 0 : this.volumes.master;
    this.masterGain.gain.setTargetAtTime(effectiveMaster, now, timeConstantSec);
    this.narrationGain?.gain.setTargetAtTime(this.volumes.narration, now, timeConstantSec);
    this.characterGain?.gain.setTargetAtTime(this.volumes.character, now, timeConstantSec);
    this.sfxGain?.gain.setTargetAtTime(this.volumes.sfx, now, timeConstantSec);
    this.applyMusicAndAmbienceGains(timeConstantSec);
  }

  private applyMusicAndAmbienceGains(timeConstantSec: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const musicDuckFactor = this.isDucked ? 0.16 : 1.0;
    const ambienceDuckFactor = this.isDucked ? 0.25 : 1.0;
    this.musicGain?.gain.setTargetAtTime(
      Math.max(0, this.volumes.music * musicDuckFactor),
      now,
      timeConstantSec,
    );
    this.ambienceGain?.gain.setTargetAtTime(
      Math.max(0, this.volumes.ambience * ambienceDuckFactor),
      now,
      timeConstantSec,
    );
  }

  suspendForBackgroundTab() {
    if (this.ctx && this.ctx.state === 'running') {
      void this.ctx.suspend().catch(() => {});
    }
  }

  resumeIfNeeded() {
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Zero-GC audio-reactive telemetry read by 3D companions/avatars inside Three.js RAF loop.
   * Explicitly returns `mouthState: 'closed'` and `openness: 0` whenever audio is not actively playing.
   */
  getSpeechTelemetry(): LipSyncTelemetry {
    if (!this.speechOutputActive || !this.speechAnalyser || !this.ctx || this.ctx.state !== 'running') {
      return {
        active: false,
        source: 'idle',
        openness: 0,
        mouthState: 'closed',
        roundedWeight: 0,
        lowEnergy: 0,
        midEnergy: 0,
      };
    }

    this.speechAnalyser.getByteTimeDomainData(this.timeData);
    this.speechAnalyser.getByteFrequencyData(this.freqData);

    let sumSq = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      const centered = (this.timeData[i] - 128) / 128;
      sumSq += centered * centered;
    }
    const rms = Math.sqrt(sumSq / this.timeData.length);
    const openness = Math.min(1, Math.max(0, (rms - 0.012) * 5.2));

    // Coarse spectral energy balance for rounded ('O'/'U') vs wide open ('A'/'E') mouth shapes
    let lowSum = 0;
    let midSum = 0;
    for (let i = 1; i < 6; i++) lowSum += this.freqData[i];
    for (let i = 6; i < 24; i++) midSum += this.freqData[i];
    const lowEnergy = lowSum / (5 * 255);
    const midEnergy = midSum / (18 * 255);
    const roundedWeight =
      lowEnergy > 0.08 && lowEnergy > midEnergy * 1.18 ? Math.min(1, (lowEnergy - midEnergy * 0.9) * 3) : 0;

    let mouthState: MouthState = 'closed';
    if (openness > 0.56) {
      mouthState = roundedWeight > 0.45 ? 'rounded' : 'wide_open';
    } else if (openness > 0.16) {
      mouthState = roundedWeight > 0.5 ? 'rounded' : 'slightly_open';
    } else if (openness > 0.04) {
      mouthState = 'slightly_open';
    }

    return {
      active: true,
      source: 'audio_analyser',
      openness,
      mouthState,
      roundedWeight,
      lowEnergy,
      midEnergy,
    };
  }
}
