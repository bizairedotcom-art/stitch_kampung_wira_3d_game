import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  AUDIO_CONFIG_VERSION,
  AUDITION_TEST_PHRASES,
  buildSpeechDirectionPrompt,
  CANDIDATE_GEMINI_VOICES,
  CHARACTER_VOICE_BIBLE,
  INDIGENOUS_SUBJECT_IDS,
  normalizeDialogueText,
  resolvePronunciationMode,
  VOICE_DIRECTION_VERSION,
  type AudioContentCategory,
  type CharacterVoiceId,
  type DeliveryProfileId,
  type PronunciationMode,
  type SpeechLang,
} from '../src/shared/voiceBible.ts';

export interface WavInspectionResult {
  valid: boolean;
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  byteRate: number;
  dataBytes: number;
  durationSec: number;
  peak: number;
  rms: number;
  strippedTrailingChunks: string[];
  cleanWavBuffer: Buffer;
}

export interface TtsGenerationRequest {
  text: string;
  lang?: SpeechLang;
  subjectId?: string;
  characterId?: CharacterVoiceId;
  deliveryProfile?: DeliveryProfileId;
  pronunciationMode?: PronunciationMode;
  audioCategory?: AudioContentCategory;
  voiceOverride?: string;
  modelOverride?: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
  allowDynamicAi?: boolean;
  skipStaticManifest?: boolean;
}

export interface TtsGenerationResult {
  available: boolean;
  provider: 'pregenerated_manifest' | 'gemini_tts_cache' | 'gemini_tts_live' | 'google_cloud_tts' | 'fallback_text_only';
  modelId: string;
  voiceId: string;
  characterId: CharacterVoiceId;
  deliveryProfile: DeliveryProfileId;
  lang: SpeechLang;
  cacheKey: string;
  cached: boolean;
  mimeType: string;
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  durationSec: number;
  peak: number;
  rms: number;
  usedSpeechMetadata: boolean;
  audioBase64?: string;
  audioUrl?: string;
  normalizedText: string;
  notice?: string;
}

export interface VoiceAuditionEvaluation {
  phraseId: string;
  voiceId: string;
  modelId: string;
  characterId?: CharacterVoiceId;
  ratings: {
    naturalness: number;
    malaysianAccent: number;
    warmth: number;
    clarity: number;
  };
  notes?: string;
  approvedForCharacter?: CharacterVoiceId | null;
  updatedAt: string;
}

export interface AudioQuotaStats {
  date: string;
  liveRequestsToday: number;
  dailyLimit: number;
  cacheHitsToday: number;
  deduplicatedHitsToday: number;
  estimatedCharactersProcessed: number;
  cloudTtsConfigured: boolean;
  geminiConfigured: boolean;
  storageDriver: 'local_filesystem' | 's3_r2_configured' | 'supabase_storage';
}

interface ManifestAssetEntry {
  audioId: string;
  characterId: CharacterVoiceId;
  language: string;
  locale: SpeechLang;
  transcript: string;
  voiceId: string;
  voiceProvider: string;
  modelId: string;
  deliveryProfile: DeliveryProfileId;
  filePath: string;
  durationSec: number;
  sampleRate: number;
  audioFormat: string;
  fileSize: number;
  contentHash: string;
  generationStatus: string;
  verificationStatus: string;
}

