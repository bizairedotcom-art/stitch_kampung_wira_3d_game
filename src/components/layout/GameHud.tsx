import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { audioEngine, SOUNDTRACK_CATALOG } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { COMPANIONS } from '@/utils/gameFactory';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const GameHud: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  const isOnline = useGameStore((s) => s.isOnline);
  const pendingSyncCount = useGameStore((s) => s.pendingSyncCount);
  const syncOfflineQueue = useGameStore((s) => s.syncOfflineQueue);

  const settings = useSettingsStore();
  const [musicOn, setMusicOn] = useState(audioEngine.getIsPlayingMusic());
  const [audioDrawerOpen, setAudioDrawerOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const learner = bundle?.learner;
  const companion = learner ? COMPANIONS[learner.companionId] : COMPANIONS.rimau;

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFF8F6]/95 border-b-4 border-[#5C240A] px-3 sm:px-6 py-2.5 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Player Profile & Companion Portrait */}
          <Link to="/avatar" className="flex items-center gap-2.5 bg-[#FFE2D6] border-2 border-[#78350F] rounded-full p-1 pr-3.5 shadow-sm hover:brightness-105 transition">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#F59E0B] bg-[#FEA619] shrink-0">
              <img src={companion.portraitImage} alt={companion.name} className="w-full h-full object-cover" />
              <span className="absolute -bottom-0.5 right-0 bg-[#006947] text-white font-display font-bold text-[10px] px-1.5 rounded-full">
                Tahap {learner?.level ?? 1}
              </span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-display font-extrabold text-sm sm:text-base text-[#351000] truncate max-w-28 sm:max-w-44">
                {learner?.name ?? 'Wira Muda'}
              </div>
              <div className="text-[11px] font-semibold text-[#855300] truncate">
                {learner?.className ?? 'Tahun 1 SK'}
              </div>
            </div>
          </Link>

          {/* Right: Live Counters & Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {!isOnline && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#FFE2D6] border-2 border-[#BA1A1A] text-[#BA1A1A] text-xs font-bold px-2.5 py-1 rounded-full">
                Luar Talian ({pendingSyncCount})
              </span>
            )}
            {isOnline && pendingSyncCount > 0 && (
              <button
                type="button"
                onClick={() => void syncOfflineQueue()}
                className="bg-[#06B6D4] text-white text-xs font-bold px-2.5 py-1 rounded-full border-2 border-[#004e5c]"
              >
                Segerak ({pendingSyncCount})
              </button>
            )}

            {/* Stars */}
            <div className="flex items-center gap-1 bg-[#FFE2D6] border-2 border-[#78350F] rounded-full px-2.5 py-1 shadow-inner" title="Bintang Gemilang">
              <span className="material-symbols-outlined icon-filled text-[#F59E0B] text-lg">star</span>
              <span className="font-display font-extrabold text-sm text-[#351000]">{learner?.stars ?? 0}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 bg-[#FFE2D6] border-2 border-[#78350F] rounded-full px-2.5 py-1 shadow-inner" title="Syiling Emas">
              <span className="material-symbols-outlined icon-filled text-[#D97706] text-lg">monetization_on</span>
              <span className="font-display font-extrabold text-sm text-[#351000]">{learner?.coins ?? 0}</span>
            </div>

            {/* Gems */}
            <div className="hidden md:flex items-center gap-1 bg-[#FFE2D6] border-2 border-[#78350F] rounded-full px-2.5 py-1 shadow-inner" title="Permata Hikmah">
              <span className="material-symbols-outlined icon-filled text-[#0D9668] text-lg">diamond</span>
              <span className="font-display font-extrabold text-sm text-[#351000]">{learner?.gems ?? 0}</span>
            </div>

            {installPrompt && (
              <button
                type="button"
                onClick={() => void handleInstall()}
                className="hidden sm:inline-flex items-center gap-1 bg-[#0D9668] text-white font-display font-bold text-xs px-3 py-2 rounded-xl border-2 border-[#00422b]"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Pasang
              </button>
            )}

            {/* Audio Controls Drawer Toggle */}
            <button
              type="button"
              aria-label="Kawalan Audio & Muzik"
              onClick={() => {
                audioEngine.playSfx('click');
                setAudioDrawerOpen((o) => !o);
              }}
              className="w-11 h-11 rounded-2xl btn-toy-wood flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#855300]">
                {settings.muted ? 'volume_off' : musicOn ? 'music_note' : 'volume_up'}
              </span>
            </button>

            {/* Parent Dashboard */}
            <Link
              to="/parent"
              aria-label="Zon Ibu Bapa"
              className="w-11 h-11 rounded-2xl btn-toy-wood flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#351000]">family_restroom</span>
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              aria-label="Tetapan"
              className="w-11 h-11 rounded-2xl btn-toy-wood flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#351000]">settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Audio Drawer Modal */}
      {audioDrawerOpen && (
        <div className="fixed inset-x-0 top-16 z-50 px-4 flex justify-end pointer-events-none">
          <div className="pointer-events-auto w-full max-w-sm panel-chengal rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base">Kawalan Audio Nusantara</h3>
              <button type="button" onClick={() => setAudioDrawerOpen(false)} className="font-bold text-[#BA1A1A]">✕</button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMusicOn(audioEngine.toggleMusic())}
                className={`btn-toy flex-1 rounded-xl font-bold text-sm ${musicOn ? 'btn-toy-emerald' : 'btn-toy-gold'}`}
              >
                {musicOn ? '⏸ Henti Muzik' : '▶ Main Muzik'}
              </button>
              <button
                type="button"
                onClick={() => settings.setAudioVolumes({ muted: !settings.muted })}
                className={`btn-toy flex-1 rounded-xl font-bold text-sm ${settings.muted ? 'btn-toy-crimson' : 'btn-toy-wood'}`}
              >
                {settings.muted ? '🔇 Bisu' : '🔊 Bunyi Aktif'}
              </button>
            </div>
            <label className="block text-xs font-bold">
              Pilih Lagu Latar ({SOUNDTRACK_CATALOG.length} Lagu)
              <select
                onChange={(e) => {
                  audioEngine.setTrack(e.target.value);
                  if (!audioEngine.getIsPlayingMusic()) {
                    setMusicOn(audioEngine.toggleMusic());
                  }
                }}
                className="mt-1 w-full rounded-xl border-2 border-[#78350F] bg-white p-2 text-xs font-semibold"
              >
                {SOUNDTRACK_CATALOG.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {t.instrument}
                  </option>
                ))}
              </select>
            </label>
            <div className="space-y-1.5 text-xs font-bold">
              <label className="flex items-center justify-between gap-2">
                <span>Muzik</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.musicVolume}
                  onChange={(e) => settings.setAudioVolumes({ musicVolume: Number(e.target.value) })}
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span>Kesan Bunyi (SFX)</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.sfxVolume}
                  onChange={(e) => settings.setAudioVolumes({ sfxVolume: Number(e.target.value) })}
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span>Suara Penceritaan</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.voiceVolume}
                  onChange={(e) => settings.setAudioVolumes({ voiceVolume: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="pt-1 border-t border-[#78350F]/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Kelajuan Suara</span>
                <div className="flex gap-1">
                  {[
                    { label: '0.8x', val: 0.8 },
                    { label: 'Normal', val: 0.95 },
                    { label: '1.15x', val: 1.15 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => settings.setAudioVolumes({ voiceRate: opt.val })}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold ${
                        Math.abs(settings.voiceRate - opt.val) < 0.04
                          ? 'bg-[#0D9668] text-white border-[#00422b]'
                          : 'bg-white text-[#351000] border-[#78350F]/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    audioEngine.speak(
                      `Hai ${learner?.name || 'Wira'}! Suara sahabat sedia membantu kamu belajar hari ini.`,
                      { companionId: learner?.companionId },
                    )
                  }
                  className="btn-toy btn-toy-turquoise flex-1 min-h-9 rounded-xl text-xs font-bold"
                >
                  🔊 Uji Suara
                </button>
                <button
                  type="button"
                  onClick={() => audioEngine.stopSpeech()}
                  className="btn-toy btn-toy-wood min-h-9 px-3 rounded-xl text-xs font-bold"
                >
                  ⏹ Henti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
