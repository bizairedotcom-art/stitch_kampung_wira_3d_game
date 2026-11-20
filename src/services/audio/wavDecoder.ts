/**
 * Correct RIFF/WAVE binary parser & Web Audio AudioBuffer decoder.
 * - Inspects `fmt ` chunk explicitly (sampleRate, channels, bitsPerSample, byteRate)
 *   so 24000 Hz PCM from Gemini TTS is NEVER misinterpreted as 44100/48000 Hz.
 * - Strips non-audio metadata chunks (e.g. trailing C2PA provenance chunk)
 *   so metadata bytes are never decoded as audio noise.
 * - Applies gentle peak protection (-1.5 dBFS headroom) without metallic compression.
 */

export interface ParsedWavAudio {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  byteRate: number;
  frameCount: number;
  durationSec: number;
  peak: number;
  rms: number;
  samplesPerChannel: Float32Array[];
  strippedChunks: string[];
}

const TARGET_PEAK_LINEAR = 0.84; // -1.5 dBFS headroom

export function isWavHeader(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 44) return false;
  return (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x41 && // A
    bytes[10] === 0x56 && // V
    bytes[11] === 0x45 // E
  );
}

function readAscii(view: DataView, offset: number, length: number): string {
  let out = '';
  for (let i = 0; i < length && offset + i < view.byteLength; i++) {
    out += String.fromCharCode(view.getUint8(offset + i));
  }
  return out;
}

export function parseWavBytes(buffer: ArrayBuffer): ParsedWavAudio | null {
  const bytes = new Uint8Array(buffer);
  if (!isWavHeader(bytes)) return null;

  const view = new DataView(buffer);
  let sampleRate = 24000;
  let channels = 1;
  let bitsPerSample = 16;
  let audioFormat = 1;
  let dataOffset = -1;
  let dataSize = 0;
  const strippedChunks: string[] = [];

  let offset = 12;
  while (offset + 8 <= view.byteLength) {
    const chunkId = readAscii(view, offset, 4);
    const chunkSize = view.getUint32(offset + 4, true);
    const payloadOffset = offset + 8;

    if (chunkId === 'fmt ' && payloadOffset + 16 <= view.byteLength) {
      audioFormat = view.getUint16(payloadOffset, true);
      channels = Math.max(1, view.getUint16(payloadOffset + 2, true));
      sampleRate = Math.max(8000, view.getUint32(payloadOffset + 4, true));
      bitsPerSample = view.getUint16(payloadOffset + 14, true);
    } else if (chunkId === 'data') {
      dataOffset = payloadOffset;
      dataSize = Math.min(chunkSize, Math.max(0, view.byteLength - payloadOffset));
    } else {
      strippedChunks.push(chunkId.trim() || 'UNK');
    }

    offset = payloadOffset + chunkSize + (chunkSize % 2);
  }

  if (dataOffset < 0 || dataSize <= 0 || (audioFormat !== 1 && audioFormat !== 3)) {
    return null;
  }

  const bytesPerSample = Math.max(1, bitsPerSample / 8);
  const blockAlign = channels * bytesPerSample;
  const frameCount = Math.floor(dataSize / blockAlign);
  if (frameCount <= 0) return null;

  const samplesPerChannel: Float32Array[] = Array.from(
    { length: channels },
    () => new Float32Array(frameCount),
  );

  let peak = 0;
  let sumSq = 0;
  let totalCount = 0;

  for (let frame = 0; frame < frameCount; frame++) {
    for (let ch = 0; ch < channels; ch++) {
      const sampleByte = dataOffset + frame * blockAlign + ch * bytesPerSample;
      let val = 0;
      if (audioFormat === 3 && bitsPerSample === 32) {
        val = view.getFloat32(sampleByte, true);
      } else if (bitsPerSample === 16) {
        val = view.getInt16(sampleByte, true) / 32768;
      } else if (bitsPerSample === 8) {
        val = (view.getUint8(sampleByte) - 128) / 128;
      }
      const abs = Math.abs(val);
      if (abs > peak) peak = abs;
      sumSq += val * val;
      totalCount += 1;
      samplesPerChannel[ch][frame] = val;
    }
  }

  const rms = Math.sqrt(sumSq / Math.max(1, totalCount));

  // Gentle headroom limiting / loudness lift without distortion or pitch shift
  let gain = 1.0;
  if (peak > 0.88) {
    gain = TARGET_PEAK_LINEAR / peak;
  } else if (peak > 0.05 && rms < 0.06) {
    gain = Math.min(1.6, TARGET_PEAK_LINEAR / peak);
  }

  if (Math.abs(gain - 1.0) > 0.02) {
    for (let ch = 0; ch < channels; ch++) {
      const arr = samplesPerChannel[ch];
      for (let i = 0; i < arr.length; i++) {
        const scaled = arr[i] * gain;
        arr[i] = scaled > 0.96 ? 0.96 : scaled < -0.96 ? -0.96 : scaled;
      }
    }
    peak = Math.min(TARGET_PEAK_LINEAR, peak * gain);
  }

  return {
    sampleRate,
    channels,
    bitsPerSample,
    byteRate: sampleRate * blockAlign,
    frameCount,
    durationSec: Number((frameCount / sampleRate).toFixed(3)),
    peak: Number(peak.toFixed(4)),
    rms: Number((rms * gain).toFixed(4)),
    samplesPerChannel,
    strippedChunks,
  };
}