export function inspectAndNormalizeWav(rawBuffer: Buffer): WavInspectionResult {
  if (
    rawBuffer.length < 44 ||
    rawBuffer.toString('ascii', 0, 4) !== 'RIFF' ||
    rawBuffer.toString('ascii', 8, 12) !== 'WAVE'
  ) {
    return {
      valid: false,
      sampleRate: 24000,
      channels: 1,
      bitsPerSample: 16,
      byteRate: 48000,
      dataBytes: 0,
      durationSec: 0,
      peak: 0,
      rms: 0,
      strippedTrailingChunks: [],
      cleanWavBuffer: rawBuffer,
    };
  }

  let sampleRate = 24000;
  let channels = 1;
  let bitsPerSample = 16;
  let audioFormat = 1;
  let dataStart = -1;
  let dataSize = 0;
  const strippedTrailingChunks: string[] = [];

  let offset = 12;
  while (offset + 8 <= rawBuffer.length) {
    const id = rawBuffer.toString('ascii', offset, offset + 4);
    const size = rawBuffer.readUInt32LE(offset + 4);
    const payloadOffset = offset + 8;

    if (id === 'fmt ' && payloadOffset + 16 <= rawBuffer.length) {
      audioFormat = rawBuffer.readUInt16LE(payloadOffset);
      channels = rawBuffer.readUInt16LE(payloadOffset + 2);
      sampleRate = rawBuffer.readUInt32LE(payloadOffset + 4);
      bitsPerSample = rawBuffer.readUInt16LE(payloadOffset + 14);
    } else if (id === 'data') {
      dataStart = payloadOffset;
      dataSize = Math.min(size, Math.max(0, rawBuffer.length - payloadOffset));
    } else {
      strippedTrailingChunks.push(id.trim() || 'UNK');
    }

    offset = payloadOffset + size + (size % 2);
  }

  if (dataStart < 0 || dataSize <= 0 || audioFormat !== 1 || bitsPerSample !== 16) {
    return {
      valid: false,
      sampleRate,
      channels,
      bitsPerSample,
      byteRate: sampleRate * channels * (bitsPerSample / 8),
      dataBytes: dataSize,
      durationSec: 0,
      peak: 0,
      rms: 0,
      strippedTrailingChunks,
      cleanWavBuffer: rawBuffer,
    };
  }

  const pcmData = Buffer.from(rawBuffer.subarray(dataStart, dataStart + dataSize));
  const totalSamples = Math.floor(pcmData.length / 2);

  let rawPeak = 0;
  let sumSq = 0;
  for (let i = 0; i + 1 < pcmData.length; i += 2) {
    const sample = pcmData.readInt16LE(i) / 32768;
    const abs = Math.abs(sample);
    if (abs > rawPeak) rawPeak = abs;
    sumSq += sample * sample;
  }
  const rawRms = Math.sqrt(sumSq / Math.max(1, totalSamples));

  // Gentle headroom peak protection (-1.5 dBFS = 0.84) to prevent clipping without metallic compression
  const TARGET_PEAK = 0.84;
  let gain = 1.0;
  if (rawPeak > 0.88) {
    gain = TARGET_PEAK / rawPeak;
  } else if (rawPeak > 0.05 && rawRms < 0.06) {
    gain = Math.min(1.6, TARGET_PEAK / rawPeak);
  }

  if (Math.abs(gain - 1.0) > 0.02) {
    for (let i = 0; i + 1 < pcmData.length; i += 2) {
      const scaled = Math.round(pcmData.readInt16LE(i) * gain);
      const clamped = Math.max(-32767, Math.min(32767, scaled));
      pcmData.writeInt16LE(clamped, i);
    }
  }

  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(pcmData.length, 40);

  const cleanWavBuffer = Buffer.concat([header, pcmData]);
  const finalPeak = Math.min(TARGET_PEAK, rawPeak * gain);
  const finalRms = rawRms * gain;

  return {
    valid: true,
    sampleRate,
    channels,
    bitsPerSample,
    byteRate,
    dataBytes: pcmData.length,
    durationSec: Number((pcmData.length / Math.max(1, byteRate)).toFixed(3)),
    peak: Number(finalPeak.toFixed(4)),
    rms: Number(finalRms.toFixed(4)),
    strippedTrailingChunks,
    cleanWavBuffer,
  };
}

