import {
  AUDIO_CONFIG_VERSION,
  VOICE_DIRECTION_VERSION,
  type CharacterVoiceId,
  type DeliveryProfileId,
  type PronunciationMode,
  type SpeechLang,
} from '@/shared/voiceBible';

export interface AudioManifestAsset {
  audioId: string;
  characterId: CharacterVoiceId;
  language: string;
  locale: SpeechLang;
  transcript: string;
  normalizedTranscript?: string;
  subjectId?: string;
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
  generationStatus: 'generated' | 'pending' | 'verified';
  verificationStatus: string;
  rights?: string;
}

export interface AudioManifestDocument {
  version: string;
  generatedAt: string;
  assets: AudioManifestAsset[];
}

export interface CacheKeyInput {
  normalizedText: string;
  language: SpeechLang;
  voiceId: string;
  provider: string;
  modelId: string;
  deliveryProfile: DeliveryProfileId;
  pronunciationMode: PronunciationMode;
}

function fnv1aHex(str: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

export async function computeContentHash(input: CacheKeyInput): Promise<string> {
  const serialized = [
    input.normalizedText,
    input.language,
    input.voiceId,
    input.provider,
    input.modelId,
    input.deliveryProfile,
    input.pronunciationMode,
    AUDIO_CONFIG_VERSION,
    VOICE_DIRECTION_VERSION,
  ].join('|');

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoded = new TextEncoder().encode(serialized);
      const digest = await crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      // Fallback for restricted contexts
    }
  }
  return fnv1aHex(serialized);
}

const OFFLINE_CACHE_NAME = 'kampung-wira-audio-v2';

export class AudioCacheManager {
  private manifestAssets: AudioManifestAsset[] = [];
  private manifestLoading: Promise<AudioManifestAsset[]> | null = null;
  private byteCache = new Map<string, { bytes: ArrayBuffer; mimeType: string }>();
  private decodedBufferCache = new Map<string, AudioBuffer>();
  private maxBytesEntries = 48;
  private maxBufferEntries = 40;

  async loadManifest(): Promise<AudioManifestAsset[]> {
    if (this.manifestAssets.length > 0) return this.manifestAssets;
    if (this.manifestLoading) return this.manifestLoading;
    if (typeof window === 'undefined') return [];

    this.manifestLoading = fetch('/audio/AUDIO_MANIFEST.json', { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) return [];
        const doc = (await res.json()) as AudioManifestDocument;
        this.manifestAssets = Array.isArray(doc.assets) ? doc.assets : [];
        return this.manifestAssets;
      })
      .catch(() => [])
      .finally(() => {
        this.manifestLoading = null;
      });

    return this.manifestLoading;
  }

  async findPreGeneratedAsset(params: {
    audioId?: string;
    normalizedText: string;
    locale: SpeechLang;
    characterId: CharacterVoiceId;
    deliveryProfile: DeliveryProfileId;
  }): Promise<AudioManifestAsset | null> {
    const list = await this.loadManifest();
    if (!list.length) return null;

    if (params.audioId) {
      const byId = list.find((a) => a.audioId === params.audioId && a.generationStatus === 'generated');
      if (byId) return byId;
    }

    const cleanTarget = params.normalizedText.toLowerCase().trim();
    const exactMatch = list.find((a) => {
      if (a.generationStatus !== 'generated') return false;
      const t = (a.normalizedTranscript || a.transcript).toLowerCase().trim();
      return (
        t === cleanTarget &&
        a.locale === params.locale &&
        a.characterId === params.characterId &&
        a.deliveryProfile === params.deliveryProfile
      );
    });
    if (exactMatch) return exactMatch;

    // Secondary match ignoring deliveryProfile when transcript + character + locale match
    return (
      list.find((a) => {
        if (a.generationStatus !== 'generated') return false;
        const t = (a.normalizedTranscript || a.transcript).toLowerCase().trim();
        return t === cleanTarget && a.locale === params.locale && a.characterId === params.characterId;
      }) || null
    );
  }

  getDecodedBuffer(key: string): AudioBuffer | undefined {
    const hit = this.decodedBufferCache.get(key);
    if (hit) {
      // Refresh LRU order
      this.decodedBufferCache.delete(key);
      this.decodedBufferCache.set(key, hit);
    }
    return hit;
  }

  setDecodedBuffer(key: string, buffer: AudioBuffer) {
    if (this.decodedBufferCache.size >= this.maxBufferEntries) {
      const oldest = this.decodedBufferCache.keys().next().value;
      if (oldest) this.decodedBufferCache.delete(oldest);
    }
    this.decodedBufferCache.set(key, buffer);
  }

  async getCachedAudioBytes(key: string): Promise<{ bytes: ArrayBuffer; mimeType: string } | null> {
    const mem = this.byteCache.get(key);
    if (mem) return mem;

    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open(OFFLINE_CACHE_NAME);
        const match = await cache.match(`/__kw_audio_cache/${encodeURIComponent(key)}`);
        if (match) {
          const bytes = await match.arrayBuffer();
          const mimeType = match.headers.get('Content-Type') || 'audio/wav';
          this.setMemoryBytes(key, bytes, mimeType);
          return { bytes, mimeType };
        }
      } catch {
        // Ignore restricted Cache API environments
      }
    }
    return null;
  }

  private setMemoryBytes(key: string, bytes: ArrayBuffer, mimeType: string) {
    if (this.byteCache.size >= this.maxBytesEntries) {
      const oldest = this.byteCache.keys().next().value;
      if (oldest) this.byteCache.delete(oldest);
    }
    this.byteCache.set(key, { bytes, mimeType });
  }

  async putCachedAudioBytes(key: string, bytes: ArrayBuffer, mimeType = 'audio/wav') {
    this.setMemoryBytes(key, bytes, mimeType);
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open(OFFLINE_CACHE_NAME);
        await cache.put(
          `/__kw_audio_cache/${encodeURIComponent(key)}`,
          new Response(bytes.slice(0), {
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          }),
        );
      } catch {
        // Ignore storage quota errors cleanly
      }
    }
  }

  releaseUnusedBuffers() {
    this.decodedBufferCache.clear();
  }

  getCacheStats() {
    return {
      manifestCount: this.manifestAssets.length,
      memoryClipCount: this.byteCache.size,
      decodedBufferCount: this.decodedBufferCache.size,
    };
  }
}
