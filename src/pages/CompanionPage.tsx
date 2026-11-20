import React, { useState } from 'react';
import { SpeakButton } from '@/components/common/SpeakButton';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import { createCompanionScene } from '@/features/companion/CompanionEngine3D';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import type { CompanionId } from '@/types/user';
import { COMPANIONS } from '@/utils/gameFactory';

export const CompanionPage: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  const selectCompanion = useGameStore((s) => s.selectCompanion);
  const currentId = bundle?.learner.companionId ?? 'rimau';
  const [previewId, setPreviewId] = useState<CompanionId>(currentId);
  const [savedMsg, setSavedMsg] = useState('');

  const comp = COMPANIONS[previewId];

  const handleConfirm = async () => {
    await selectCompanion(previewId);
    audioEngine.playSfx('kompang');
    audioEngine.speak(comp.greeting, { companionId: previewId });
    setSavedMsg(`${comp.name} kini sahabat utama kamu!`);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4">
        <h1 className="font-display font-black text-2xl text-[#351000]">Pilih Sahabat Wira Nusantara</h1>
        <p className="text-sm font-semibold text-[#78350F]">
          Sahabat Rimba menemani kamu memberi petunjuk dan mengira bintang di setiap rumah ilmu!
        </p>
      </div>

      <div className="panel-chengal rounded-3xl p-4 space-y-4">
        <ThreeViewport
          heightClassName="h-64 sm:h-72"
          ariaLabel="Model 3D Sahabat Wira"
          deps={[previewId]}
          setupScene={(ctx) => createCompanionScene(ctx, previewId)}
          fallback2D={
            <div className="h-full bg-[#ECFDF5] flex items-center justify-center">
              <img src={comp.portraitImage} alt={comp.name} className="h-52 rounded-full object-cover border-4 border-[#F59E0B]" />
            </div>
          }
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FFFBEB] rounded-2xl p-4 border-2 border-[#78350F]/40">
          <img src={comp.portraitImage} alt={comp.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#F59E0B] shrink-0" />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display font-black text-2xl text-[#006947]">{comp.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEA619] text-[#351000]">{comp.species}</span>
            </div>
            <p className="text-sm font-bold text-[#78350F]">{comp.role} • {comp.specialAbility}</p>
            <p className="text-sm text-[#351000]">{comp.personality}</p>
          </div>
          <SpeakButton
            text={comp.greeting}
            label="Dengar Suara"
            stopLabel="Henti Suara"
            options={{ companionId: previewId }}
            className="btn-toy btn-toy-turquoise px-4 rounded-2xl font-bold text-sm shrink-0 flex items-center gap-1"
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(COMPANIONS) as CompanionId[]).map((id) => {
            const c = COMPANIONS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => { audioEngine.playSfx('click'); setPreviewId(id); }}
                className={`rounded-2xl p-2 border-2 flex flex-col items-center transition ${
                  previewId === id ? 'bg-[#FEA619] border-[#351000] scale-105' : 'bg-white border-[#78350F]/30'
                }`}
              >
                <img src={c.portraitImage} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                <span className="font-display font-bold text-xs mt-1">{c.name}</span>
              </button>
            );
          })}
        </div>

        {savedMsg && <p className="text-center font-bold text-[#006947]">{savedMsg}</p>}
        <button type="button" onClick={() => void handleConfirm()} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-extrabold text-lg">
          {currentId === previewId ? `✓ ${comp.name} Sedang Menemani Kamu` : `Pilih ${comp.name} Sebagai Sahabat!`}
        </button>
      </div>
    </div>
  );
};