export function computeAudioCacheKey(input: {
  normalizedText: string;
  lang: SpeechLang;
  voiceId: string;
  provider: string;
  modelId: string;
  deliveryProfile: DeliveryProfileId;
  pronunciationMode: PronunciationMode;
}): string {
  const payload = [
    input.normalizedText,
    input.lang,
    input.voiceId,
    input.provider,
    input.modelId,
    input.deliveryProfile,
    input.pronunciationMode,
    AUDIO_CONFIG_VERSION,
    VOICE_DIRECTION_VERSION,
  ].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export class AudioEngineBackendService {
  private cacheDir: string;
  private publicAudioDir: string;
  private manifestPath: string;
  private approvalsPath: string;
  private memoryWavCache = new Map<string, { wav: Buffer; meta: Omit<TtsGenerationResult, 'audioBase64'> }>();
  private inFlight = new Map<string, Promise<TtsGenerationResult>>();
  private manifestEntries: ManifestAssetEntry[] = [];
  private manifestLoaded = false;
  private rateWindowTimestamps: number[] = [];
  private quotaDate = new Date().toISOString().slice(0, 10);
  private liveRequestsToday = 0;
  private cacheHitsToday = 0;
  private deduplicatedHitsToday = 0;
  private estimatedCharactersProcessed = 0;
  private dailyLimit = Math.max(20, Number(process.env.AUDIO_DAILY_QUOTA || 500));

  constructor(rootDir = process.cwd()) {
    this.cacheDir = path.join(rootDir, '.data', 'audio-cache');
    this.publicAudioDir = path.join(rootDir, 'public', 'audio');
    this.manifestPath = path.join(rootDir, 'AUDIO_MANIFEST.json');
    this.approvalsPath = path.join(rootDir, '.data', 'voice-approvals.json');
  }

  private resetDailyQuotaIfNeeded() {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== this.quotaDate) {
      this.quotaDate = today;
      this.liveRequestsToday = 0;
      this.cacheHitsToday = 0;
      this.deduplicatedHitsToday = 0;
      this.estimatedCharactersProcessed = 0;
    }
  }

  async reloadManifest(): Promise<ManifestAssetEntry[]> {
    try {
      const raw = await fs.readFile(this.manifestPath, 'utf8');
      const parsed = JSON.parse(raw) as { assets?: ManifestAssetEntry[] };
      this.manifestEntries = Array.isArray(parsed.assets) ? parsed.assets : [];
      this.manifestLoaded = true;
    } catch {
      this.manifestEntries = [];
      this.manifestLoaded = true;
    }
    return this.manifestEntries;
  }

  async getApprovals(): Promise<{
    characterVoices: Record<CharacterVoiceId, string>;
    evaluations: VoiceAuditionEvaluation[];
  }> {
    const defaults: Record<CharacterVoiceId, string> = {
      rimau: CHARACTER_VOICE_BIBLE.rimau.defaultGeminiVoice,
      kancil: CHARACTER_VOICE_BIBLE.kancil.defaultGeminiVoice,
      enggang: CHARACTER_VOICE_BIBLE.enggang.defaultGeminiVoice,
      utan: CHARACTER_VOICE_BIBLE.utan.defaultGeminiVoice,
      badak: CHARACTER_VOICE_BIBLE.badak.defaultGeminiVoice,
      narrator: CHARACTER_VOICE_BIBLE.narrator.defaultGeminiVoice,
    };
    try {
      const raw = await fs.readFile(this.approvalsPath, 'utf8');
      const parsed = JSON.parse(raw) as {
        characterVoices?: Partial<Record<CharacterVoiceId, string>>;
        evaluations?: VoiceAuditionEvaluation[];
      };
      return {
        characterVoices: { ...defaults, ...(parsed.characterVoices || {}) },
        evaluations: Array.isArray(parsed.evaluations) ? parsed.evaluations : [],
      };
    } catch {
      return { characterVoices: defaults, evaluations: [] };
    }
  }

  async saveApprovalEvaluation(entry: VoiceAuditionEvaluation) {
    await fs.mkdir(path.dirname(this.approvalsPath), { recursive: true });
    const current = await this.getApprovals();
    const filtered = current.evaluations.filter(
      (e) => !(e.phraseId === entry.phraseId && e.voiceId === entry.voiceId && e.modelId === entry.modelId),
    );
    filtered.unshift({ ...entry, updatedAt: new Date().toISOString() });
    const characterVoices = { ...current.characterVoices };
    if (entry.approvedForCharacter && entry.voiceId) {
      characterVoices[entry.approvedForCharacter] = entry.voiceId;
    }
    const next = { characterVoices, evaluations: filtered.slice(0, 80) };
    await fs.writeFile(this.approvalsPath, JSON.stringify(next, null, 2), 'utf8');
    return next;
  }

  getQuotaStats(): AudioQuotaStats {
    this.resetDailyQuotaIfNeeded();
    return {
      date: this.quotaDate,
      liveRequestsToday: this.liveRequestsToday,
      dailyLimit: this.dailyLimit,
      cacheHitsToday: this.cacheHitsToday,
      deduplicatedHitsToday: this.deduplicatedHitsToday,
      estimatedCharactersProcessed: this.estimatedCharactersProcessed,
      cloudTtsConfigured: Boolean(process.env.GOOGLE_CLOUD_TTS_API_KEY?.trim()),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10),
      storageDriver: process.env.AUDIO_S3_BUCKET
        ? 's3_r2_configured'
        : process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
          ? 'supabase_storage'
          : 'local_filesystem',
    };
  }

  async getCapabilities() {
    if (!this.manifestLoaded) await this.reloadManifest();
    const approvals = await this.getApprovals();
    return {
      voiceDirectionVersion: VOICE_DIRECTION_VERSION,
      audioConfigVersion: AUDIO_CONFIG_VERSION,
      supportedModels: [
        { id: 'gemini-3.8-flash-lite-tts', role: 'primary_narration', status: 'verified' },
        { id: 'gemini-3.8-flash-tts', role: 'audition_and_expressive_storytelling', status: 'verified' },
      ],
      candidateVoices: CANDIDATE_GEMINI_VOICES,
      characterVoiceBible: CHARACTER_VOICE_BIBLE,
      approvedCharacterVoices: approvals.characterVoices,
      evaluations: approvals.evaluations,
      auditionPhrases: AUDITION_TEST_PHRASES,
      manifestAssetCount: this.manifestEntries.length,
      quota: this.getQuotaStats(),
    };
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    this.rateWindowTimestamps = this.rateWindowTimestamps.filter((ts) => now - ts < 60_000);
    if (this.rateWindowTimestamps.length >= 28) return false;
    this.rateWindowTimestamps.push(now);
    return true;
  }

  private async tryCloudTtsFallback(
    text: string,
    lang: SpeechLang,
    characterId: CharacterVoiceId,
  ): Promise<Buffer | null> {
    const cloudKey = process.env.GOOGLE_CLOUD_TTS_API_KEY?.trim();
    if (!cloudKey) return null;
    const char = CHARACTER_VOICE_BIBLE[characterId] || CHARACTER_VOICE_BIBLE.rimau;
    const voiceName = lang === 'ms-MY' ? char.preferredCloudTtsVoices[0] : undefined;
    try {
      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(cloudKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: lang,
            ...(voiceName ? { name: voiceName } : {}),
          },
          audioConfig: {
            audioEncoding: 'LINEAR16',
            sampleRateHertz: 24000,
            speakingRate: 1.0,
            pitch: 0.0,
          },
        }),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { audioContent?: string };
      if (!json.audioContent) return null;
      return Buffer.from(json.audioContent, 'base64');
    } catch {
      return null;
    }
  }

  private async callGeminiTtsWithRetry(params: {
    text: string;
    voiceName: string;
    modelId: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
    stylePrompt: string;
  }): Promise<{ wavBuffer: Buffer; usedSpeechMetadata: boolean } | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim().length <= 10) return null;

    const ai = new GoogleGenAI({
      apiKey,
      apiVersion: 'v1beta',
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const invoke = async (useSpeechMetadata: boolean) => {
      const response = await ai.models.generateContent({
        model: params.modelId,
        contents: [
          {
            role: 'user',
            parts: [
              useSpeechMetadata
                ? {
                    text: params.text,
                    speechMetadata: { style: params.stylePrompt },
                  }
                : {
                    text: params.text,
                  },
            ],
          },
        ],
        config: {
          ...(useSpeechMetadata ? {} : { systemInstruction: params.stylePrompt }),
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: params.voiceName },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    };

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        let base64: string | undefined;
        let usedSpeechMetadata = true;
        try {
          base64 = await invoke(true);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('speechMetadata')) {
            usedSpeechMetadata = false;
            base64 = await invoke(false);
          } else {
            throw err;
          }
        }
        if (!base64) return null;
        return {
          wavBuffer: Buffer.from(base64, 'base64'),
          usedSpeechMetadata,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (attempt === 0 && (msg.includes('429') || msg.includes('503') || msg.includes('UNAVAILABLE'))) {
          await new Promise((r) => setTimeout(r, 650));
          continue;
        }
        console.warn('Gemini TTS generation error:', msg);
        return null;
      }
    }
    return null;
  }

  async synthesize(req: TtsGenerationRequest): Promise<TtsGenerationResult> {
    this.resetDailyQuotaIfNeeded();
    if (!this.manifestLoaded) await this.reloadManifest();

    const characterId: CharacterVoiceId = req.characterId || 'rimau';
    const deliveryProfile: DeliveryProfileId = req.deliveryProfile || 'instruction';
    const lang: SpeechLang = req.lang || 'ms-MY';
    const pronunciationMode = resolvePronunciationMode(req.text, req.subjectId, req.pronunciationMode);
    const normalizedText = normalizeDialogueText(req.text, lang, pronunciationMode).slice(0, 480);

    const approvals = await this.getApprovals();
    const charProfile = CHARACTER_VOICE_BIBLE[characterId] || CHARACTER_VOICE_BIBLE.rimau;
    const voiceId = req.voiceOverride || approvals.characterVoices[characterId] || charProfile.defaultGeminiVoice;
    const modelId = req.modelOverride || 'gemini-3.8-flash-lite-tts';

    const cacheKey = computeAudioCacheKey({
      normalizedText,
      lang,
      voiceId,
      provider: 'gemini_tts',
      modelId,
      deliveryProfile,
      pronunciationMode,
    });

    if (!normalizedText) {
      return {
        available: false,
        provider: 'fallback_text_only',
        modelId,
        voiceId,
        characterId,
        deliveryProfile,
        lang,
        cacheKey,
        cached: false,
        mimeType: 'audio/wav',
        sampleRate: 24000,
        channels: 1,
        bitsPerSample: 16,
        durationSec: 0,
        peak: 0,
        rms: 0,
        usedSpeechMetadata: false,
        normalizedText: '',
        notice: 'Teks kosong.',
      };
    }

    // Section 11: Do not use ordinary AI narration to replace verified Quranic recitation
    if (req.audioCategory === 'quran_recitation') {
      return {
        available: false,
        provider: 'fallback_text_only',
        modelId,
        voiceId,
        characterId,
        deliveryProfile,
        lang,
        cacheKey,
        cached: false,
        mimeType: 'audio/wav',
        sampleRate: 24000,
        channels: 1,
        bitsPerSample: 16,
        durationSec: 0,
        peak: 0,
        rms: 0,
        usedSpeechMetadata: false,
        normalizedText,
        notice: 'Bacaan Al-Quran memerlukan audio qari bertauliah yang disemak guru Pendidikan Islam.',
      };
    }

    // Section 10: Do not fabricate unverified indigenous language pronunciation
    if (
      req.subjectId &&
      INDIGENOUS_SUBJECT_IDS.has(req.subjectId) &&
      req.audioCategory === 'pronunciation_drill'
    ) {
      return {
        available: false,
        provider: 'fallback_text_only',
        modelId,
        voiceId,
        characterId,
        deliveryProfile,
        lang,
        cacheKey,
        cached: false,
        mimeType: 'audio/wav',
        sampleRate: 24000,
        channels: 1,
        bitsPerSample: 16,
        durationSec: 0,
        peak: 0,
        rms: 0,
        usedSpeechMetadata: false,
        normalizedText,
        notice: 'Latihan sebutan bahasa etnik memerlukan rakaman penutur jati yang disahkan guru pakar.',
      };
    }

    // Priority 1: Approved pre-generated static asset in AUDIO_MANIFEST.json
    if (!req.skipStaticManifest) {
      const staticMatch = this.manifestEntries.find(
        (m) =>
          (m.contentHash === cacheKey ||
            (normalizeDialogueText(m.transcript, m.locale, pronunciationMode) === normalizedText &&
              m.characterId === characterId &&
              m.deliveryProfile === deliveryProfile)) &&
          m.generationStatus === 'generated',
      );
      if (staticMatch) {
        const diskPath = path.join(process.cwd(), 'public', staticMatch.filePath.replace(/^\/+/, ''));
        try {
          await fs.access(diskPath);
          this.cacheHitsToday += 1;
          return {
            available: true,
            provider: 'pregenerated_manifest',
            modelId: staticMatch.modelId,
            voiceId: staticMatch.voiceId,
            characterId: staticMatch.characterId,
            deliveryProfile: staticMatch.deliveryProfile,
            lang: staticMatch.locale,
            cacheKey: staticMatch.contentHash,
            cached: true,
            mimeType: staticMatch.audioFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav',
            sampleRate: staticMatch.sampleRate,
            channels: 1,
            bitsPerSample: 16,
            durationSec: staticMatch.durationSec,
            peak: 0.84,
            rms: 0.14,
            usedSpeechMetadata: true,
            audioUrl: staticMatch.filePath,
            normalizedText,
          };
        } catch {
          // File missing on disk, continue cleanly
        }
      }
    }

    // Priority 2a: In-memory normalized WAV cache
    const memCached = this.memoryWavCache.get(cacheKey);
    if (memCached) {
      this.cacheHitsToday += 1;
      return {
        ...memCached.meta,
        cached: true,
        provider: 'gemini_tts_cache',
        audioBase64: memCached.wav.toString('base64'),
      };
    }

    // Priority 2b: Disk persistent WAV cache (.data/audio-cache/<hash>.wav)
    const diskCacheWav = path.join(this.cacheDir, `${cacheKey}.wav`);
    const diskCacheMeta = path.join(this.cacheDir, `${cacheKey}.json`);
    try {
      const [wavBuf, metaRaw] = await Promise.all([
        fs.readFile(diskCacheWav),
        fs.readFile(diskCacheMeta, 'utf8'),
      ]);
      const meta = JSON.parse(metaRaw) as Omit<TtsGenerationResult, 'audioBase64'>;
      this.memoryWavCache.set(cacheKey, { wav: wavBuf, meta });
      this.cacheHitsToday += 1;
      return {
        ...meta,
        cached: true,
        provider: 'gemini_tts_cache',
        audioBase64: wavBuf.toString('base64'),
      };
    } catch {
      // Cache miss
    }

    if (req.allowDynamicAi === false) {
      return {
        available: false,
        provider: 'fallback_text_only',
        modelId,
        voiceId,
        characterId,
        deliveryProfile,
        lang,
        cacheKey,
        cached: false,
        mimeType: 'audio/wav',
        sampleRate: 24000,
        channels: 1,
        bitsPerSample: 16,
        durationSec: 0,
        peak: 0,
        rms: 0,
        usedSpeechMetadata: false,
        normalizedText,
        notice: 'Penjanaan suara AI dinamik dimatikan oleh ibu bapa. Memaparkan arahan teks.',
      };
    }

    // In-flight deduplication
    const existingFlight = this.inFlight.get(cacheKey);
    if (existingFlight) {
      this.deduplicatedHitsToday += 1;
      return existingFlight;
    }

    const task = (async (): Promise<TtsGenerationResult> => {
      try {
        if (this.liveRequestsToday >= this.dailyLimit || !this.checkRateLimit()) {
          return {
            available: false,
            provider: 'fallback_text_only',
            modelId,
            voiceId,
            characterId,
            deliveryProfile,
            lang,
            cacheKey,
            cached: false,
            mimeType: 'audio/wav',
            sampleRate: 24000,
            channels: 1,
            bitsPerSample: 16,
            durationSec: 0,
            peak: 0,
            rms: 0,
            usedSpeechMetadata: false,
            normalizedText,
            notice: 'Had kuota penjanaan suara dicapai buat sementara waktu.',
          };
        }

        const stylePrompt = buildSpeechDirectionPrompt({
          characterId,
          deliveryProfile,
          lang,
          pronunciationMode,
          audioCategory: req.audioCategory,
        });

        this.liveRequestsToday += 1;
        this.estimatedCharactersProcessed += normalizedText.length;

        const geminiOut = await this.callGeminiTtsWithRetry({
          text: normalizedText,
          voiceName: voiceId,
          modelId,
          stylePrompt,
        });

        let provider: TtsGenerationResult['provider'] = 'gemini_tts_live';
        let rawWav = geminiOut?.wavBuffer || null;
        const usedSpeechMetadata = geminiOut?.usedSpeechMetadata ?? false;

        // Tertiary provider: Verified Google Cloud TTS ms-MY voice if Gemini unavailable
        if (!rawWav) {
          rawWav = await this.tryCloudTtsFallback(normalizedText, lang, characterId);
          if (rawWav) provider = 'google_cloud_tts';
        }

        if (!rawWav) {
          return {
            available: false,
            provider: 'fallback_text_only',
            modelId,
            voiceId,
            characterId,
            deliveryProfile,
            lang,
            cacheKey,
            cached: false,
            mimeType: 'audio/wav',
            sampleRate: 24000,
            channels: 1,
            bitsPerSample: 16,
            durationSec: 0,
            peak: 0,
            rms: 0,
            usedSpeechMetadata,
            normalizedText,
            notice: 'Perkhidmatan suara langsung tidak tersedia buat masa ini.',
          };
        }

        const inspected = inspectAndNormalizeWav(rawWav);
        const resultMeta: Omit<TtsGenerationResult, 'audioBase64'> = {
          available: true,
          provider,
          modelId,
          voiceId,
          characterId,
          deliveryProfile,
          lang,
          cacheKey,
          cached: false,
          mimeType: 'audio/wav',
          sampleRate: inspected.sampleRate,
          channels: inspected.channels,
          bitsPerSample: inspected.bitsPerSample,
          durationSec: inspected.durationSec,
          peak: inspected.peak,
          rms: inspected.rms,
          usedSpeechMetadata,
          normalizedText,
        };

        if (this.memoryWavCache.size >= 80) {
          const oldest = this.memoryWavCache.keys().next().value;
          if (oldest) this.memoryWavCache.delete(oldest);
        }
        this.memoryWavCache.set(cacheKey, { wav: inspected.cleanWavBuffer, meta: resultMeta });

        // Persist to durable cache asynchronously (non-blocking if readonly)
        void fs
          .mkdir(this.cacheDir, { recursive: true })
          .then(() =>
            Promise.all([
              fs.writeFile(diskCacheWav, inspected.cleanWavBuffer),
              fs.writeFile(diskCacheMeta, JSON.stringify(resultMeta, null, 2), 'utf8'),
            ]),
          )
          .catch(() => {});

        return {
          ...resultMeta,
          audioBase64: inspected.cleanWavBuffer.toString('base64'),
        };
      } finally {
        this.inFlight.delete(cacheKey);
      }
    })();

    this.inFlight.set(cacheKey, task);
    return task;
  }
}

export const audioBackendService = new AudioEngineBackendService();