export function pcmToAudioBuffer(ctx: BaseAudioContext, parsed: ParsedWavAudio): AudioBuffer {
  // CRITICAL: Honor the exact source sampleRate (e.g. 24000 Hz) so Web Audio never speeds up or pitches up!
  const audioBuffer = ctx.createBuffer(parsed.channels, parsed.frameCount, parsed.sampleRate);
  for (let ch = 0; ch < parsed.channels; ch++) {
    audioBuffer.copyToChannel(new Float32Array(parsed.samplesPerChannel[ch]), ch);
  }
  return audioBuffer;
}

export async function decodeAudioPayload(
  ctx: BaseAudioContext,
  arrayBuffer: ArrayBuffer,
): Promise<{ buffer: AudioBuffer; sampleRate: number; channels: number; durationSec: number }> {
  const bytes = new Uint8Array(arrayBuffer);
  if (isWavHeader(bytes)) {
    const parsed = parseWavBytes(arrayBuffer);
    if (parsed) {
      return {
        buffer: pcmToAudioBuffer(ctx, parsed),
        sampleRate: parsed.sampleRate,
        channels: parsed.channels,
        durationSec: parsed.durationSec,
      };
    }
  }

  // Compressed assets (.mp3, .ogg, .m4a): Web Audio decodeAudioData preserves pitch & exact duration
  const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
  return {
    buffer: decoded,
    sampleRate: decoded.sampleRate,
    channels: decoded.numberOfChannels,
    durationSec: Number(decoded.duration.toFixed(3)),
  };
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToCleanWavBlob(buffer: ArrayBuffer): Blob {
  const parsed = parseWavBytes(buffer);
  if (!parsed) {
    return new Blob([buffer], { type: 'audio/wav' });
  }
  const dataBytes = parsed.frameCount * parsed.channels * 2;
  const out = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(out);
  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, parsed.channels, true);
  view.setUint32(24, parsed.sampleRate, true);
  view.setUint32(28, parsed.sampleRate * parsed.channels * 2, true);
  view.setUint16(32, parsed.channels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataBytes, true);

  let writeOff = 44;
  for (let f = 0; f < parsed.frameCount; f++) {
    for (let ch = 0; ch < parsed.channels; ch++) {
      const s = Math.max(-1, Math.min(1, parsed.samplesPerChannel[ch][f]));
      view.setInt16(writeOff, Math.round(s * 32767), true);
      writeOff += 2;
    }
  }
  return new Blob([out], { type: 'audio/wav' });
}
