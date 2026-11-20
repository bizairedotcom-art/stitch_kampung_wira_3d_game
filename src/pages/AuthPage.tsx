import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { audioEngine } from '@/services/audioEngine';
import { useAuthStore } from '@/stores/useAuthStore';

export const AuthPage: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register, loginDemo, backendMode, error, clearError, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinCode, setPinCode] = useState('1234');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (mode === 'register') {
        await register({ name, email, password, pinCode });
        audioEngine.playSfx('kompang');
        navigate('/onboarding/learner');
      } else {
        await login({ email, password });
        audioEngine.playSfx('success');
        const learners = useAuthStore.getState().learners;
        navigate(learners.length === 0 ? '/onboarding/learner' : '/village');
      }
    } catch {
      audioEngine.playSfx('nudge');
    }
  };

  const handleDemo = async () => {
    clearError();
    await loginDemo();
    audioEngine.playSfx('kompang');
    navigate('/village');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C7F0FE] via-[#FFF8F6] to-[#FFEAE1] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Gate Hero Artwork */}
        <div className="panel-chengal rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-64 sm:h-80">
            <img
              src="/assets/stitch/remote-131d8c905b1a4aea.jpg"
              alt="Pintu Gerbang Utama Kampung Wira 3D"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#351000]/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <div className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#351000] font-display font-extrabold text-xs px-3 py-1 rounded-full w-fit mb-2">
                KSSR Semakan 2017 • Tahun 1 SK
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-stroke-wood text-[#FFFBEB]">
                Kampung Wira 3D
              </h1>
              <p className="text-sm font-medium text-[#FEF3C7] mt-1">
                15 Subjek Tahun 1, Kampung 3D Interaktif, Studio Avatar & 5 Sahabat Rimba.
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#FFFBEB] flex items-center gap-3">
            <img
              src="/assets/stitch/remote-646325e079ef8c04.jpg"
              alt="Rimau Maskot"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#78350F]"
            />
            <p className="text-xs sm:text-sm font-semibold text-[#351000]">
              “Selamat datang! Daftar akaun ibu bapa untuk simpan kemajuan anak, atau cuba Mod Demo segera.”
            </p>
          </div>
        </div>

        {/* Auth Form Panel */}
        <div className="panel-chengal rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F]/30 px-3 py-2 text-xs font-bold text-[#78350F]">
            <span>
              Mod Backend:{' '}
              {backendMode === 'LARAVEL_API'
                ? 'LARAVEL_API (Pelayan)'
                : backendMode === 'SUPABASE'
                  ? 'SUPABASE (Awan)'
                  : 'LOCAL_DEMO (IndexedDB)'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-[#0D9668] text-white text-[10px]">
              {backendMode === 'LOCAL_DEMO' ? 'Storan Tempatan' : 'Segerak Awan'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setMode('login'); clearError(); }}
              className={`btn-toy flex-1 rounded-2xl font-display font-bold ${mode === 'login' ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
            >
              Log Masuk
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); clearError(); }}
              className={`btn-toy flex-1 rounded-2xl font-display font-bold ${mode === 'register' ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
            >
              Daftar Baharu
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block font-display font-bold text-xs mb-1">Nama Ibu Bapa / Penjaga</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Puan Aisyah"
                  className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-semibold"
                />
              </div>
            )}
            <div>
              <label className="block font-display font-bold text-xs mb-1">E-mel Penjaga</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ibu@contoh.my"
                className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-semibold"
              />
            </div>
            <div>
              <label className="block font-display font-bold text-xs mb-1">Kata Laluan</label>
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 4 aksara"
                className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-semibold"
              />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block font-display font-bold text-xs mb-1">PIN Zon Ibu Bapa (4 Digit)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-display font-bold tracking-widest"
                />
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-[#FFDAD6] border-2 border-[#BA1A1A] p-3 text-sm font-bold text-[#93000A]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-extrabold text-lg"
            >
              {isLoading ? 'Memproses...' : mode === 'register' ? 'Cipta Akaun Penjaga' : 'Masuk Pintu Gerbang'}
            </button>
          </form>

          <div className="relative py-1 text-center">
            <span className="bg-[#FFF8F6] px-3 text-xs font-bold text-[#78350F] rounded-full">ATAU</span>
          </div>

          <button
            type="button"
            onClick={() => void handleDemo()}
            disabled={isLoading}
            className="btn-toy btn-toy-gold w-full rounded-2xl font-display font-extrabold text-base flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">explore</span>
            Teroka Sekarang (Mod Demo Tempatan)
          </button>
          <p className="text-[11px] text-center text-[#78350F] font-medium">
            {backendMode === 'LARAVEL_API'
              ? 'Mod Demo memulakan profil sampel sementara pada pelayan Laravel.'
              : backendMode === 'SUPABASE'
                ? 'Akaun, profil murid, kemajuan & kampung disimpan terus ke pangkalan data Supabase.'
                : 'Mod Demo (LOCAL_DEMO) menyimpan profil, avatar, kemajuan & kampung dalam IndexedDB pelayar.'}
          </p>
        </div>
      </div>
    </div>
  );
};
