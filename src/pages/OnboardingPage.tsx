import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import { createAvatarStudioScene } from '@/features/avatar/AvatarScene3D';
import { createCompanionScene } from '@/features/companion/CompanionEngine3D';
import { audioEngine } from '@/services/audioEngine';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CompanionId } from '@/types/user';
import { COMPANIONS, createDefaultAvatar } from '@/utils/gameFactory';

export const OnboardingPage: React.FC<{ step: 'learner' | 'avatar' | 'companion' | 'village' }> = ({ step }) => {
  const navigate = useNavigate();
  const { createLearner, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [className, setClassName] = useState('Tahun 1 Cerdik');
  const [avatar, setAvatar] = useState(createDefaultAvatar());
  const [companionId, setCompanionId] = useState<CompanionId>('rimau');
  const [currentStep, setCurrentStep] = useState(step);

  const finishOnboarding = async () => {
    await createLearner({
      name: name.trim() || 'Wira Muda',
      age: 7,
      className,
      avatar,
      companionId,
      onboardingCompleted: true,
    });
    audioEngine.playSfx('kompang');
    navigate('/village');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full panel-chengal rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-2xl text-[#006947]">Pendaftaran Wira Tahun 1</h1>
          <span className="px-3 py-1 rounded-full bg-[#FEA619] font-display font-bold text-xs">
            Langkah {currentStep === 'learner' ? 1 : currentStep === 'avatar' ? 2 : 3} / 3
          </span>
        </div>

        {currentStep === 'learner' && (
          <div className="space-y-4">
            <div>
              <label className="block font-display font-bold text-sm mb-1">Nama Anak / Murid</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Aisyah atau Amirul"
                className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-bold text-lg"
              />
            </div>
            <div>
              <label className="block font-display font-bold text-sm mb-1">Nama Kelas Tahun 1 (SK)</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-bold"
              />
            </div>
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => { audioEngine.playSfx('click'); setCurrentStep('avatar'); }}
              className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold text-lg disabled:opacity-50"
            >
              Seterusnya: Cipta Avatar 3D ➔
            </button>
          </div>
        )}

        {currentStep === 'avatar' && (
          <div className="space-y-4">
            <ThreeViewport
              heightClassName="h-64"
              ariaLabel="Pratonton Avatar 3D"
              deps={[avatar]}
              setupScene={(ctx) => createAvatarStudioScene(ctx, avatar, 'wave')}
              fallback2D={
                <div className="h-full bg-[#FFF1EB] flex items-center justify-center">
                  <img src="/assets/stitch/remote-b705206ceb7dd355.jpg" alt="Avatar 2D" className="h-52 object-contain" />
                </div>
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['songkok', 'hijab_merdeka', 'tengkolok', 'topi_rimba'] as const).map((hw) => (
                <button
                  key={hw}
                  type="button"
                  onClick={() => setAvatar((a) => ({ ...a, headwear: hw }))}
                  className={`btn-toy rounded-xl font-bold text-xs ${avatar.headwear === hw ? 'btn-toy-gold' : 'btn-toy-wood'}`}
                >
                  {hw.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep('learner')} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Kembali</button>
              <button type="button" onClick={() => setCurrentStep('companion')} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Pilih Sahabat ➔</button>
            </div>
          </div>
        )}

        {(currentStep === 'companion' || currentStep === 'village') && (
          <div className="space-y-4">
            <ThreeViewport
              heightClassName="h-56"
              ariaLabel="Pratonton Sahabat Rimba 3D"
              deps={[companionId]}
              setupScene={(ctx) => createCompanionScene(ctx, companionId)}
              fallback2D={
                <div className="h-full bg-[#ECFDF5] flex items-center justify-center">
                  <img src={COMPANIONS[companionId].portraitImage} alt={companionId} className="h-44 rounded-full object-cover" />
                </div>
              }
            />
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(COMPANIONS) as CompanionId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setCompanionId(id);
                  }}
                  className={`rounded-2xl p-2 border-2 flex flex-col items-center ${companionId === id ? 'bg-[#FEA619] border-[#78350F]' : 'bg-white border-[#78350F]/30'}`}
                >
                  <img src={COMPANIONS[id].portraitImage} alt={COMPANIONS[id].name} className="w-12 h-12 rounded-full object-cover" />
                  <span className="font-display font-bold text-xs mt-1">{COMPANIONS[id].name}</span>
                </button>
              ))}
            </div>
            <p className="text-center font-semibold text-sm text-[#78350F]">
              {COMPANIONS[companionId].name}: {COMPANIONS[companionId].greeting}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep('avatar')} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Kembali</button>
              <button type="button" disabled={isLoading} onClick={() => void finishOnboarding()} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-display font-extrabold">
                {isLoading ? 'Menyediakan Kampung...' : 'Masuk Kampung Wira! 🎉'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
