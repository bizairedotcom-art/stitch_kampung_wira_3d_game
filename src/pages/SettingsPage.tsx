import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpeakButton } from '@/components/common/SpeakButton';
import { audioEngine, type VoiceOptionInfo } from '@/services/audioEngine';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { GraphicsPreset } from '@/types/game';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const parent = useAuthStore((s) => s.parent);
  const backendMode = useAuthStore((s) => s.backendMode);
  const learnerName = useGameStore((s) => s.bundle?.learner.name) || 'Wira';
  const companionId = useGameStore((s) => s.bundle?.learner.companionId) || 'rimau';
  const settings = useSettingsStore();
  const [voices, setVoices] = useState<VoiceOptionInfo[]>(() => audioEngine.listAvailableVoices());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVoices(audioEngine.listAvailableVoices());
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-5">
        <h1 className="font-display font-black text-2xl text-[#351000]">Tetapan Grafik, Audio & Suara</h1>
        <p className="text-sm text-[#78350F]">Sesuaikan prestasi 3D dan suara penceritaan mengikut keselesaan murid.</p>
      </div>

      {/* Voice & Audio Settings */}
      <div className="panel-chengal rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-black text-lg text-[#006947]">Suara Sahabat & Penceritaan</h2>
            <p className="text-xs text-[#78350F]">Pelarasan kelajuan, kelantangan & pilihan suara Bahasa Melayu / Inggeris / Arab.</p>
          </div>
          <SpeakButton
            text={`Hai ${learnerName}! Ini ialah contoh suara sahabat Kampung Wira. Selamat belajar dan mengumpul bintang!`}
            label="Uji Suara"
            stopLabel="Henti Uji"
            options={{ companionId }}
            className="btn-toy btn-toy-turquoise px-4 min-h-10 rounded-xl text-xs font-bold flex items-center gap-1"
          />
        </div>

        <div>
          <label className="block font-display font-bold text-sm mb-2">Kelajuan Bacaan Suara</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Perlahan (0.8x)', val: 0.8 },
              { label: 'Normal (0.95x)', val: 0.95 },
              { label: 'Cergas (1.15x)', val: 1.15 },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => settings.setAudioVolumes({ voiceRate: opt.val })}
                className={`btn-toy rounded-xl font-display font-bold text-xs sm:text-sm ${
                  Math.abs(settings.voiceRate - opt.val) < 0.04 ? 'btn-toy-emerald' : 'btn-toy-wood'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 space-y-1.5">
            <div className="flex justify-between font-display font-bold text-xs">
              <span>Kelantangan Suara</span>
              <span>{Math.round(settings.voiceVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.voiceVolume}
              onChange={(e) => settings.setAudioVolumes({ voiceVolume: Number(e.target.value) })}
              className="w-full accent-[#0D9668]"
            />
          </label>

          <label className="bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 space-y-1.5">
            <div className="flex justify-between font-display font-bold text-xs">
              <span>Muzik Latar</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={(e) => settings.setAudioVolumes({ musicVolume: Number(e.target.value) })}
              className="w-full accent-[#0D9668]"
            />
          </label>
        </div>

        <label className="flex items-center justify-between gap-3 bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30">
          <div>
            <div className="font-display font-bold text-sm">Pilihan Suara Peranti</div>
            <div className="text-xs text-[#3d4a42]">Auto memilih suara paling jelas mengikut bahasa subjek.</div>
          </div>
          <select
            value={settings.preferredVoiceUri}
            onChange={(e) => settings.setAudioVolumes({ preferredVoiceUri: e.target.value })}
            className="max-w-[210px] rounded-xl border-2 border-[#78350F] bg-white px-3 py-1.5 font-bold text-xs"
          >
            <option value="auto">Auto Terbaik (Disyorkan)</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 cursor-pointer">
          <div>
            <div className="font-display font-bold text-sm">Baca Langkah Pelajaran Secara Automatik</div>
            <div className="text-xs text-[#3d4a42]">Membacakan teks langkah atau soalan baharu secara automatik.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSpeak}
            onChange={(e) => settings.setAutoSpeak(e.target.checked)}
            className="w-6 h-6 accent-[#0D9668]"
          />
        </label>
      </div>

      <div className="panel-chengal rounded-3xl p-5 space-y-4">
        <div>
          <label className="block font-display font-bold text-sm mb-2">Kualiti Grafik 3D (WebGL)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'ultra'] as GraphicsPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => settings.setGraphicsPreset(preset)}
                className={`btn-toy rounded-xl font-display font-bold text-sm uppercase ${
                  settings.graphicsPreset === preset ? 'btn-toy-emerald' : 'btn-toy-wood'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center justify-between bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 cursor-pointer">
          <div>
            <div className="font-display font-bold text-sm">Mod 2D Aksesibel (Tanpa WebGL)</div>
            <div className="text-xs text-[#3d4a42]">Gunakan paparan ilustrasi 2D pantas untuk peranti lama.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.fallback2DMode}
            onChange={(e) => settings.setFallback2DMode(e.target.checked)}
            className="w-6 h-6 accent-[#0D9668]"
          />
        </label>

        <label className="flex items-center justify-between bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 cursor-pointer">
          <div>
            <div className="font-display font-bold text-sm">Kurangkan Pergerakan (Reduced Motion)</div>
            <div className="text-xs text-[#3d4a42]">Mengurangkan animasi pantas di seluruh aplikasi.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => settings.setReducedMotion(e.target.checked)}
            className="w-6 h-6 accent-[#0D9668]"
          />
        </label>

        <label className="flex items-center justify-between bg-[#FFFBEB] rounded-2xl p-3 border-2 border-[#78350F]/30 cursor-pointer">
          <div>
            <div className="font-display font-bold text-sm">Bahasa Antaramuka</div>
            <div className="text-xs text-[#3d4a42]">Lalai: Bahasa Melayu (KSSR SK Tahun 1)</div>
          </div>
          <select
            value={settings.language}
            onChange={(e) => settings.setLanguage(e.target.value as 'ms' | 'en')}
            className="rounded-xl border-2 border-[#78350F] bg-white px-3 py-1.5 font-bold text-sm"
          >
            <option value="ms">Bahasa Melayu</option>
            <option value="en">English (Label Sokongan)</option>
          </select>
        </label>

        <div className="pt-2 border-t-2 border-[#78350F]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-[#78350F]">
            <div>Akaun aktif: {parent?.name} ({parent?.isDemo ? 'Mod Demo' : parent?.email})</div>
            <div>Mod Backend: {backendMode}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              void logout().then(() => navigate('/login'));
            }}
            className="btn-toy btn-toy-crimson px-5 rounded-2xl font-display font-bold text-sm"
          >
            Log Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
